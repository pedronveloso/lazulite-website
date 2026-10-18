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
  const scenes = ['headphone', 'headphone-right'].map(kind => {
    const parts = Array.from({ length: kind === 'headphone-right' ? 0 : 3 }, (_, i) => ({
      '--headphone-open': 0, '--headphone-seat': 0,
      dataset: { headphonePart: ['driver', 'baffle', 'cushion'][i] },
    }));
    const assembled = { defaultAlpha: 1 };
    const layers = kind === 'headphone' ? { defaultAlpha: 0, '--headphone-splay': 0 } : null;
    return { dataset: { audioScene: kind }, parts, assembled, layers,
      querySelectorAll: () => parts,
      querySelector: selector => selector === '[data-headphone-layers]' ? layers : assembled,
    };
  });
  const canvas = {};
  const replayListeners = new Map();
  const replay = {
    hidden: true, attributes: new Map(),
    setAttribute(name, value) { this.attributes.set(name, value); },
    addEventListener(name, callback) { replayListeners.set(name, callback); },
  };
  const logo = {}, wordmark = {}, subtitle = {}, buttons = [{}, {}], lower = [{}, {}];
  const brandFills = [{}, {}], brandWires = [{}, {}], brandContours = [{}, {}];
  const words = Array.from({ length: 4 }, () => ({}));
  const hero = {
    querySelector: selector => ({ '.hero-logo': logo, '.hero-title .accent-text': wordmark,
      '.hero-subtitle': subtitle, '.hero-wordmark__wire': brandWires[1] })[selector],
    querySelectorAll: selector => ({ '[data-brand-fill]': brandFills,
      '[data-brand-wire]': brandWires, '[data-brand-contour]': brandContours,
      '.cta-buttons .btn': buttons })[selector] || [],
  };
  const set = (targets, vars) => {
    for (const target of Array.isArray(targets) ? targets : [targets]) {
      for (const key of ['--headphone-open', '--headphone-seat', '--headphone-splay']) {
        if (vars[key] !== undefined) target[key] = vars[key];
        if (vars.clearProps?.includes(key)) target[key] = 0;
      }
      if (vars.autoAlpha !== undefined) target.autoAlpha = vars.autoAlpha;
      if (vars.clearProps) {
        target.cleaned = true;
        if (vars.clearProps.includes('transform')) target.xPercent = 0;
        if (vars.clearProps.includes('opacity')) target.autoAlpha = target.defaultAlpha ?? 1;
      }
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
        play(position) {
          this.paused = false;
          if (position !== undefined) { this.clock = position; this.replays = (this.replays || 0) + 1; }
          return this;
        },
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
    querySelector: selector => selector === '[data-signal-field]' ? canvas :
      selector === '[data-headphone-replay]' ? replay : hero,
    addEventListener: window.addEventListener,
  };
  class Observer {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
  }
  let timer, fieldsCreated = 0, field;
  const scope = {
    gsap, window, document, location: { hash },
    ScrollTrigger: {}, createEarbudScroll() {},
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
    scenes, canvas, timelines, logo, wordmark, subtitle, buttons, lower, words, attrs, emit, start, replay,
    brandFills, brandWires, brandContours,
    activateHeadphone() { replayListeners.get('click')?.(); },
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
  const rightEntry = motion.steps.find(step => step.target === app.scenes[1]);
  assert.equal(entry.position, 1.7);
  assert.equal(entry.vars.duration, 2);
  assert.equal(entry.from.y, -180);
  assert.equal(rightEntry.position, entry.position);
  assert.equal(rightEntry.vars.duration, entry.vars.duration);
  assert.equal(app.scenes[1].parts.length, 0);
  const parts = app.scenes[0].parts.map(part => motion.steps.filter(step => step.target === part && '--headphone-open' in step.vars));
  const opening = parts.map(steps => steps[0]);
  const returning = parts.map(steps => steps[1]);
  assert.ok(parts.every(steps => steps.length === 2));
  assert.equal(Math.min(...opening.map(step => step.position)), entry.position + entry.vars.duration);
  const expandedAt = Math.max(...opening.map(step => step.position + step.vars.duration));
  const collapseAt = Math.min(...returning.map(step => step.position));
  assert.ok(Math.abs(collapseAt - expandedAt - 1.4) < 0.0001);
  opening.forEach(step => {
    assert.equal(step.vars['--headphone-open'], 1);
    assert.equal(step.vars.ease, 'power2.inOut');
    assert.equal(step.vars.duration, 1.3);
  });
  returning.forEach(step => assert.equal(step.vars['--headphone-open'], 0));
  motion.complete();
  assert.ok(app.scenes[0].parts.every(part => part['--headphone-open'] === 0 && part['--headphone-seat'] === 0));
  assert.equal(app.scenes[0].layers.autoAlpha, 0);
  assert.equal(app.scenes[0].assembled.autoAlpha, 1);
  assert.ok(!app.timelines[0].killed, 'headphone completion does not change content timing');
  app.timelines[0].complete();
  app.visible(app.scenes[0]);
  app.visible(app.scenes[1]);
  assert.equal(app.timelines.length, 2, 'neither headphone replays on return');
});

test('raster internals appear only for disassembly and settle to the clean assembled plate', () => {
  const app = setup();
  const left = app.scenes[0];
  const motion = app.timelines[1];
  const plateSteps = motion.steps.filter(step => step.target === left.assembled);
  const layerSteps = motion.steps.filter(step => step.target === left.layers);
  const openingAt = 3.7;
  assert.equal(plateSteps[0].position, openingAt);
  assert.equal(plateSteps[0].vars.autoAlpha, 0);
  assert.equal(layerSteps[0].position, openingAt);
  assert.equal(layerSteps[0].from.autoAlpha, 0);
  assert.equal(layerSteps[0].vars.autoAlpha, 1);
  assert.equal(layerSteps[0].vars.duration, plateSteps[0].vars.duration,
    'the component stack appears with the plate crossfade, independently of the slower movement');
  const splay = layerSteps.find(step => step.vars['--headphone-splay'] === 1);
  assert.equal(splay.position, openingAt);
  assert.equal(splay.vars.ease, 'power2.inOut');
  assert.equal(splay.vars.duration, 1.3);
  const end = plateSteps[1].position + plateSteps[1].vars.duration;
  assert.ok(Math.abs(end - 8.96) < 0.0001);
  assert.equal(plateSteps[1].vars.autoAlpha, 1);
  assert.equal(layerSteps.at(-1).vars.autoAlpha, 0);
  assert.ok(!motion.steps.some(step => step.target === app.scenes[1].assembled),
    'the right earcup remains a single assembled image');
  app.emit('pagehide');
  assert.equal(left.layers.autoAlpha, 0);
  assert.equal(left.layers['--headphone-splay'], 0);
  assert.equal(left.assembled.autoAlpha, 1);
});

test('cushion slows to a gap, pauses, pulls into contact, then holds before the plate handoff', () => {
  const app = setup();
  const left = app.scenes[0];
  const motion = app.timelines[1];
  const cushion = left.parts[2];
  const steps = motion.steps.filter(step => step.target === cushion);
  const approach = steps.find(step => step.vars['--headphone-seat'] === 1);
  const pull = steps.find(step => step.vars['--headphone-seat'] === 0);
  const handoff = motion.steps.find(step => step.target === left.assembled && step.vars.autoAlpha === 1);
  assert.equal(approach.vars['--headphone-open'], 0);
  assert.equal(approach.vars.duration, 1.6);
  assert.equal(approach.vars.ease, 'power3.out');
  assert.ok(Math.abs(pull.position - approach.position - approach.vars.duration - 0.1) < 0.0001);
  assert.equal(pull.vars.duration, 0.14);
  assert.equal(pull.vars.ease, 'power2.in');
  assert.ok(Math.abs(handoff.position - pull.position - pull.vars.duration - 0.08) < 0.0001);
  assert.ok(Math.abs(handoff.vars.duration - 0.12) < 0.0001);
  for (const part of left.parts.slice(0, 2)) {
    const closing = motion.steps.find(step => step.target === part && step.vars['--headphone-open'] === 0);
    assert.equal(closing.vars.duration, 1.8);
    assert.ok(closing.position + closing.vars.duration <= pull.position);
  }
  const housing = motion.steps.find(step => step.target === left.layers && step.vars['--headphone-splay'] === 0);
  assert.ok(housing.position + housing.vars.duration <= pull.position);
  cushion['--headphone-open'] = 0.3;
  cushion['--headphone-seat'] = 1;
  app.reduce(true);
  assert.equal(cushion['--headphone-open'], 0);
  assert.equal(cushion['--headphone-seat'], 0);
  assert.equal(left.layers.autoAlpha, 0);
});

test('supporting content timing is identical on desktop and mobile', () => {
  const desktop = setup();
  const mobile = setup({ width: 390 });
  const schedule = app => {
    const targets = [...app.buttons, ...app.words, app.subtitle];
    return app.timelines[0].steps
      .filter(step => targets.includes(step.target) || step.target?.[0] === app.lower[0])
      .map(step => ({ position: step.position, duration: step.vars.duration }));
  };
  assert.deepEqual(schedule(desktop), schedule(mobile));
  assert.equal(mobile.timelines.length, 1);
  mobile.timelines[0].complete();
  mobile.visible(mobile.canvas);
  assert.equal(mobile.fieldsCreated, 0);
});

test('manual replay reuses only the assembly sequence and ignores activation while moving', () => {
  const app = setup();
  const motion = app.timelines[1];
  assert.equal(app.replay.attributes.get('aria-disabled'), 'true');
  app.activateHeadphone();
  assert.equal(motion.replays, undefined, 'the initial descent cannot be interrupted');
  app.timelines[0].complete();
  motion.complete();
  assert.equal(app.replay.hidden, false);
  assert.equal(app.replay.attributes.get('aria-disabled'), 'false');
  for (let count = 1; count <= 3; count++) {
    app.activateHeadphone();
    assert.equal(motion.time(), 3.7, 'seek past the descent directly to disassembly');
    assert.equal(motion.replays, count);
    assert.equal(app.timelines.length, 2, 'reuse the timeline instead of allocating more tweens');
    assert.equal(app.replay.attributes.get('aria-disabled'), 'true');
    motion.time(5.5);
    app.activateHeadphone();
    assert.equal(motion.time(), 5.5, 'an expanded headphone cannot restart or queue a replay');
    assert.equal(motion.replays, count);
    motion.complete();
    assert.equal(app.replay.attributes.get('aria-disabled'), 'false');
    assert.equal(app.scenes[0].assembled.autoAlpha, 1);
  }
});

test('static assembled visits can replay without introducing the content or either headphone', () => {
  for (const options of [{ hash: '#features' }, { scrollY: 300 }, { navigation: 'back_forward' }]) {
    const app = setup(options);
    assert.equal(app.timelines.length, 0);
    app.activateHeadphone();
    const motion = app.timelines[0];
    assert.equal(motion.time(), 3.7);
    assert.ok(!motion.steps.some(step => app.scenes.includes(step.target)), 'neither earcup descends');
    assert.equal(app.attrs.has('data-home-intro'), false);
    motion.complete();
    app.activateHeadphone();
    assert.equal(app.timelines.length, 1);
  }
});

test('replay respects reduced motion, breakpoints, hidden tabs, and page departure', () => {
  for (const options of [{ reduced: true }, { width: 390 }, { failedTimeline: true }]) {
    const app = setup(options);
    const count = app.timelines.length;
    app.activateHeadphone();
    assert.equal(app.timelines.length, count);
    assert.equal(app.replay.hidden, true);
  }
  const app = setup();
  app.timelines.forEach(motion => motion.complete());
  app.hidden(true);
  app.activateHeadphone();
  assert.equal(app.timelines[1].replays, undefined);
  app.hidden(false);
  app.activateHeadphone();
  const replay = app.timelines[1];
  app.scroll(700);
  assert.equal(replay.paused, false);
  app.hidden(true);
  assert.equal(replay.paused, true);
  app.hidden(false);
  assert.equal(replay.paused, false);
  app.reduce(true);
  assert.equal(replay.killed, true);
  assert.equal(app.replay.hidden, true);
  app.reduce(false);
  app.activateHeadphone();
  const resized = app.timelines.at(-1);
  app.resize(800);
  assert.equal(resized.killed, true);
  assert.equal(app.replay.hidden, true);
  app.resize(1440);
  app.activateHeadphone();
  app.emit('pagehide');
  assert.equal(app.timelines.at(-1).killed, true);
  assert.equal(app.replay.hidden, true);
  const count = app.timelines.length;
  app.activateHeadphone();
  assert.equal(app.timelines.length, count);
  app.emit('pageshow', { persisted: true });
  assert.equal(app.replay.hidden, false);
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

test('the waveform waits for content, then pauses offscreen and in hidden tabs', () => {
  const app = setup();
  app.visible(app.canvas);
  assert.equal(app.fieldsCreated, 0);
  app.timelines[0].complete();
  assert.equal(app.fieldsCreated, 1);
  assert.equal(app.field.timeline.paused, false);
  assert.ok(!app.timelines[1].killed);
  app.hidden(true);
  assert.equal(app.field.timeline.paused, true);
  app.hidden(false);
  assert.equal(app.field.timeline.paused, false);
  app.visible(app.canvas, false);
  assert.equal(app.field.timeline.paused, true);
  assert.equal(app.timelines.length, 3, 'only content, headphones, and waveform have timelines');
});

test('reduced motion bypasses or settles both sequences and keeps the waveform static', () => {
  for (const initial of [true, false]) {
    const app = setup({ reduced: initial });
    if (!initial) {
      app.scenes[0].parts.forEach(part => { part['--headphone-open'] = 1; });
      app.reduce(true);
      assert.ok(app.timelines.every(timeline => timeline.killed));
    }
    assert.equal(app.attrs.has('data-home-intro'), false);
    assert.ok(app.scenes.every(scene => scene.parts.every(part => part['--headphone-open'] === 0 && part['--headphone-seat'] === 0)));
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


test('blueprint contours finish before the registered logo and live wordmark fill', () => {
  const app = setup();
  const content = app.timelines[0];
  const draw = content.steps.find(step => step.target?.[0] === app.brandContours[0]);
  const letters = content.steps.find(step => step.target === app.brandWires[1]);
  const fills = app.brandFills.map(fill => content.steps.find(step => step.target === fill));
  const fade = content.steps.find(step => step.target?.[0] === app.brandWires[0]);
  assert.equal(draw.from.strokeDashoffset, 1);
  assert.equal(draw.vars.strokeDashoffset, 0);
  assert.ok(draw.position + draw.vars.duration + draw.vars.stagger < fills[0].position);
  assert.equal(letters.from.clipPath, 'inset(0 100% 0 0)');
  assert.ok(letters.position + letters.vars.duration < fills[1].position);
  assert.ok(fills.every(step => step.vars.clipPath === 'inset(0 0% 0 0)'));
  assert.ok(fade.position > fills[1].position);
  assert.equal(fade.vars.opacity, 0);
  assert.ok(Math.abs(fade.position + fade.vars.duration - 4.33) < 0.0001);
});

test('blueprint overlays and clipped surfaces are cleaned on every content exit', () => {
  for (const exit of [app => app.timelines[0].complete(), app => app.emit('pointerdown'),
    app => app.reduce(true), app => app.emit('pagehide'),
    app => app.emit('pageshow', { persisted: true })]) {
    const app = setup();
    exit(app);
    assert.equal(app.attrs.has('data-home-intro'), false);
    assert.ok([...app.brandFills, ...app.brandWires, ...app.brandContours].every(target => target.cleaned));
  }
  for (const options of [{ reduced: true }, { failedTimeline: true }, { hash: '#features' }]) {
    const app = setup(options);
    assert.ok(app.brandFills.every(target => target.cleaned));
    assert.equal(app.attrs.has('data-home-intro'), false);
  }
});


test('brand color waits for the headphone descent only where headphones are displayed', () => {
  for (const width of [390, 1099, 1100, 1440]) {
    const app = setup({ width });
    const content = app.timelines[0];
    const fills = app.brandFills.map(fill => content.steps.find(step => step.target === fill));
    if (width >= 1100) {
      const descent = app.timelines[1].steps.find(step => step.target === app.scenes[0]);
      const landedAt = descent.position + descent.vars.duration;
      assert.equal(fills[0].position, landedAt);
      assert.ok(fills.every(fill => fill.position >= landedAt));
    } else {
      assert.equal(fills[0].position, 0.72);
      assert.ok(Math.abs(fills[1].position + fills[1].vars.duration - 1.35) < 0.0001);
    }
    const fade = content.steps.find(step => step.target?.[0] === app.brandWires[0]);
    const fillEnd = Math.max(...fills.map(fill => fill.position + fill.vars.duration));
    assert.ok(Math.abs(fade.position + fade.vars.duration - fillEnd) < 0.0001,
      'outlines remain until the surfaces finish revealing');
  }
});
