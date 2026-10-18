import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../assets/js/earbud-scroll.js', import.meta.url), 'utf8')
  .replace('export function', 'function');
const { createEarbudScroll } = runInNewContext(`${source}\n({ createEarbudScroll });`);

test('earbud rotation follows scroll progress without translating the layout wrapper', () => {
  const image = {};
  const art = { querySelector: () => image };
  const plugin = {};
  let mediaQuery, tween;
  const media = {
    add(query, callback) { mediaQuery = query; callback(); },
  };
  const gsap = {
    registerPlugin(value) { assert.equal(value, plugin); },
    matchMedia: () => media,
    fromTo(target, from, to) { tween = { target, from, to }; },
  };
  assert.equal(createEarbudScroll(art, gsap, plugin), media);
  assert.equal(mediaQuery, '(min-width: 992px) and (prefers-reduced-motion: no-preference)');
  assert.equal(tween.target, image, 'rotate only the raster, preserving the wrapper offset');
  assert.equal(tween.from.rotation, -40);
  assert.equal(tween.to.rotation, 0);
  assert.equal(tween.to.ease, 'none');
  assert.equal(tween.to.scrollTrigger.trigger, art);
  assert.equal(tween.to.scrollTrigger.start, 'bottom bottom', 'wait until the whole earbud is visible');
  assert.equal(tween.to.scrollTrigger.end, 'center 45%');
  assert.equal(tween.to.scrollTrigger.scrub, true, 'stopping scrolling stops the rotation');
});

test('pages without the decorative earbud do not register scroll animation', () => {
  assert.equal(createEarbudScroll(null), undefined);
  assert.equal(createEarbudScroll({ querySelector: () => null }), undefined);
});
