// Arm before first paint. Content stays visible when this enhancement is unavailable.
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const restored = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
  if (reduced.matches || !window.IntersectionObserver || location.hash || window.scrollY > 8 || restored) return;

  const timer = setTimeout(() => {
    root.removeAttribute('data-changelog-motion');
    delete window.LazuliteChangelog;
  }, 1500);
  window.LazuliteChangelog = {
    claim() {
      const pending = root.hasAttribute('data-changelog-motion');
      clearTimeout(timer);
      delete window.LazuliteChangelog;
      return pending;
    },
  };
  root.setAttribute('data-changelog-motion', '');
})();
