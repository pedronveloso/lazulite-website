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
  const scenes = ['headphone', 'earbud'].map(kind => {
    const parts = Array.from({ length: 3 }, (_, i) => ({ transform: `translate(${-55 - i * 47} 0)` }));
    return { dataset: { audioScene: kind }, parts, querySelectorAll: () => parts };
  });
  const canvas = {};
  const logo = {}, wordmark = {}, subtitle = {}, buttons = [{}, {}], lower = [{}, {}];
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
    querySelectorAll: selector => selector === '[data-audio-scene]' ? scenes : lower,
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
    scenes, canvas, timelines, logo, wordmark, subtitle, buttons, lower, attrs, emit, start,
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

test('the lower page reveals after headphone descent while assembly continues', () => {
  const app = setup();
  const intro = app.timelines[0];
  const find = target => intro.steps.find(step => step.target === target ||
    (target === app.lower && step.target?.[0] === app.lower[0]));
  assert.equal(intro.paused, false);
  assert.equal(find(app.logo).from.scale, 0.94);
  assert.equal(find(app.logo).position, 0);
  assert.equal(find(app.wordmark).from.yPercent, 110);
  assert.equal(find(app.wordmark).position, 0.16);
  assert.equal(find(app.subtitle).position, 0.44);
  assert.equal(find(app.buttons[0]).position, 0.82);
  assert.ok(Math.abs(find(app.buttons[1]).position - 0.9) < 0.0001);
  const entry = find(app.scenes[0]);
  assert.equal(entry.position, 1.45);
  assert.equal(entry.from.y, -180);
  assert.equal(entry.vars.ease, 'power3.out');
  const assembly = find(app.scenes[0].parts[0]);
  assert.ok(assembly.position - entry.position - entry.vars.duration >= 0.34);
  const lastPart = find(app.scenes[0].parts[2]);
  assert.equal(lastPart.position + lastPart.vars.duration, 4.88);
  assert.equal(find(app.lower).position, entry.position + entry.vars.duration);
  assert.ok(find(app.lower).position < assembly.position);
  assert.equal(find(app.lower).vars.duration, 0.45);
  intro.complete();
  assert.equal(app.attrs.has('data-home-intro'), false);
  assert.ok(app.scenes[0].parts.every(part => part.transform === 'translate(0 0)'));
  assert.ok(app.buttons.every(button => button.cleaned));
  app.visible(app.scenes[0]);
  assert.equal(app.timelines.length, 1, 'headphone never independently starts or replays');
});

test('lower decoration starts when the page reveal finishes, before headphone assembly completes', () => {
  const app = setup();
  app.visible(app.canvas);
  app.visible(app.scenes[1]);
  assert.equal(app.fieldsCreated, 0);
  assert.equal(app.timelines.length, 1);
  const intro = app.timelines[0];
  const reveal = intro.steps.find(step => step.target?.[0] === app.lower[0]);
  intro.time(reveal.position + reveal.vars.duration);
  reveal.vars.onComplete();
  assert.ok(intro.time() < 4.88);
  assert.ok(!intro.killed, 'the headphone assembly is still active');
  assert.equal(app.attrs.has('data-home-intro'), true);
  assert.equal(app.fieldsCreated, 1);
  assert.equal(app.field.timeline.paused, false);
  app.visible(app.canvas, false);
  assert.equal(app.field.timeline.paused, true);
  app.visible(app.canvas);
  app.hidden(true);
  assert.equal(app.field.timeline.paused, true);
  app.hidden(false);
  assert.equal(app.field.timeline.paused, false);
});

test('scroll intent, keyboard, focus, and activation skip immediately without consuming the action', () => {
  for (const event of ['wheel', 'touchmove', 'keydown', 'focusin', 'pointerdown', 'pagehide']) {
    const app = setup();
    app.emit(event, { preventDefault() { assert.fail('navigation must remain native'); } });
    assert.equal(app.attrs.has('data-home-intro'), false, event);
    assert.equal(app.timelines[0].killed, true);
    assert.ok(app.scenes[0].parts.every(part => part.transform === 'translate(0 0)'));
  }
  const app = setup();
  app.scroll(100);
  assert.equal(app.attrs.has('data-home-intro'), false);
});

test('the intro pauses in a hidden tab and resumes without creating another sequence', () => {
  const app = setup();
  app.hidden(true);
  assert.equal(app.timelines[0].paused, true);
  app.hidden(false);
  assert.equal(app.timelines[0].paused, false);
  assert.equal(app.timelines.length, 1);
});

test('earbud assembly pauses offscreen and in hidden tabs after the introduction', () => {
  const app = setup();
  app.timelines[0].complete();
  app.visible(app.scenes[1]);
  const earbud = app.timelines[1];
  app.visible(app.scenes[1], false);
  assert.equal(earbud.paused, true);
  app.visible(app.scenes[1]);
  assert.equal(earbud.paused, false);
  app.hidden(true);
  assert.equal(earbud.paused, true);
  app.hidden(false);
  earbud.complete();
  app.visible(app.scenes[1], false);
  app.visible(app.scenes[1]);
  assert.equal(app.timelines.length, 2);
});

test('reduced motion bypasses or settles the intro and keeps the waveform static', () => {
  for (const initial of [true, false]) {
    const app = setup({ reduced: initial });
    if (!initial) app.reduce(true);
    assert.equal(app.attrs.has('data-home-intro'), false);
    assert.ok(app.scenes.every(scene => scene.parts.every(part => part.transform === 'translate(0 0)')));
    app.visible(app.canvas);
    assert.equal(app.field.timeline.paused, true);
    app.reduce(false);
    assert.equal(app.field.timeline.paused, false);
  }
});

test('narrow layouts omit the headphone stage and mobile never creates the waveform', () => {
  for (const width of [390, 1050]) {
    const app = setup({ width });
    const intro = app.timelines[0];
    assert.equal(intro.steps.find(step => step.target?.[0] === app.lower[0]).position, 1.35);
    assert.equal(intro.steps.some(step => step.target === app.scenes[0]), false);
    intro.complete();
    app.visible(app.canvas);
    assert.equal(app.fieldsCreated, width === 390 ? 0 : 1);
  }
});

test('resizing during or before the headphone stage skips its remaining wait', () => {
  for (const time of [0.7, 2.5, 3.5]) {
    const app = setup();
    const intro = app.timelines[0];
    intro.time(time);
    app.resize(800);
    if (time < 1.35) {
      intro.time(1.35);
      intro.steps.find(step => step.callback).callback();
    }
    assert.equal(intro.time(), 4.88);
    assert.ok(app.scenes[0].parts.every(part => part.transform === 'translate(0 0)'));
  }
});

test('direct anchors, history restoration, and missing observation bypass startup hiding', () => {
  for (const options of [{ hash: '#features' }, { scrollY: 300 },
    { navigation: 'back_forward' }, { supported: false }]) {
    const app = setup(options);
    assert.equal(app.timelines.length, 0);
    assert.equal(app.attrs.has('data-home-intro'), false);
  }
  const app = setup();
  app.emit('pageshow', { persisted: true });
  assert.equal(app.attrs.has('data-home-intro'), false);
});

test('failed or late initialization reveals content and cannot restart the intro', () => {
  for (const cancel of [app => app.expireBoot(), app => app.emit('keydown')]) {
    const app = setup({ bootOnly: true });
    assert.equal(app.attrs.get('data-home-intro'), 'pending');
    cancel(app);
    assert.equal(app.attrs.has('data-home-intro'), false);
    app.start();
    assert.equal(app.timelines.length, 0);
  }
  const app = setup({ failedTimeline: true });
  assert.equal(app.attrs.has('data-home-intro'), false);
  assert.ok(app.logo.cleaned);
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
