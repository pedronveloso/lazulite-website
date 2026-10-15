import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../static/js/app-media.js', import.meta.url), 'utf8');
function setup({ reduced = false, theme = 'dark' } = {}) {
  let notifyVisibility;
  let notifyMotion;
  let notifyTheme;
  const motion = {
    matches: reduced,
    addEventListener: (_, callback) => { notifyMotion = callback; },
  };
  const image = {};
  const sources = ['light', 'dark'].map(appearance => ({
    dataset: { theme: appearance },
    getAttribute: name => name === 'width' ? '720' : appearance === 'light' ? '1500' : '1516',
  }));
  const poster = {
    hidden: false,
    querySelectorAll: () => sources,
    querySelector: () => image,
  };
  const container = { querySelector: () => poster };
  const variants = Object.fromEntries(['light', 'dark'].map(appearance => [appearance, {
    src: `/videos/app/en/${appearance}/home.mp4?v=example`,
    poster: `/images/app/en/${appearance}/poster.webp?v=example`,
    width: 634, height: 1334,
  }]));
  const video = {
    hidden: true,
    parentElement: container,
    dataset: Object.fromEntries(Object.entries(variants).map(([key, value]) => [key, JSON.stringify(value)])),
    plays: 0, pauses: 0, loads: 0, muted: false, currentTime: 0,
    play() { this.plays++; return Promise.resolve(); },
    pause() { this.pauses++; },
    load() { this.loads++; this.currentTime = 0; },
    getAttribute(name) { return this[name]; },
    removeAttribute(name) { delete this[name]; },
  };
  const root = { getAttribute: () => theme };
  runInNewContext(source, {
    window: { matchMedia: () => motion },
    document: {
      documentElement: root,
      querySelectorAll: selector => selector === '[data-app-video]' ? [video] : [poster],
    },
    MutationObserver: class {
      constructor(callback) { notifyTheme = callback; }
      observe(target, options) {
        assert.equal(target, root);
        assert.deepEqual([...options.attributeFilter], ['data-theme']);
      }
    },
    IntersectionObserver: class {
      constructor(callback) { notifyVisibility = callback; }
      observe() {}
    },
  });
  return {
    video, poster, sources, image, variants,
    visible(value) { notifyVisibility([{ target: container, isIntersecting: value }]); },
    motion(value) { motion.matches = value; notifyMotion(); },
    theme(value) { theme = value; notifyTheme(); },
  };
}

test('initial resolved theme selects images, dimensions and poster before loading video', () => {
  for (const theme of ['dark', 'light']) {
    const app = setup({ theme });
    assert.equal(app.video.src, undefined);
    assert.equal(app.video.poster, app.variants[theme].poster);
    assert.equal(app.sources.find(source => source.dataset.theme === theme).media, 'all');
    assert.equal(app.sources.find(source => source.dataset.theme !== theme).media, 'not all');
    assert.equal(app.image.height, theme === 'light' ? 1500 : 1516);
  }
});

test('visible video loads and plays muted; leaving the viewport pauses it', () => {
  const app = setup();
  app.visible(true);
  assert.equal(app.video.src, app.variants.dark.src);
  assert.equal(app.video.plays, 1);
  assert.equal(app.video.muted, true);
  assert.equal(app.video.hidden, false);
  assert.equal(app.poster.hidden, true);
  const pauses = app.video.pauses;
  app.visible(false);
  assert.equal(app.video.pauses, pauses + 1);
});

test('theme switches unload old video and restart the matching visible recording', () => {
  const app = setup();
  app.visible(true);
  app.video.currentTime = 12;
  app.theme('light');
  assert.equal(app.video.loads, 1);
  assert.equal(app.video.currentTime, 0);
  assert.equal(app.video.src, app.variants.light.src);
  assert.equal(app.video.poster, app.variants.light.poster);
  assert.equal(app.video.plays, 2);
  app.theme('light');
  assert.equal(app.video.loads, 1, 'unchanged resolved theme does not restart playback');
  app.theme('dark');
  assert.equal(app.video.src, app.variants.dark.src);
  assert.equal(app.image.height, 1516);
});

test('offscreen theme switches update the poster without requesting the other video', () => {
  const app = setup();
  app.visible(true);
  app.visible(false);
  app.theme('light');
  assert.equal(app.video.src, undefined);
  assert.equal(app.video.plays, 1);
  assert.equal(app.video.hidden, true);
  assert.equal(app.poster.hidden, false);
  app.visible(true);
  assert.equal(app.video.src, app.variants.light.src);
});

test('reduced motion keeps the matching poster without loading or playing video', () => {
  const app = setup({ reduced: true });
  app.visible(true);
  app.theme('light');
  assert.equal(app.video.src, undefined);
  assert.equal(app.video.plays, 0);
  assert.equal(app.video.hidden, true);
  assert.equal(app.poster.hidden, false);
  assert.equal(app.video.poster, app.variants.light.poster);
  app.motion(false);
  assert.equal(app.video.src, app.variants.light.src);
  assert.equal(app.video.plays, 1);
  app.motion(true);
  assert.equal(app.video.src, undefined);
  assert.equal(app.video.loads, 1);
  assert.equal(app.video.hidden, true);
});

test('motion preference changes do not play an offscreen video', () => {
  const app = setup({ reduced: true });
  app.visible(false);
  app.motion(false);
  assert.equal(app.video.plays, 0);
  assert.equal(app.video.src, undefined);
});
