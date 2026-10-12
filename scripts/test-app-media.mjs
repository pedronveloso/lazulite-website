import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../static/js/app-media.js', import.meta.url), 'utf8');
function setup(reduced = false) {
  let notifyVisibility;
  let notifyMotion;
  const motion = {
    matches: reduced,
    addEventListener: (_, callback) => { notifyMotion = callback; },
  };
  const poster = { hidden: false };
  const container = { querySelector: () => poster };
  const video = {
    hidden: true,
    parentElement: container,
    dataset: { src: '/videos/app/en/home.mp4?v=example' },
    plays: 0,
    pauses: 0,
    loads: 0,
    muted: false,
    play() { this.plays++; return Promise.resolve(); },
    pause() { this.pauses++; },
    load() { this.loads++; },
    getAttribute(name) { return this[name]; },
    removeAttribute(name) { delete this[name]; },
  };
  runInNewContext(source, {
    window: { matchMedia: () => motion },
    document: { querySelectorAll: () => [video] },
    IntersectionObserver: class {
      constructor(callback) { notifyVisibility = callback; }
      observe() {}
    },
  });
  return {
    video,
    poster,
    visible(value) { notifyVisibility([{ target: container, isIntersecting: value }]); },
    motion(value) { motion.matches = value; notifyMotion(); },
  };
}

test('visible video loads and plays muted; leaving the viewport pauses it', () => {
  const app = setup();
  assert.equal(app.video.src, undefined);
  app.visible(true);
  assert.equal(app.video.src, app.video.dataset.src);
  assert.equal(app.video.plays, 1);
  assert.equal(app.video.muted, true);
  assert.equal(app.video.hidden, false);
  assert.equal(app.poster.hidden, true);
  app.visible(false);
  assert.equal(app.video.pauses, 1);
});

test('reduced motion keeps the poster without loading or playing video', () => {
  const app = setup(true);
  app.visible(true);
  assert.equal(app.video.src, undefined);
  assert.equal(app.video.plays, 0);
  assert.equal(app.video.hidden, true);
  assert.equal(app.poster.hidden, false);
  app.motion(false);
  assert.equal(app.video.plays, 1);
  app.motion(true);
  assert.equal(app.video.src, undefined);
  assert.equal(app.video.loads, 2);
  assert.equal(app.video.hidden, true);
  assert.equal(app.poster.hidden, false);
});

test('preference changes do not play an offscreen video', () => {
  const app = setup(true);
  app.visible(false);
  app.motion(false);
  assert.equal(app.video.plays, 0);
  assert.equal(app.video.src, undefined);
});
