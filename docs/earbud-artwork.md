# Static earbud artwork

The Smart Suggestions illustration uses the user-approved rounded-stem concept A.
It is decorative and independent of authentic app screenshots. The approved raster stays intact; only its display rotation follows scrolling.

- Asset: `../static/images/audio-art/earbud-stemmed.cc163f26e7a8.png` (396 × 396 RGBA PNG, exactly 2× the 198px display size).
- Tool: built-in image generation, editing the approved concept with transparency enabled.
- Source concept: `exec-10da55ee-d70e-4bc6-bf46-6ce4a215e413.png`, approved in this design conversation.
- Generated extraction: `exec-3560c078-c15f-4127-b468-a106d6d407e5.png`.
- SHA-256: `cc163f26e7a8248d341a88da204407c75ca3ee450ad3a586dbc202fac3f55172`.
- The original 1254 × 1254 generated extraction is retained in the generation output;
  its SHA-256 is `2107c44275834f2f44291bd94d34eaef16d3be80844335d57a6cedf111d04050`.
- The website asset is resized directly from that original with Pillow Lanczos resampling
  and saved as an optimized RGBA PNG (40,376 bytes). No artwork was regenerated.
- Alpha inspection: 92.0% fully transparent pixels; the housing interior is transparent.
- The raster alpha mask renders in the runtime secondary-text ink role, so automatic and manual
  theme changes preserve the exact silhouette while adapting its line color.
- Both standard and WebKit mask declarations are included. Browsers without mask
  support omit the decoration; content stays readable.
- Display at 198 × 198px in the original 220px grid column, offset 70px left.
- GSAP ScrollTrigger rotates only the inner mask from −40° to 0° after the whole wrapper enters view;
  reduced motion shows the upright baseline and mobile hides the decoration.
- Keep the PNG as raster artwork. Do not trace it into SVG or restore assembly groups.
- A replacement asset must use a new content-hashed filename and update the CSS URL.

## Exact extraction prompt

Edit the provided approved stemmed earphone concept into a production transparent LINE-ART raster asset. Preserve precisely the same earphone design, silhouette, orientation, framing, domed mushroom silicone tip, narrow nozzle, rounded housing, long rounded stem, and elegant industrial contour lines. Do not redesign or rotate anything. The only change is extraction of the fine contour strokes: REMOVE THE PALE BACKGROUND AND ALL LIGHT SURFACE FILLS AND SHADING, INCLUDING INSIDE THE EARPHONE. Every empty area BETWEEN THE LINES must be genuinely alpha-transparent, including the interior of the silicone cap, housing, stem, and outside the product. Retain only clean antialiased ink strokes and the tiny microphone detail. No opaque white or gray silhouette, no filled body, no shadow, no checkerboard pattern baked into pixels. Fine dark blue-gray contour strokes on actual transparency; line edges may have fractional alpha. This artwork will be used as a CSS alpha mask so the silhouette interiors MUST be empty alpha, not opaque light pixels. Keep the delicate premium wireframe look with clear continuous curves. Match the approved image closely, with generous transparent margins and all parts fully inside the canvas. No labels, no text, no additional elements.
