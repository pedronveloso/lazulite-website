import { gsap } from 'gsap';
import { createSignalField } from './signal-field.js';

// Content and headphones have independent timelines; scrolling never cancels motion.
(() => {
  const root = document.documentElement;
  const claimed = window.LazuliteIntro?.claim() || false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 992px)');
  const wide = window.matchMedia('(min-width: 1100px)');
  const hero = document.querySelector('.homepage .hero-section');
  const scenes = [...document.querySelectorAll('[data-audio-scene]')];
  const headphones = scenes.filter(scene => scene.dataset.audioScene.startsWith('headphone'));
  const headphone = scenes.find(scene => scene.dataset.audioScene === 'headphone');
  const canvas = document.querySelector('[data-signal-field]');
  const visible = new Set();
  const started = new Set();
  const active = new Map();
  const lower = [...document.querySelectorAll('.homepage > .section:not(#features), #features > :not(.feature-intro-title), .footer')];
  const words = [...document.querySelectorAll('#features [data-intro-word]')];
  const logo = hero?.querySelector('.hero-logo');
  const wordmark = hero?.querySelector('.hero-title .accent-text');
  const subtitle = hero?.querySelector('.hero-subtitle');
  const buttons = [...(hero?.querySelectorAll('.cta-buttons .btn') || [])];
  const contentTargets = [logo, wordmark, subtitle, ...buttons, ...words, ...lower].filter(Boolean);
  const featureAt = 1.7; // The 1.35s hero entrance, followed by a 350ms breath.
  const wordGap = words.length > 1 ? 0.36 / (words.length - 1) : 0;
  const restAt = featureAt + (words.length ? 0.45 + wordGap * (words.length - 1) + 0.25 : 0);
  const headphoneParts = [...(headphone?.querySelectorAll('[data-assembly-part]') || [])];
  const lastPart = Math.max(0, headphoneParts.length - 1);
  const descentDuration = 2;
  const openAt = featureAt + descentDuration;
  const expandedAt = openAt + 0.9 + lastPart * 0.12;
  const collapseAt = expandedAt + 2;
  const inputEvents = ['pointerdown', 'keydown', 'focusin'];
  let intro;
  let headphoneMotion;
  let introducing = false;
  let movingHeadphones = false;
  let unlocked = !claimed;
  let field;

  const settle = scene => {
    if (!scene) return;
    started.add(scene);
    const parts = [...scene.querySelectorAll('[data-assembly-part]')];
    if (parts.length) gsap.set(parts, { attr: { transform: 'translate(0 0)' } });
  };
  const finishHeadphones = () => {
    movingHeadphones = false;
    headphoneMotion?.kill();
    if (headphones.length) gsap.set(headphones, { clearProps: 'opacity,visibility,transform' });
    headphones.forEach(settle);
  };
  const finishContent = () => {
    introducing = false;
    unlocked = true;
    intro?.kill();
    root.removeAttribute('data-home-intro');
    gsap.set(contentTargets, { clearProps: 'opacity,visibility,transform' });
    inputEvents.forEach(name => window.removeEventListener(name, finishContent, true));
    update();
  };
  const finishAll = () => {
    finishHeadphones();
    finishContent();
  };
  const onPageShow = event => { if (event.persisted) finishAll(); };
  const sceneEnabled = scene => desktop.matches && !headphones.includes(scene);
  const canRun = target => unlocked && !reduced.matches && !document.hidden &&
    visible.has(target) && (target === canvas ? desktop.matches : sceneEnabled(target));

  const assemble = scene => {
    started.add(scene);
    const timeline = gsap.timeline({ paused: true, onComplete: () => active.delete(scene) });
    [...scene.querySelectorAll('[data-assembly-part]')].forEach((part, index) => {
      timeline.to(part, {
        attr: { transform: 'translate(0 0)' }, duration: 1.8, ease: 'power3.out',
      }, 0.85 + index * 0.14);
    });
    active.set(scene, timeline);
  };
  function update() {
    if (reduced.matches && (introducing || movingHeadphones)) finishAll();
    if (introducing) {
      if (document.hidden) intro.pause();
      else intro.play();
    }
    if (movingHeadphones) {
      if (!wide.matches) finishHeadphones();
      else if (document.hidden) headphoneMotion.pause();
      else headphoneMotion.play();
    }
    scenes.forEach(scene => {
      if (reduced.matches) {
        active.get(scene)?.kill();
        active.delete(scene);
        settle(scene);
      } else if (canRun(scene) && !started.has(scene)) assemble(scene);
      const timeline = active.get(scene);
      if (timeline) {
        if (canRun(scene)) timeline.play();
        else timeline.pause();
      }
    });
    if (unlocked && canvas && desktop.matches && visible.has(canvas) && !field) {
      field = createSignalField(canvas, gsap);
    }
    if (field) {
      if (canRun(canvas)) field.timeline.play();
      else field.timeline.pause();
    }
  }

  try {
    if (window.IntersectionObserver) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        update();
      }, { threshold: 0.25 });
      scenes.filter(scene => !headphones.includes(scene)).forEach(scene => observer.observe(scene));
      if (canvas) observer.observe(canvas);
    }

    if (claimed && hero && logo && wordmark && subtitle && !reduced.matches && !location.hash) {
      introducing = true;
      intro = gsap.timeline({ paused: true, onComplete: finishContent });
      intro.fromTo(logo, { scale: 0.94, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.55, ease: 'power3.out',
      }, 0);
      intro.fromTo(wordmark, { yPercent: 110, opacity: 1 }, {
        yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
      }, 0.16);
      intro.fromTo(subtitle, { y: 10, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
      }, 0.44);
      buttons.forEach((button, index) => {
        intro.fromTo(button, { y: 6, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.45, ease: 'power3.out',
        }, 0.82 + index * 0.08);
      });
      words.forEach((word, index) => {
        intro.fromTo(word, { y: 8, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.45, ease: 'power3.out',
        }, featureAt + index * wordGap);
      });
      intro.fromTo(lower, { opacity: 0 }, {
        opacity: 1, duration: 0.45, ease: 'power3.out',
      }, restAt);

      if (wide.matches && headphone) {
        movingHeadphones = true;
        headphoneMotion = gsap.timeline({ paused: true, onComplete: finishHeadphones });
        headphones.forEach(scene => {
          headphoneMotion.fromTo(scene, { y: -180, autoAlpha: 0 }, {
            y: 0, autoAlpha: 0.62, duration: descentDuration, ease: 'power3.out',
          }, featureAt);
        });
        headphoneParts.forEach((part, index) => {
          headphoneMotion.to(part, {
            attr: { transform: part.dataset.expandedTransform }, duration: 0.9, ease: 'power3.out',
          }, openAt + (lastPart - index) * 0.12);
          headphoneMotion.to(part, {
            attr: { transform: 'translate(0 0)' }, duration: 1.8, ease: 'power3.out',
          }, collapseAt + index * 0.14);
        });
      } else finishHeadphones();
      inputEvents.forEach(name => window.addEventListener(name, finishContent, { capture: true, passive: true }));
    } else finishAll();

    reduced.addEventListener('change', update);
    desktop.addEventListener('change', update);
    wide.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    window.addEventListener('pagehide', finishAll);
    window.addEventListener('pageshow', onPageShow);
    update();
  } catch (error) {
    finishAll();
    console.warn('Homepage motion unavailable', error);
  }
})();
