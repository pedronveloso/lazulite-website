import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// What's New: each heading and list item rises into place as it enters the viewport.
(() => {
  const root = document.documentElement;
  const claimed = window.LazuliteChangelog?.claim() || false;
  const targets = [...document.querySelectorAll(
    '.postWrapper > h1, .postWrapper > div > :is(h2, h3, p), .postWrapper > div li',
  )];
  const release = () => root.removeAttribute('data-changelog-motion');
  if (!claimed || !targets.length) return release();

  try {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Inline state replaces the pre-paint CSS guard in the same frame.
      gsap.set(targets, { autoAlpha: 0, y: 12 });
      release();
      const reveal = batch => gsap.to(batch, {
        autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: { amount: Math.min(0.6, batch.length * 0.06) }, overwrite: true,
        clearProps: 'opacity,visibility,transform',
      });
      ScrollTrigger.batch(targets, {
        start: 'top 92%', once: true, interval: 0.1,
        onEnter: reveal, onLeave: reveal,
      });
    });
    release(); // Idempotent: covers a reduced-motion preference that arrived after arming.
  } catch (error) {
    gsap.set(targets, { clearProps: 'opacity,visibility,transform' });
    release();
    console.warn('Changelog motion unavailable', error);
  }
})();
