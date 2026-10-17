import { gsap } from 'gsap';
import { createSignalField } from './signal-field.js';

// GSAP owns the assembly choreography, media entrances, and playback waveform.
// Ordinary content is visible before this enhancement loads.
(() => {
  if (!window.IntersectionObserver) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 992px)');
  const wide = window.matchMedia('(min-width: 1100px)');
  const scenes = [...document.querySelectorAll('[data-audio-scene]')];
  const canvas = document.querySelector('[data-signal-field]');
  const visible = new Set();
  const started = new Set();
  const active = new Map();
  const entrances = new Map();
  let field;

  const sceneEnabled = scene => desktop.matches &&
    (scene.dataset.audioScene !== 'headphone' || wide.matches);
  const canRun = target => !reduced.matches && !document.hidden &&
    visible.has(target) && (target === canvas ? desktop.matches : sceneEnabled(target));

  const assemble = scene => {
    started.add(scene);
    const timeline = gsap.timeline({ paused: true, onComplete: () => active.delete(scene) });
    const headphone = scene.dataset.audioScene === 'headphone';
    if (headphone) {
      timeline.fromTo(scene, { y: -180, autoAlpha: 0 }, {
        y: 0, autoAlpha: 0.62, duration: 1, ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
      }, 0);
    }
    [...scene.querySelectorAll('[data-assembly-part]')].forEach((part, index) => {
      timeline.to(part, {
        attr: { transform: 'translate(0 0)' },
        duration: 1.8,
        ease: 'power3.out',
      }, (headphone ? 1.35 : 0.85) + index * 0.14);
    });
    active.set(scene, timeline);
  };
  const update = () => {
    scenes.forEach(scene => {
      if (canRun(scene) && !started.has(scene)) assemble(scene);
      const timeline = active.get(scene);
      if (!timeline) return;
      if (reduced.matches) timeline.progress(1).pause();
      else if (canRun(scene)) timeline.play();
      else timeline.pause();
    });
    // No canvas allocation or rendering work at hidden desktop breakpoints.
    if (canvas && desktop.matches && visible.has(canvas) && !field) {
      field = createSignalField(canvas, gsap);
    }
    if (field) {
      if (canRun(canvas)) field.timeline.play();
      else field.timeline.pause();
    }
    entrances.forEach(tween => {
      if (reduced.matches) tween.progress(1).pause();
      else if (document.hidden) tween.pause();
      else tween.play();
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    update();
  }, { threshold: 0.25 });
  scenes.forEach(scene => observer.observe(scene));
  if (canvas) observer.observe(canvas);

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // A capture already seen with reduced motion should not animate later.
      revealObserver.unobserve(entry.target);
      if (reduced.matches || document.hidden) return;
      const tween = gsap.fromTo(entry.target, { opacity: 0.65, y: 10 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        clearProps: 'opacity,transform',
        onComplete: () => entrances.delete(entry.target),
      });
      entrances.set(entry.target, tween);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.homepage .section [data-app-picture]').forEach(element => {
    revealObserver.observe(element);
  });

  reduced.addEventListener('change', update);
  desktop.addEventListener('change', update);
  wide.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  update();
})();
