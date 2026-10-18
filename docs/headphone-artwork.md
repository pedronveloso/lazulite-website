# Raster headphone artwork

The homepage uses the approved B architectural circular design, revised so the
cushions face the content and the partial arches rise upright before bending
gently higher up. The right earcup mirrors the left assembled plate.

- Approved concept: `exec-13fea4fd-6ce2-4e9f-925f-ea2643a8ad77.png`.
- Production extraction: `exec-e8df2504-6256-4b24-a927-c0246502e9a8.png`,
  generated with the built-in image tool using that concept as the edit target.
- Source: 1774 × 887 RGBA PNG. Object faces are white; background and through-holes
  are transparent. White faces are an intentional mask input, never a displayed
  website color.
- Served asset: `../static/images/audio-art/headphone-circular.f2abeeee6959.webp`,
  1774 × 887, 227,614 bytes; approximately 1.8× the largest rendered sheet
  (984 × 492), with no upscaling or regeneration.
- SHA-256: `f2abeeee6959cc7da87888bb86faeecd9693a25f176c13eb18f1d68844c5e111`.
- Encoding: cwebp quality 90, alpha quality 100, method 6, encoded directly from
  the generated original at its native dimensions. No traced or hand-drawn outlines.

## Rendering and alignment

The crop windows use original source coordinates; they do not modify the raster:
assembled x=0–475, housing 475–890, driver 890–1165, baffle 1165–1404,
cushion 1404–1774. All windows span the full sheet height.
CSS places them in a 420 × 460 logical artwork frame, displayed at
`clamp(343.2px, 31.68vw, 448.8px)`. Outward offsets interpolate from 52px to 92px;
travel is reduced to 60% below 1280px. Outsets account for the viewport scrollbar
so even the transparent canvas stays within the viewport, without clipping the page.

Closed registration: housing left=31.56 logical pixels; cushion left=82.854075,
top=2.273977. The cushion's inner pose uses matrix
`(0.999613, -0.010416, -0.005947, 0.988133, 0, 0)`, fitted to its assembled contours.
The former cushion left=124 was too far outward. Calibration belongs to an inner
pose wrapper; animation changes only outer progress variables, so resets never
remove it. Both ground and ink receive the same registration.

Each crop has a background-colored silhouette and a secondary-text contour layer,
both rendered from the same WebP. SVG filter primitives extract inverse luminance
for the strokes and use SourceAlpha for their real silhouette and through-holes.
The alpha cleanup transfer removes near-white texture before coloring the strokes.
There are no geometric approximations of the silhouettes and no vector artwork.
All filter IDs are declared once per homepage. Theme changes use runtime color roles.

The default HTML shows the single assembled plate. Only the left has an animated
component stack. Opening uses 1.3s power2.inOut with 120ms staggering, then a 1.4s hold (30% shorter).
Interior returns use 1.8s power3.out. The cushion approaches over 1.6s to an 8px gap
at maximum display size, holds 100ms, and seats over 140ms with power2.in. There is
no overshoot. After 80ms fully seated, a 120ms stationary crossfade returns to the
assembled plate. Driver/baffle detail fades only once recessed behind the cushion.
CSS variables express normalized travel, including the proportional seating gap;
the 1100–1279px CSS travel change works even during an active sequence. Completion, reduced motion, page restoration,
and breakpoint cleanup restore that same default and clear temporary transforms.
Picture media sources prevent downloading the sprite below 1100px. A transparent
1px fallback carries no visible content. The artwork is hidden from assistive
technology and only the left headphone’s localized replay control receives pointer or keyboard
activation. That control is hidden without JavaScript, on mobile, and with reduced
motion. It accepts activation only when fully assembled, reusing the same timeline
from the opening rather than repeating the descent or changing page content.
Activations during motion are ignored; completion restores the same calibrated pose.

## Exact production prompt

Use case: precise-object-edit. Edit target: the approved inward-facing circular headphone sheet.
Prepare this exact design as a production RASTER SPRITE SHEET for an animated website. Keep the same design, inward-facing cushion, three-quarter perspective, same scale and camera, upright arch with its gentle late bend. Do not redesign the housing or yoke.
Layout: wide landscape sheet, about 2200 x 1100. FIVE strictly separate raster objects with clear transparent gaps between their silhouettes. At far LEFT: the COMPLETE ASSEMBLED headphone earcup and partial upright arch, closely matching the original left-hand assembled drawing. To its RIGHT: the FOUR separate components that form its exploded view, ordered left to right: (1) rear housing plus connected yoke and upright partial arch, (2) circular driver cassette, (3) thin perforated acoustic baffle, (4) soft ear cushion with visible oval opening pointing RIGHT toward the listener. Keep housing component with arch fully separate from driver. At least 50 transparent pixels of empty horizontal space between EVERY adjacent component, including all of their upper arch strokes. The complete assembled object and rear-housing object are taller because of the arch; all earcup centers are on precisely the same horizontal line. All cup components have identical perspective, tilt, matching ellipses, and appropriate matching diameters so they physically stack into the complete drawing. No component overlaps another in this sheet. No loose screws, extra floating parts or labels.
CRITICAL PAINT FOR TECHNICAL MASKING: render as crisp fine dark grayscale / charcoal linework on PURE SOLID WHITE object faces. White faces are REQUIRED, including the shell, driver diaphragm, baffle material, cushion material and headband material. Every solid physical surface must be flat pure WHITE (RGB 255 255 255), with no shading, gray wash, hatch marks, texture or semitransparent surface fills. The contour strokes can be antialiased gray but must remain confident and legible. All background OUTSIDE the object silhouettes is truly alpha transparent. Actual through-holes, the inner ear opening and spaces between components are genuinely transparent. The white object surfaces will become theme-colored occlusion masks in code, while their dark contours are extracted and tinted separately. Thus DO NOT make the body interiors alpha-transparent, and DO NOT add any background rectangle, drop shadow, checkerboard or grid. Keep the same restrained fine wireframe appearance without shaded rendering. White surfaces never contain ghosted lines of parts behind them.
The arch in each of the two tall objects rises nearly vertically from the outer LEFT side, begins a very gentle rightward bend only high up, and is partial, ending before any full overhead arc or second cup. Leave ample upper margin; code will fade its uppermost strokes. Fully contain all five objects inside the canvas with generous margins. No text, logos or labels.
