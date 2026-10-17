import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../assets/js/home-motion.js', import.meta.url), 'utf8')
  .replace(/^import .*\n/gm, '');

function setup({ reduced = false, width = 1440, supported = true } = {}) {
  const listeners = new Map();
  const media = new Map();
  const observers = [];
  const timelines = [];
  const motionListeners = [];
  const scenes = ['headphone', 'earbud'].map(kind => {
    const parts = [{ transform: 'translate(-55 0)' }, { transform: 'translate(-102 0)' }];
    return { dataset: { audioScene: kind }, parts, querySelectorAll: () => parts };
  });
  const canvas = {};
  let fieldsCreated = 0;
  let field;
  const gsap = {
    timeline(options) {
      const timeline = {
        options, steps: [], paused: options.paused,
        to(target, vars, position) { this.steps.push({ target, vars, position }); return this; },
        fromTo(target, from, vars, position) {
          this.steps.push({ target, from, vars, position });
          return this;
        },
        pause() { this.paused = true; return this; },
        play() { this.paused = false; return this; },
        progress(value) {
          if (value === 1) {
            this.steps.forEach(({ target, vars }) => {
              if (vars.attr) target.transform = vars.attr.transform;
            });
            options.onComplete?.();
          }
          return this;
        },
      };
      timelines.push(timeline);
      return timeline;
    },
  };
  const document = {
    hidden: false,
    querySelectorAll: selector => selector === '[data-audio-scene]' ? scenes : [],
    querySelector: selector => selector === '[data-signal-field]' ? canvas : null,
    addEventListener(name, callback) { listeners.set(name, callback); },
  };
  class Observer {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
    unobserve() {}
  }
  runInNewContext(source, {
    gsap,
    createSignalField() {
      fieldsCreated++;
      field = { timeline: gsap.timeline({ paused: true, repeat: -1 }) };
      return field;
    },
    window: {
      IntersectionObserver: supported ? Observer : undefined,
      matchMedia(query) {
        const result = {
          matches: query.includes('reduced') ? reduced : width >= (query.includes('1100') ? 1100 : 992),
          addEventListener(_, callback) { motionListeners.push({ query, callback }); },
        };
        media.set(query, result);
        return result;
      },
    },
    document,
    IntersectionObserver: Observer,
  });
  return {
    scenes, canvas, timelines,
    get field() { return field; },
    get fieldsCreated() { return fieldsCreated; },
    visible(target, value = true) { observers[0].callback([{ target, isIntersecting: value }]); },
    hidden(value) { document.hidden = value; listeners.get('visibilitychange')(); },
    reduce(value) {
      media.get('(prefers-reduced-motion: reduce)').matches = value;
      motionListeners.find(item => item.query.includes('reduced')).callback();
    },
  };
}

test('the headphone enters from above, pauses, then assembles once', () => {
  const app = setup();
  const scene = app.scenes[0];
  app.visible(scene);
  const timeline = app.timelines[0];
  assert.equal(timeline.steps.length, 3);
  const [entry, firstPart] = timeline.steps;
  assert.ok(entry.from.y < 0 && entry.from.autoAlpha === 0);
  assert.equal(entry.vars.y, 0);
  assert.equal(entry.vars.ease, 'power3.out');
  assert.ok(firstPart.position - entry.vars.duration >= 0.3, 'assembly waits after the entrance');
  assert.equal(timeline.paused, false);
  timeline.progress(1);
  assert.ok(scene.parts.every(part => part.transform === 'translate(0 0)'));
  app.visible(scene, false);
  app.visible(scene);
  assert.equal(app.timelines.length, 1, 'scrolling back does not replay completed devices');
});

test('assembly pauses offscreen and in hidden tabs, then resumes the same timeline', () => {
  const app = setup();
  app.visible(app.scenes[1]);
  app.visible(app.scenes[1], false);
  assert.equal(app.timelines[0].paused, true);
  app.visible(app.scenes[1]);
  assert.equal(app.timelines[0].paused, false);
  app.hidden(true);
  assert.equal(app.timelines[0].paused, true);
  app.hidden(false);
  assert.equal(app.timelines[0].paused, false);
  assert.equal(app.timelines.length, 1);
});

test('the canvas is created lazily and its GSAP timeline stops when hidden', () => {
  const app = setup();
  assert.equal(app.fieldsCreated, 0);
  app.visible(app.canvas);
  assert.equal(app.fieldsCreated, 1);
  assert.equal(app.field.timeline.paused, false);
  app.visible(app.canvas, false);
  assert.equal(app.field.timeline.paused, true);
  app.visible(app.canvas);
  app.hidden(true);
  assert.equal(app.field.timeline.paused, true);
  app.hidden(false);
  assert.equal(app.field.timeline.paused, false);
  assert.equal(app.fieldsCreated, 1);
});

test('reduced motion keeps the field static and settles an interrupted device assembly', () => {
  const app = setup({ reduced: true });
  app.visible(app.scenes[0]);
  app.visible(app.canvas);
  assert.equal(app.timelines.length, 1, 'only the paused, static field is initialized');
  assert.equal(app.field.timeline.paused, true);
  app.reduce(false);
  assert.equal(app.field.timeline.paused, false);
  app.reduce(true);
  assert.ok(app.scenes[0].parts.every(part => part.transform === 'translate(0 0)'));
  assert.equal(app.field.timeline.paused, true);
});

test('mobile skips decorations while the intermediate layout includes the analysis waveform', () => {
  for (const width of [390, 1050]) {
    const app = setup({ width });
    app.scenes.forEach(scene => app.visible(scene));
    app.visible(app.canvas);
    assert.equal(app.timelines.length, width === 390 ? 0 : 2);
    assert.equal(app.fieldsCreated, width === 390 ? 0 : 1);
  }
});

test('unsupported visibility observation leaves content unenhanced', () => {
  const app = setup({ supported: false });
  assert.equal(app.timelines.length, 0);
  assert.equal(app.fieldsCreated, 0);
});

const fieldSource = readFileSync(new URL('../assets/js/signal-field.js', import.meta.url), 'utf8')
  .replace('export function', 'function');

function setupRenderer({ contextAvailable = true } = {}) {
  let draws = 0;
  let resize;
  let themeChange;
  let timelineOptions;
  let strokes = [];
  let path;
  let steps = [];
  let restarts = 0;
  let seed = 7;
  const context = {
    setTransform() {}, clearRect() { draws++; strokes = []; }, save() {}, translate() {},
    scale() {}, restore() {},
    beginPath() { path = []; },
    moveTo(x, y) { path.push([x, y]); },
    lineTo(x, y) { path.push([x, y]); },
    stroke() { strokes.push(path); },
  };
  const canvas = {
    getContext: () => contextAvailable ? context : null,
    getBoundingClientRect: () => ({ width: 360, height: 120 }),
  };
  const seededMath = Object.create(Math);
  seededMath.random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  const scope = {
    canvas, result: undefined, Math: seededMath,
    window: { devicePixelRatio: 3, ResizeObserver: true },
    document: { documentElement: {} },
    getComputedStyle: () => ({ getPropertyValue: () => '#123456' }),
    ResizeObserver: class { constructor(callback) { resize = callback; } observe() {} },
    MutationObserver: class { constructor(callback) { themeChange = callback; } observe() {} },
    gsap: { timeline(options) {
      timelineOptions = options;
      return {
        clear() { steps = []; return this; },
        to(target, vars) { steps.push({ target, vars }); return this; },
        restart() { restarts++; return this; },
      };
    } },
  };
  runInNewContext(`${fieldSource}\nresult = createSignalField(canvas, gsap);`, scope);
  return {
    canvas, context, get draws() { return draws; }, get strokes() { return strokes; },
    get steps() { return steps; }, get options() { return timelineOptions; },
    get restarts() { return restarts; }, get result() { return scope.result; },
    resize() { resize(); }, theme() { themeChange(); },
  };
}

test('the waveform renders only on updates, theme changes, and resize, at bounded pixel density', () => {
  const app = setupRenderer();
  assert.equal(app.canvas.width, 720);
  assert.equal(app.canvas.height, 240);
  assert.equal(app.draws, 1);
  assert.equal(app.options.paused, true);
  assert.equal(app.options.onUpdate, undefined, 'the resting timeline cannot request frames');
  app.resize();
  app.theme();
  assert.equal(app.draws, 3);
  app.steps[0].vars.onUpdate();
  assert.equal(app.draws, 4);
  const rest = app.steps.at(-1);
  assert.equal(rest.vars.onUpdate, undefined, 'a sporadic rest does not redraw');
  assert.ok(rest.vars.duration >= 1.4 && rest.vars.duration <= 3.2);
});

test('an unavailable canvas context leaves the other homepage enhancements intact', () => {
  assert.equal(setupRenderer({ contextAvailable: false }).result, null);
});

test('the flat waveform evolves through new bounded shapes without resetting between sequences', () => {
  const app = setupRenderer();
  assert.equal(app.strokes.length, 41);
  assert.equal(app.context.lineCap, 'round');
  const morphs = app.steps.filter(step => step.vars.onUpdate);
  const targets = step => Array.from(step.target, (_, index) => step.vars.height(index));
  const first = targets(morphs[0]);
  assert.notDeepEqual(targets(morphs[1]), first, 'successive frames have different shapes');
  for (const step of morphs) {
    assert.ok(step.vars.duration >= 0.55 && step.vars.duration <= 0.85);
    step.target.forEach((bar, index) => { bar.height = step.vars.height(index); });
    step.vars.onUpdate();
    app.strokes.forEach(([start, end], index) => {
      assert.equal(start[0], end[0], 'every stroke stays vertical');
      assert.equal(start[0], -120 + index * 6, 'strokes never move sideways');
      assert.ok(end[1] - start[1] >= 4 && end[1] - start[1] <= 72);
    });
  }
  const lastShape = Array.from(morphs.at(-1).target, bar => bar.height);
  const previousRest = app.steps.at(-1).vars.duration;
  app.options.onComplete();
  assert.equal(app.restarts, 1);
  assert.notDeepEqual(targets(app.steps[0]), first, 'the next sequence is newly generated');
  assert.notEqual(app.steps.at(-1).vars.duration, previousRest, 'rests vary between sequences');
  assert.deepEqual(Array.from(app.steps[0].target, bar => bar.height), lastShape,
    'the next sequence starts from the actual current shape');
});
