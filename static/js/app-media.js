// Follow the site's resolved appearance; load only the visible recording.
(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pictures = [...document.querySelectorAll('[data-app-picture]')];
  const videos = [...document.querySelectorAll('[data-app-video]')];
  const visible = new Set();
  const byContainer = new Map(videos.map(video => [video.parentElement, video]));
  let theme;

  const posterFor = video => video.parentElement.querySelector('[data-app-video-poster]');
  const unload = video => {
    video.pause();
    video.hidden = true;
    posterFor(video).hidden = false;
    if (video.getAttribute('src')) {
      video.removeAttribute('src');
      video.load();
    }
  };
  const update = video => {
    if (reducedMotion.matches) {
      unload(video);
      return;
    }
    if (!visible.has(video)) {
      video.pause();
      return;
    }
    video.hidden = false;
    posterFor(video).hidden = true;
    if (!video.getAttribute('src')) video.src = JSON.parse(video.dataset[theme]).src;
    video.muted = true;
    video.play().catch(() => { /* Browser policy may require the play control. */ });
  };
  const applyTheme = () => {
    const resolved = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    if (resolved === theme) return;
    theme = resolved;
    pictures.forEach(picture => {
      const sources = [...picture.querySelectorAll('source')];
      sources.forEach(source => { source.media = source.dataset.theme === theme ? 'all' : 'not all'; });
      const selected = sources.find(source => source.dataset.theme === theme);
      const image = picture.querySelector('img');
      image.width = Number(selected.getAttribute('width'));
      image.height = Number(selected.getAttribute('height'));
    });
    videos.forEach(video => {
      unload(video);
      const media = JSON.parse(video.dataset[theme]);
      video.poster = media.poster;
      video.width = media.width;
      video.height = media.height;
      update(video);
    });
  };
  applyTheme();
  new MutationObserver(applyTheme).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

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
