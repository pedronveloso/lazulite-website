import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../assets/js/home-motion.js', import.meta.url), 'utf8')
  .replace(/^import .*\n/gm, '');
const bootSource = readFileSync(new URL('../assets/js/home-intro-boot.js', import.meta.url), 'utf8');

function setup({ reduced = false, width = 1440, supported = true, hash = '', scrollY = 0,
  navigation = 'navigate', bootOnly = false, failedTimeline = false } = {}) {
  const listeners = new Map();
  const media = new Map();
  const observers = [];
  const timelines = [];
  const attrs = new Map();
  const root = {
    setAttribute: (name, value) => attrs.set(name, value),
    getAttribute: name => attrs.get(name),
    removeAttribute: name => attrs.delete(name),
  };
  const scenes = ['headphone', 'earbud', 'headphone-right'].map(kind => {
    const parts = Array.from({ length: kind === 'headphone-right' ? 0 : 3 }, (_, i) => ({
      transform: kind === 'headphone' ? 'translate(0 0)' : `translate(${-55 - i * 47} 0)`,
      dataset: { expandedTransform: `translate(${-55 - i * 47} 0)` },
    }));
    return { dataset: { audioScene: kind }, parts, querySelectorAll: () => parts };
  });
  const canvas = {};
  const logo = {}, wordmark = {}, subtitle = {}, buttons = [{}, {}], lower = [{}, {}];
  const words = Array.from({ length: 4 }, () => ({}));
  const hero = {
    querySelector: selector => ({ '.hero-logo': logo, '.hero-title .accent-text': wordmark,
      '.hero-subtitle': subtitle })[selector],
    querySelectorAll: () => buttons,
  };
  const set = (targets, vars) => {
    for (const target of Array.isArray(targets) ? targets : [targets]) {
      if (vars.attr) target.transform = vars.attr.transform;
      if (vars.clearProps) target.cleaned = true;
    }
  };
  const gsap = {
    set,
    timeline(options) {
      if (failedTimeline) throw new Error('unavailable animation');
      const timeline = {
        options, steps: [], paused: options.paused, clock: 0,
        to(target, vars, position) { this.steps.push({ target, vars, position }); return this; },
        fromTo(target, from, vars, position) {
          this.steps.push({ target, from, vars, position }); return this;
        },
        call(callback, args, position) { this.steps.push({ callback, position }); return this; },
        time(value) { if (value === undefined) return this.clock; this.clock = value; return this; },
        pause() { this.paused = true; return this; },
        play() { this.paused = false; return this; },
        kill() { this.killed = true; return this; },
        complete() {
          this.steps.forEach(({ target, vars }) => { if (target) set(target, vars); });
          options.onComplete?.();
        },
      };
      timelines.push(timeline);
      return timeline;
    },
  };
  const emit = (name, event = {}) => [...(listeners.get(name) || [])].forEach(callback => callback(event));
  const window = {
    scrollY,
    IntersectionObserver: supported,
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(callback);
    },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback); },
    matchMedia(query) {
      if (!media.has(query)) media.set(query, {
        matches: query.includes('reduced') ? reduced : width >= (query.includes('1100') ? 1100 : 992),
        addEventListener(_, callback) { this.callback = callback; },
      });
      return media.get(query);
    },
  };
  const document = {
    documentElement: root, hidden: false,
    querySelectorAll: selector => selector === '[data-audio-scene]' ? scenes :
      selector === '#features [data-intro-word]' ? words : lower,
    querySelector: selector => selector === '[data-signal-field]' ? canvas : hero,
    addEventListener: window.addEventListener,
  };
  class Observer {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
  }
  let timer, fieldsCreated = 0, field;
  const scope = {
    gsap, window, document, location: { hash },
    performance: { getEntriesByType: () => [{ type: navigation }] },
    setTimeout: callback => { timer = callback; return 1; },
    clearTimeout: () => { timer = null; },
    console: { warn() {} },
    IntersectionObserver: Observer,
    createSignalField() {
      fieldsCreated++;
      field = { timeline: gsap.timeline({ paused: true }) };
      return field;
    },
  };
  const start = () => runInNewContext(source, scope);
  runInNewContext(bootSource, scope);
  if (!bootOnly) start();
  return {
    scenes, canvas, timelines, logo, wordmark, subtitle, buttons, lower, words, attrs, emit, start,
    get field() { return field; }, get fieldsCreated() { return fieldsCreated; },
    expireBoot() { timer?.(); },
    visible(target, value = true) { observers[0]?.callback([{ target, isIntersecting: value }]); },
    hidden(value) { document.hidden = value; emit('visibilitychange'); },
    reduce(value) {
      const result = media.get('(prefers-reduced-motion: reduce)');
      result.matches = value; result.callback?.();
    },
    resize(value) {
      for (const [query, result] of media) {
        if (query.includes('reduced')) continue;
        result.matches = value >= (query.includes('1100') ? 1100 : 992);
      }
      for (const [query, result] of media) if (!query.includes('reduced')) result.callback?.();
    },
    scroll(value) { window.scrollY = value; emit('scroll'); },
  };
}

test('content reveals the feature heading word by word, pauses, then reveals the rest', () => {
  const app = setup();
  const content = app.timelines[0];
  const step = target => content.steps.find(item => item.target === target);
  const reveal = content.steps.find(item => item.target?.[0] === app.lower[0]);
  const wordSteps = app.words.map(step);
  assert.equal(step(app.logo).position, 0);
  assert.equal(step(app.wordmark).position, 0.16);
  assert.equal(step(app.subtitle).position, 0.44);
  const buttonsEnd = Math.max(...app.buttons.map(button => step(button).position + step(button).vars.duration));
  assert.ok(Math.abs(wordSteps[0].position - buttonsEnd - 0.35) < 0.0001);
  assert.ok(wordSteps.every((word, index) => index === 0 || word.position > wordSteps[index - 1].position));
  const wordsEnd = Math.max(...wordSteps.map(word => word.position + word.vars.duration));
  assert.ok(Math.abs(reveal.position - wordsEnd - 0.25) < 0.0001);
  assert.equal(reveal.vars.duration, 0.45);
  assert.ok(Math.abs(reveal.position + reveal.vars.duration - 3.21) < 0.0001);
  content.complete();
  assert.equal(app.attrs.has('data-home-intro'), false);
  assert.ok(app.words.every(word => word.cleaned));
  assert.ok(!app.timelines[1].killed, 'content completion does not finish the headphones');
});

test('headphones descend slowly on their own timeline, then open, hold, and reassemble once', () => {
  const app = setup();
  const motion = app.timelines[1];
  const entry = motion.steps.find(step => step.target === app.scenes[0]);
  const rightEntry = motion.steps.find(step => step.target === app.scenes[2]);
  assert.equal(entry.position, 1.7);
  assert.equal(entry.vars.duration, 2);
  assert.equal(entry.from.y, -180);
  assert.equal(rightEntry.position, entry.position);
  assert.equal(rightEntry.vars.duration, entry.vars.duration);
  assert.equal(app.scenes[2].parts.length, 0);
  const parts = app.scenes[0].parts.map(part => motion.steps.filter(step => step.target === part));
  const opening = parts.map(steps => steps[0]);
  const returning = parts.map(steps => steps[1]);
  assert.ok(parts.every(steps => steps.length === 2));
  assert.equal(Math.min(...opening.map(step => step.position)), entry.position + entry.vars.duration);
  const expandedAt = Math.max(...opening.map(step => step.position + step.vars.duration));
  const collapseAt = Math.min(...returning.map(step => step.position));
  assert.ok(Math.abs(collapseAt - expandedAt - 2) < 0.0001);
  opening.forEach(step => assert.equal(step.vars.attr.transform, step.target.dataset.expandedTransform));
  returning.forEach(step => assert.equal(step.vars.attr.transform, 'translate(0 0)'));
  motion.complete();
  assert.ok(app.scenes[0].parts.every(part => part.transform === 'translate(0 0)'));
  assert.ok(!app.timelines[0].killed, 'headphone completion does not change content timing');
  app.timelines[0].complete();
  app.visible(app.scenes[0]);
  app.visible(app.scenes[2]);
  assert.equal(app.timelines.length, 2, 'neither headphone replays on return');
});

test('content timing is identical on desktop and mobile', () => {
  const desktop = setup();
  const mobile = setup({ width: 390 });
  const schedule = app => app.timelines[0].steps.map(step => ({ position: step.position, duration: step.vars.duration }));
  assert.deepEqual(schedule(desktop), schedule(mobile));
  assert.equal(mobile.timelines.length, 1);
  mobile.timelines[0].complete();
  mobile.visible(mobile.canvas);
  assert.equal(mobile.fieldsCreated, 0);
});

test('scrolling and touch gestures leave both sequences running even before the bundle starts', () => {
  const app = setup();
  for (const event of ['wheel', 'touchmove', 'scroll']) app.emit(event);
  app.scroll(700);
  app.visible(app.scenes[0], false);
  assert.equal(app.attrs.get('data-home-intro'), 'pending');
  assert.ok(app.timelines.every(timeline => !timeline.killed && !timeline.paused));
  const early = setup({ bootOnly: true });
  early.scroll(700);
  early.emit('wheel');
  early.start();
  assert.equal(early.timelines.length, 2);
  assert.ok(early.timelines.every(timeline => !timeline.killed));
});

test('keyboard, focus, and activation reveal content without cancelling the headphones', () => {
  for (const event of ['keydown', 'focusin', 'pointerdown']) {
    const app = setup();
    app.emit(event, { preventDefault() { assert.fail('navigation remains native'); } });
    assert.equal(app.attrs.has('data-home-intro'), false);
    assert.equal(app.timelines[0].killed, true);
    assert.ok(!app.timelines[1].killed);
    app.scroll(700);
    assert.ok(!app.timelines[1].killed);
  }
});

test('hidden tabs pause both timelines and resume them without restarting', () => {
  const app = setup();
  app.hidden(true);
  assert.ok(app.timelines.every(timeline => timeline.paused));
  app.hidden(false);
  assert.ok(app.timelines.every(timeline => !timeline.paused));
  assert.equal(app.timelines.length, 2);
});

test('lower decorations wait for content, then retain offscreen and hidden-tab handling', () => {
  const app = setup();
  app.visible(app.canvas);
  app.visible(app.scenes[1]);
  assert.equal(app.fieldsCreated, 0);
  app.timelines[0].complete();
  assert.equal(app.fieldsCreated, 1);
  assert.equal(app.field.timeline.paused, false);
  assert.ok(!app.timelines[1].killed);
  const earbud = app.timelines[2];
  app.visible(app.scenes[1], false);
  assert.equal(earbud.paused, true);
  app.visible(app.scenes[1]);
  app.hidden(true);
  assert.equal(earbud.paused, true);
  assert.equal(app.field.timeline.paused, true);
  app.hidden(false);
  assert.equal(earbud.paused, false);
  assert.equal(app.field.timeline.paused, false);
  app.visible(app.canvas, false);
  assert.equal(app.field.timeline.paused, true);
  earbud.complete();
  app.visible(app.scenes[1]);
  assert.equal(app.timelines.length, 4);
});

test('reduced motion bypasses or settles both sequences and keeps the waveform static', () => {
  for (const initial of [true, false]) {
    const app = setup({ reduced: initial });
    if (!initial) {
      app.scenes[0].parts.forEach(part => { part.transform = part.dataset.expandedTransform; });
      app.reduce(true);
      assert.ok(app.timelines.every(timeline => timeline.killed));
    }
    assert.equal(app.attrs.has('data-home-intro'), false);
    assert.ok(app.scenes.every(scene => scene.parts.every(part => part.transform === 'translate(0 0)')));
    app.visible(app.canvas);
    assert.equal(app.field.timeline.paused, true);
    app.reduce(false);
    assert.equal(app.field.timeline.paused, false);
  }
});

test('resizing hides and settles only the headphones without advancing the content', () => {
  const app = setup();
  app.timelines[0].time(0.7);
  app.timelines[1].time(4.5);
  app.resize(800);
  assert.equal(app.timelines[1].killed, true);
  assert.equal(app.timelines[0].time(), 0.7);
  assert.ok(!app.timelines[0].killed);
  app.resize(1440);
  assert.equal(app.timelines.length, 2);
});

test('direct anchors, restored positions, and unsupported observation bypass the introduction', () => {
  for (const options of [{ hash: '#features' }, { scrollY: 300 },
    { navigation: 'back_forward' }, { supported: false }]) {
    const app = setup(options);
    assert.equal(app.timelines.length, 0);
    assert.equal(app.attrs.has('data-home-intro'), false);
  }
  for (const event of ['pageshow', 'pagehide']) {
    const app = setup();
    app.emit(event, { persisted: true });
    assert.ok(app.timelines.every(timeline => timeline.killed));
    assert.equal(app.attrs.has('data-home-intro'), false);
  }
});

test('failed or late initialization releases the page without replaying it later', () => {
  for (const cancel of [app => app.expireBoot(), app => app.emit('pagehide')]) {
    const app = setup({ bootOnly: true });
    assert.equal(app.attrs.get('data-home-intro'), 'pending');
    cancel(app);
    assert.equal(app.attrs.has('data-home-intro'), false);
    app.start();
    assert.equal(app.timelines.length, 0);
  }
  const failed = setup({ failedTimeline: true });
  assert.equal(failed.attrs.has('data-home-intro'), false);
  assert.ok(failed.logo.cleaned);
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
