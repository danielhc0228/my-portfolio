# Cursor Glow Trail — Design

## Purpose

Add a decorative cursor effect to the portfolio site: a glowing light follows the
mouse, changes color as the cursor moves (frozen while stationary), leaves a
smooth fading streak behind it, and pulses an expanding ring of light on click.
Purely cosmetic — no interaction with existing functionality.

## Approach

Custom `<canvas>` overlay, drawn imperatively with `requestAnimationFrame`. No new
npm dependency is required — `framer-motion` (already installed) is not well
suited to a continuous glowing streak, and off-the-shelf cursor-trail libraries
don't support "hue advances only while moving" without being fought/forked. A
small custom canvas component gives full control in ~150 lines.

## Component

`src/components/CursorGlow.tsx` — self-contained, no props. Mounted once in
`src/main.tsx`, above `<App />`, so it overlays every route via `react-router`
and persists across navigation (mount/unmount is not tied to route changes).

### Rendering

- A `<canvas>` fixed to the viewport (`position: fixed; inset: 0; z-index: 9999;
  pointer-events: none;`), resized to `window.innerWidth/innerHeight` on mount
  and on `resize`.
- `pointer-events: none` and no `cursor: none` anywhere — the real OS cursor
  stays visible and fully functional; the canvas only paints on top.
- Not rendered at all when `matchMedia('(pointer: fine)')` is false (touch/coarse
  pointer devices) or when `matchMedia('(prefers-reduced-motion: reduce)')` is
  true — the effect has no meaning without a hovering mouse, and reduced-motion
  users opt out of decorative animation.

### State (refs, not React state — avoids re-render per mouse event)

- `pointsRef`: array of trail points `{ x, y, hue, t }`, `t` = timestamp when
  recorded.
- `burstsRef`: array of click bursts `{ x, y, hue, t }`.
- `hueRef`: current hue value (0–360 internally, mapped into the cool band when
  drawing).
- `lastPosRef`: last recorded `{x, y}`, used to measure movement distance.

### Input handling

- `mousemove` (window): compute distance from `lastPosRef` to the new position.
  - If distance > a small epsilon (~1px, to ignore jitter), advance `hueRef` by
    `distance * SENSITIVITY` (wrapping mod 360) and push a new point with the
    *updated* hue.
  - If distance is ~0, do not advance hue and do not push a redundant point.
  - Update `lastPosRef`.
- `mousedown` (window): push a new entry into `burstsRef` at the current cursor
  position using the current `hueRef` value.

### Animation loop (single `requestAnimationFrame` loop, started on mount)

Each frame:
1. Clear the canvas (`clearRect`), so nothing washes over page content.
2. Drop points/bursts older than their max age (~400ms for trail points, ~500ms
   for bursts) from the front of each array.
3. **Trail**: stroke a path through the remaining trail points. Each segment
   uses the hue stored on its point (so a fast swipe shows a short gradient
   across the cool band), with alpha fading from ~0.8 to 0 by age, and
   `shadowBlur`/`shadowColor` set for the glow look.
4. **Cursor glow core**: draw a small radial-gradient circle at the current
   cursor position using `hueRef`, for the "glowing light around the cursor"
   itself (visible even when stationary, unlike the trail which empties out
   when not moving).
5. **Click bursts**: for each active burst, draw an expanding ring — radius
   eases from ~4px to ~40px over its lifetime, stroke alpha fades from 1 to 0 as
   it grows, colored with the hue captured at click time, glow via `shadowBlur`.
6. Request the next frame.

### Color range

Hue is mapped into a cool band (blue → cyan → purple → pink, roughly 180°–320°
on the HSL wheel) rather than the full spectrum, to stay consistent with the
site's dark minimalist look. Lightness/saturation tuned for visibility against
the `#0d0d0d` background (from `main.tsx`'s global style).

### Cleanup

On unmount: `cancelAnimationFrame`, remove `mousemove`/`mousedown`/`resize`
listeners. (In practice this component mounts once for the app's lifetime, but
cleanup is included for correctness/StrictMode double-invoke safety.)

## Out of scope

- No new dependency.
- No configuration/props — behavior is fixed per this spec.
- No mobile/touch trail (see `matchMedia` gate above).
- Does not change the real cursor's appearance or hit-testing.

## Testing

Manual verification only (this is a purely visual, decorative effect):
- `npm run dev`, move the mouse around the page and confirm the glow + streak
  follow it, color shifts while moving, and freezes when the mouse stops.
- Click and confirm an expanding glowing ring pulses outward from the click
  point.
- Resize the window and confirm the canvas still covers the full viewport.
- Navigate between routes (`/`, unknown route → `NotFound`) and confirm the
  effect persists without flicker/remount artifacts.
- Toggle OS/browser "reduce motion" setting and confirm the effect is disabled.
