// Rotate the raster inside its positioned wrapper so scrolling cannot move the card.
export function createEarbudScroll(art, gsap, ScrollTrigger) {
  const image = art?.querySelector('.audio-art__earbud-image');
  if (!image) return;

  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(min-width: 992px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(image, { rotation: -40 }, {
      rotation: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: art,
        start: 'bottom bottom',
        end: 'center 45%',
        scrub: true,
      },
    });
  });
  // GSAP reverts the transform and destroys the trigger when the query stops matching.
  return media;
}
