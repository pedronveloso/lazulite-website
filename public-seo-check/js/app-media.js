// Load the recording only when visible. Reduced motion keeps its still poster.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const videos = [...document.querySelectorAll('[data-app-video]')];
  const visible = new Set();
  const byContainer = new Map(videos.map(video => [video.parentElement, video]));
  const update = video => {
    const poster = video.parentElement.querySelector('[data-app-video-poster]');
    if (reducedMotion.matches || !visible.has(video)) {
      video.pause();
      if (reducedMotion.matches) {
        video.hidden = true;
        poster.hidden = false;
        video.removeAttribute('src');
        video.load();
      }
      return;
    }
    video.hidden = false;
    poster.hidden = true;
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    video.muted = true;
    video.play().catch(() => { /* Browser policy may require the play control. */ });
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = byContainer.get(entry.target);
      if (entry.isIntersecting) visible.add(video);
      else visible.delete(video);
      update(video);
    });
  });
  videos.forEach(video => observer.observe(video.parentElement));
  reducedMotion.addEventListener('change', () => videos.forEach(update));
})();
