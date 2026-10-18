import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const read = name => readFileSync(new URL(`../assets/js/${name}`, import.meta.url), 'utf8');
const bootSource = read('changelog-boot.js');
const motionSource = read('changelog-motion.js').replace(/^import .*\n/gm, '');

function setup({ reduced = false, hash = '', scrollY = 0, navigation = 'navigate',
  supported = true, targets = 3, failBatch = false } = {}) {
  const attrs = new Set();
  const calls = { set: [], to: [], batch: [], registered: 0 };
  const timers = [];
  const root = {
    setAttribute: name => attrs.add(name),
    removeAttribute: name => attrs.delete(name),
    hasAttribute: name => attrs.has(name),
  };
  const nodes = Array.from({ length: targets }, (_, i) => ({ id: i }));
  let matchHandler;
  const gsap = {
    registerPlugin: () => { calls.registered += 1; },
    set: (...args) => calls.set.push(args),
    to: (...args) => calls.to.push(args),
    matchMedia: () => ({
      add: (query, handler) => { matchHandler = handler; if (!reduced) handler(); },
    }),
  };
  const ScrollTrigger = {
    batch: (...args) => {
      if (failBatch) throw new Error('batch failed');
      calls.batch.push(args);
    },
  };
  const context = {
    window: {
      matchMedia: () => ({ matches: reduced }),
      IntersectionObserver: supported ? class {} : undefined,
      scrollY,
    },
    document: { documentElement: root, querySelectorAll: () => nodes },
    performance: { getEntriesByType: () => [{ type: navigation }] },
    location: { hash },
    setTimeout: callback => timers.push(callback) && timers.length,
    clearTimeout: () => {},
    console: { warn: () => {} },
    gsap,
    ScrollTrigger,
  };
  context.window.window = context.window;
  return { context, attrs, calls, timers, matchHandler: () => matchHandler };
}

const run = (source, context) => runInNewContext(source, context);

test('boot arms for a fresh visit with motion allowed', () => {
  const env = setup();
  run(bootSource, env.context);
  assert.ok(env.attrs.has('data-changelog-motion'));
  assert.equal(typeof env.context.window.LazuliteChangelog.claim, 'function');
});

for (const [name, options] of Object.entries({
  'reduced motion': { reduced: true },
  'a direct anchor': { hash: '#2026-08' },
  'a restored scroll position': { scrollY: 400 },
  'back/forward restoration': { navigation: 'back_forward' },
  'missing IntersectionObserver': { supported: false },
})) {
  test(`boot stays unarmed for ${name}`, () => {
    const env = setup(options);
    run(bootSource, env.context);
    assert.equal(env.attrs.has('data-changelog-motion'), false);
    assert.equal(env.context.window.LazuliteChangelog, undefined);
  });
}

test('boot timeout releases the guard when the bundle never arrives', () => {
  const env = setup();
  run(bootSource, env.context);
  env.timers[0]();
  assert.equal(env.attrs.has('data-changelog-motion'), false);
});

test('motion hides targets, releases the guard, and batches a transform/opacity reveal', () => {
  const env = setup();
  run(bootSource, env.context);
  env.context.window.gsap = env.context.gsap;
  run(motionSource, env.context);
  assert.equal(env.attrs.has('data-changelog-motion'), false);
  assert.deepEqual({ ...env.calls.set[0][1] }, { autoAlpha: 0, y: 12 });
  assert.equal(env.calls.batch.length, 1);
  const options = env.calls.batch[0][1];
  assert.equal(options.once, true);
  options.onEnter(['a']);
  const vars = env.calls.to[0][1];
  assert.deepEqual([vars.autoAlpha, vars.y], [1, 0]);
  assert.equal(vars.clearProps, 'opacity,visibility,transform');
  assert.ok(vars.stagger.amount > 0);
});

test('motion does nothing when the boot never armed', () => {
  const env = setup({ reduced: true });
  run(bootSource, env.context);
  run(motionSource, env.context);
  assert.equal(env.calls.set.length, 0);
  assert.equal(env.calls.batch.length, 0);
});

test('motion failure restores plain content', () => {
  const env = setup({ failBatch: true });
  run(bootSource, env.context);
  run(motionSource, env.context);
  assert.equal(env.attrs.has('data-changelog-motion'), false);
  assert.deepEqual({ ...env.calls.set.at(-1)[1] }, { clearProps: 'opacity,visibility,transform' });
});
