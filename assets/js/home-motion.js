import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createEarbudScroll } from './earbud-scroll.js';
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
  const lower = [...document.querySelectorAll('.homepage > .section:not(#features), #features > :not(.feature-intro-title), .footer')];
  const words = [...document.querySelectorAll('#features [data-intro-word]')];
  const logo = hero?.querySelector('.hero-logo');
  const wordmark = hero?.querySelector('.hero-title .accent-text');
  const brandFills = [...(hero?.querySelectorAll('[data-brand-fill]') || [])];
  const brandWires = [...(hero?.querySelectorAll('[data-brand-wire]') || [])];
  const brandContours = [...(hero?.querySelectorAll('[data-brand-contour]') || [])];
  const wordmarkWire = hero?.querySelector('.hero-wordmark__wire');
  const subtitle = hero?.querySelector('.hero-subtitle');
  const buttons = [...(hero?.querySelectorAll('.cta-buttons .btn') || [])];
  const contentTargets = [logo, wordmark, subtitle, ...buttons, ...words, ...lower].filter(Boolean);
  const featureAt = 1.7; // Supporting content keeps its original entrance schedule.
  const wordGap = words.length > 1 ? 0.36 / (words.length - 1) : 0;
  const restAt = featureAt + (words.length ? 0.45 + wordGap * (words.length - 1) + 0.25 : 0);
  const headphoneParts = [...(headphone?.querySelectorAll('[data-assembly-part]') || [])];
  const headphoneLayers = headphone?.querySelector('[data-headphone-layers]');
  const headphoneAssembled = headphone?.querySelector('[data-headphone-assembled]');
  const replay = document.querySelector('[data-headphone-replay]');
  const lastPart = Math.max(0, headphoneParts.length - 1);
  const descentDuration = 2;
  const openAt = featureAt + descentDuration;
  const brandRevealAt = wide.matches && headphone ? openAt : 0.72;
  const expandedAt = openAt + 1.3 + lastPart * 0.12;
  const collapseAt = expandedAt + 1.4;
  const cushionAt = collapseAt + lastPart * 0.14;
  const magneticAt = cushionAt + 1.6 + 0.1;
  const seatedAt = magneticAt + 0.14;
  const handoffAt = seatedAt + 0.08;
  const assembledAt = handoffAt + 0.12;
  const inputEvents = ['pointerdown', 'keydown', 'focusin'];
  let intro;
  let headphoneMotion;
  let introducing = false;
  let movingHeadphones = false;
  let motionReady = false;
  let departing = false;
  let unlocked = !claimed;
  let field;

  const settle = scene => {
    if (!scene) return;
    const parts = [...scene.querySelectorAll('[data-assembly-part]')];
    if (parts.length) gsap.set(parts, { clearProps: '--headphone-open,--headphone-seat,opacity,visibility' });
    const layers = scene.querySelector('[data-headphone-layers]');
    const assembled = scene.querySelector('[data-headphone-assembled]');
    if (layers) gsap.set(layers, { clearProps: 'opacity,visibility,--headphone-splay' });
    if (assembled) gsap.set(assembled, { clearProps: 'opacity,visibility' });
  };
  const updateReplay = () => {
    if (!replay) return;
    replay.hidden = !motionReady || !wide.matches || reduced.matches || departing;
    replay.setAttribute('aria-disabled', String(movingHeadphones || document.hidden));
  };
  const settleHeadphones = () => {
    movingHeadphones = false;
    headphoneMotion?.pause();
    if (headphones.length) gsap.set(headphones, { clearProps: 'opacity,visibility,transform' });
    headphones.forEach(settle);
    updateReplay();
  };
  const finishHeadphones = () => {
    headphoneMotion?.kill();
    headphoneMotion = undefined;
    settleHeadphones();
  };
  const finishContent = () => {
    introducing = false;
    unlocked = true;
    intro?.kill();
    root.removeAttribute('data-home-intro');
    gsap.set([...brandFills, ...brandWires, ...brandContours], {
      clearProps: 'opacity,visibility,clipPath,strokeDasharray,strokeDashoffset',
    });
    gsap.set(contentTargets, { clearProps: 'opacity,visibility,transform' });
    inputEvents.forEach(name => window.removeEventListener(name, finishContent, true));
    update();
  };
  const finishAll = () => {
    finishHeadphones();
    finishContent();
  };
  const onPageHide = () => { departing = true; finishAll(); };
  const onPageShow = event => {
    if (event.persisted) { departing = false; finishAll(); }
  };
  const canRunField = () => unlocked && !reduced.matches && !document.hidden &&
    visible.has(canvas) && desktop.matches;

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
    if (unlocked && canvas && desktop.matches && visible.has(canvas) && !field) {
      field = createSignalField(canvas, gsap);
    }
    if (field) {
      if (canRunField()) field.timeline.play();
      else field.timeline.pause();
    }
    updateReplay();
  }

  function createHeadphoneMotion(withEntrance = false) {
    const motion = gsap.timeline({ paused: true, onComplete: settleHeadphones });
    if (withEntrance) headphones.forEach(scene => {
      motion.fromTo(scene, { y: -180, autoAlpha: 0 }, {
        y: 0, autoAlpha: 0.62, duration: descentDuration, ease: 'power3.out',
      }, featureAt);
    });
    // Real raster silhouettes occlude the components behind them. A small outward
    // shift gives the inward-facing layers room without entering the centered copy.
    motion.to(headphoneAssembled, { autoAlpha: 0, duration: 0.18 }, openAt);
    motion.fromTo(headphoneLayers, { autoAlpha: 0 }, {
      autoAlpha: 1, duration: 0.18,
    }, openAt);
    motion.fromTo(headphoneLayers, { '--headphone-splay': 0 }, {
      '--headphone-splay': 1, duration: 1.3, ease: 'power2.inOut',
    }, openAt);
    motion.to(headphoneLayers, {
      '--headphone-splay': 0, duration: 1.8, ease: 'power3.out',
    }, collapseAt);
    headphoneParts.forEach((part, index) => {
      motion.to(part, {
        '--headphone-open': 1, duration: 1.3, ease: 'power2.inOut',
      }, openAt + (lastPart - index) * 0.12);
      if (part.dataset.headphonePart === 'cushion') {
        motion.to(part, {
          '--headphone-open': 0, '--headphone-seat': 1, duration: 1.6, ease: 'power3.out',
        }, cushionAt);
        motion.to(part, {
          '--headphone-seat': 0, duration: 0.14, ease: 'power2.in',
        }, magneticAt);
      } else {
        const returnAt = collapseAt + index * 0.14;
        motion.to(part, {
          '--headphone-open': 0, duration: 1.8, ease: 'power3.out',
        }, returnAt);
        // Once recessed behind the pad, internal detail no longer reads through
        // the ear opening in the closed illustration.
        motion.to(part, { autoAlpha: 0, duration: 0.16 }, returnAt + 1.64);
      }
    });
    motion.to(headphoneAssembled, { autoAlpha: 1, duration: assembledAt - handoffAt }, handoffAt);
    motion.to(headphoneLayers, { autoAlpha: 0, duration: assembledAt - handoffAt }, handoffAt);
    return motion;
  }

  const replayHeadphone = () => {
    if (!motionReady || movingHeadphones || reduced.matches || !wide.matches ||
      document.hidden || departing || !headphone) return;
    // Reuse the settled timeline, seeking past the entrance on every manual replay.
    headphoneMotion ||= createHeadphoneMotion();
    movingHeadphones = true;
    updateReplay();
    headphoneMotion.play(openAt);
  };

  try {
    if (window.IntersectionObserver) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        update();
      }, { threshold: 0.25 });
      if (canvas) observer.observe(canvas);
    }

    if (claimed && hero && logo && wordmark && subtitle && !reduced.matches && !location.hash) {
      introducing = true;
      intro = gsap.timeline({ paused: true, onComplete: finishContent });
      // Hold the blueprint until visible headphones land; smaller layouts fill sooner.
      // Live Sora text gives the blueprint exactly the resolved wordmark's metrics.
      gsap.set([logo, wordmark], { opacity: 1 });
      gsap.set(brandFills, { clipPath: 'inset(0 100% 0 0)' });
      intro.fromTo(brandContours, { strokeDasharray: 1, strokeDashoffset: 1 }, {
        strokeDashoffset: 0, duration: 0.6, stagger: 0.08, ease: 'power2.inOut',
      }, 0);
      if (wordmarkWire) intro.fromTo(wordmarkWire, { clipPath: 'inset(0 100% 0 0)' }, {
        clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power2.inOut',
      }, 0.12);
      brandFills.forEach((fill, index) => {
        intro.to(fill, {
          clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'power2.inOut',
        }, brandRevealAt + index * 0.08);
      });
      intro.to(brandWires, { opacity: 0, duration: 0.25, ease: 'power2.out' }, brandRevealAt + 0.38);
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
        headphoneMotion = createHeadphoneMotion(true);
      } else finishHeadphones();
      inputEvents.forEach(name => window.addEventListener(name, finishContent, { capture: true, passive: true }));
    } else finishAll();

    reduced.addEventListener('change', update);
    desktop.addEventListener('change', update);
    wide.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('pageshow', onPageShow);
    update();
    createEarbudScroll(document.querySelector('.audio-art--earbud'), gsap, ScrollTrigger);
    replay?.addEventListener('click', replayHeadphone);
    motionReady = true;
    updateReplay();
  } catch (error) {
    finishAll();
    console.warn('Homepage motion unavailable', error);
  }
})();
