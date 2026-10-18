// An illustrative playback waveform, drawn only when its GSAP state changes.
// The synthetic samples never represent live playback or diagnostic measurements.
export function createSignalField(canvas, gsap) {
  const context = canvas.getContext('2d');
  if (!context) return null;
  const heights = [
    4, 7, 5, 12, 9, 18, 14, 26, 20, 34, 28, 43, 36, 56,
    45, 61, 51, 40, 57, 48, 60, 53, 43, 58, 47, 35, 50, 38,
    29, 40, 30, 22, 32, 24, 17, 22, 15, 11, 8, 6, 4,
  ];
  const bars = heights.map(height => ({ height }));
  let width = 0;
  let height = 0;
  let palette;

  const readPalette = () => {
    const style = getComputedStyle(canvas);
    palette = {
      line: style.getPropertyValue('--text-muted').trim(),
      accent: style.getPropertyValue('--accent').trim(),
    };
  };
  const draw = () => {
    if (!width || !height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);
    context.scale(width / 360, height / 120);
    context.lineWidth = 1.5;
    context.lineCap = 'round';

    bars.forEach(({ height }, index) => {
      const x = -120 + index * 6;
      const accent = index >= 18 && index <= 22;
      context.strokeStyle = accent ? palette.accent : palette.line;
      context.globalAlpha = accent ? 0.52 : 0.58;
      context.beginPath();
      context.moveTo(x, -height / 2);
      context.lineTo(x, height / 2);
      context.stroke();
    });
    context.restore();
  };
  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    width = bounds.width;
    height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    draw();
  };
  readPalette();
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);
  new MutationObserver(() => { readPalette(); draw(); }).observe(document.documentElement, {
    attributes: true, attributeFilter: ['data-theme'],
  });

  const random = (min, max) => min + Math.random() * (max - min);
  // Generate coherent waveform envelopes, rather than making every bar jump
  // independently. GSAP interpolates each frame from the actual current shape.
  const nextHeights = () => {
    const center = random(0.2, 0.8);
    const secondCenter = random(0.15, 0.85);
    const spread = random(0.16, 0.34);
    const phase = random(0, Math.PI * 2);
    const energy = random(0.7, 1);
    return bars.map((_, index) => {
      const t = index / (bars.length - 1);
      const taper = Math.pow(Math.sin(t * Math.PI), 0.9);
      const envelope = 14 + 36 * Math.exp(-Math.pow((t - center) / spread, 2)) +
        23 * Math.exp(-Math.pow((t - secondCenter) / 0.25, 2));
      const detail = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(index * 1.8 + phase));
      return Math.min(72, 4 + taper * envelope * detail * energy);
    });
  };
  const buildSequence = () => {
    timeline.clear();
    const frames = Math.floor(random(12, 19));
    for (let frame = 0; frame < frames; frame++) {
      const targets = nextHeights();
      timeline.to(bars, {
        height: index => targets[index],
        duration: random(0.55, 0.85),
        ease: 'sine.inOut',
        onUpdate: draw,
      });
    }
    // A short, variable rest holds the last waveform without rendering frames.
    timeline.to({}, { duration: random(1.4, 3.2) });
  };
  const timeline = gsap.timeline({ paused: true, onComplete: () => {
    buildSequence();
    timeline.restart();
  } });
  buildSequence();
  return { timeline, draw };
}
