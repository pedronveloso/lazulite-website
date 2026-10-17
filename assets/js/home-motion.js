import { gsap } from 'gsap';
import { createSignalField } from './signal-field.js';

// One authored introduction; lower-page devices retain their visibility lifecycle.
(() => {
  const root = document.documentElement;
  const claimed = window.LazuliteIntro?.claim() || false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 992px)');
  const wide = window.matchMedia('(min-width: 1100px)');
  const hero = document.querySelector('.homepage .hero-section');
  const scenes = [...document.querySelectorAll('[data-audio-scene]')];
  const headphone = scenes.find(scene => scene.dataset.audioScene === 'headphone');
  const canvas = document.querySelector('[data-signal-field]');
  const visible = new Set();
  const started = new Set();
  const active = new Map();
  const lower = [...document.querySelectorAll('.homepage > .section, .footer')];
  const logo = hero?.querySelector('.hero-logo');
  const wordmark = hero?.querySelector('.hero-title .accent-text');
  const subtitle = hero?.querySelector('.hero-subtitle');
  const buttons = [...(hero?.querySelectorAll('.cta-buttons .btn') || [])];
  const introTargets = [logo, wordmark, subtitle, ...buttons, headphone, ...lower].filter(Boolean);
  const hasHeadphoneStage = wide.matches && !!headphone;
  const headphoneEnd = 4.88;
  const lowerAt = hasHeadphoneStage ? 2.45 : 1.35;
  const inputEvents = ['wheel', 'touchmove', 'pointerdown', 'keydown', 'focusin', 'pagehide'];
  let intro;
  let introducing = false;
  let unlocked = !claimed;
  let field;

  const settle = scene => {
    if (!scene) return;
    started.add(scene);
    gsap.set([...scene.querySelectorAll('[data-assembly-part]')], {
      attr: { transform: 'translate(0 0)' },
    });
  };
  const finishIntro = () => {
    introducing = false;
    unlocked = true;
    intro?.kill();
    root.removeAttribute('data-home-intro');
    gsap.set(introTargets, { clearProps: 'opacity,visibility,transform' });
    settle(headphone);
    inputEvents.forEach(name => window.removeEventListener(name, finishIntro, true));
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pageshow', onPageShow);
    update();
  };
  const onScroll = () => { if (window.scrollY > 8) finishIntro(); };
  const onPageShow = event => { if (event.persisted || window.scrollY > 8) finishIntro(); };
  const sceneEnabled = scene => desktop.matches && scene !== headphone;
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
    if (introducing) {
      if (reduced.matches) finishIntro();
      else {
        if (hasHeadphoneStage && !wide.matches && intro.time() >= 1.35 && intro.time() < headphoneEnd) {
          settle(headphone);
          intro.time(headphoneEnd, false);
        }
        if (document.hidden) intro.pause();
        else intro.play();
      }
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
    // Hidden or unrevealed sections never allocate or animate a canvas.
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
      scenes.filter(scene => scene !== headphone).forEach(scene => observer.observe(scene));
      if (canvas) observer.observe(canvas);
    }

    if (claimed && hero && logo && wordmark && subtitle && !reduced.matches &&
        !location.hash && window.scrollY <= 8) {
      introducing = true;
      intro = gsap.timeline({ paused: true, onComplete: finishIntro });
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
      if (hasHeadphoneStage) {
        intro.fromTo(headphone, { y: -180, autoAlpha: 0 }, {
          y: 0, autoAlpha: 0.62, duration: 1, ease: 'power3.out',
        }, 1.45);
        [...headphone.querySelectorAll('[data-assembly-part]')].forEach((part, index) => {
          intro.to(part, {
            attr: { transform: 'translate(0 0)' }, duration: 1.8, ease: 'power3.out',
          }, 2.8 + index * 0.14);
        });
        // A breakpoint change during the hero still omits the headphone wait.
        intro.call(() => { if (!wide.matches) update(); }, [], 1.35);
      }
      intro.fromTo(lower, { opacity: 0 }, {
        opacity: 1, duration: 0.45, ease: 'power3.out',
        onComplete: () => {
          unlocked = true;
          update();
        },
      }, lowerAt);
      inputEvents.forEach(name => window.addEventListener(name, finishIntro, { capture: true, passive: true }));
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('pageshow', onPageShow);
    } else finishIntro();

    reduced.addEventListener('change', update);
    desktop.addEventListener('change', update);
    wide.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    update();
  } catch (error) {
    finishIntro();
    // Preserve readable content even if a decorative enhancement cannot initialize.
    console.warn('Homepage motion unavailable', error);
  }
})();
