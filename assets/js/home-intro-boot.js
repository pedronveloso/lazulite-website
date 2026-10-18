// Arm before first paint. Content stays visible when this enhancement is unavailable.
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const restored = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
  if (reduced.matches || !window.IntersectionObserver || location.hash || window.scrollY > 8 || restored) return;

  const events = ['pagehide'];
  const removeListeners = () => events.forEach(name => window.removeEventListener(name, cancel, true));
  const cancel = () => {
    clearTimeout(timer);
    root.removeAttribute('data-home-intro');
    removeListeners();
    delete window.LazuliteIntro;
  };
  const timer = setTimeout(cancel, 1500);
  window.LazuliteIntro = {
    claim() {
      const pending = root.getAttribute('data-home-intro') === 'pending';
      clearTimeout(timer);
      removeListeners();
      delete window.LazuliteIntro;
      return pending;
    },
  };
  events.forEach(name => window.addEventListener(name, cancel, { capture: true, passive: true }));
  root.setAttribute('data-home-intro', 'pending');
})();
