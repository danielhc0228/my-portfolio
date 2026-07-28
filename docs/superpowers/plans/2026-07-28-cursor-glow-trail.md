# Cursor Glow Trail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a decorative glowing cursor effect (color-shifting trail while moving, frozen while stationary, expanding light-ring on click) that overlays the whole portfolio site.

**Architecture:** A single self-contained React component (`CursorGlow.tsx`) renders a fixed, full-viewport, `pointer-events: none` `<canvas>`. It tracks mouse position/movement/clicks in refs and runs one `requestAnimationFrame` loop that draws a fading trail streak, a glow core at the live cursor position, and expanding click-burst rings. Mounted once at the app root so it persists across all routes.

**Tech Stack:** React 19 + TypeScript + Vite. No new npm dependency — plain Canvas 2D API. (Full rationale in the design spec.)

## Global Constraints

- No new npm dependency (spec: "Approach" — off-the-shelf libraries and framer-motion were both rejected in favor of a plain canvas).
- Real OS cursor must stay visible and functional: `pointer-events: none` on the canvas, never set CSS `cursor: none` (spec: "Rendering").
- Hue must only advance while the cursor is actually moving; it must freeze while stationary (spec: "Input handling").
- Color range restricted to the cool band ~180°–320° on the HSL wheel, not full rainbow (spec: "Color range").
- Effect must not render on coarse/touch pointers (`matchMedia('(pointer: fine)')` false) or when `prefers-reduced-motion: reduce` is set (spec: "Rendering").
- No project test framework exists (no vitest/jest configured) — verification is via `npm run build` (type-check) and manual browser checks, matching the spec's own "Testing" section.

---

### Task 1: Canvas scaffold, gating, and mount

**Files:**
- Create: `src/components/CursorGlow.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Produces: `export default function CursorGlow(): JSX.Element` — a zero-prop component safe to mount anywhere in the tree. Later tasks add drawing logic inside this same component; they must not change its export shape.

- [ ] **Step 1: Create the component with gating, canvas mount, and resize handling (no drawing yet)**

Create `src/components/CursorGlow.tsx`:

```tsx
import { useEffect, useRef } from "react";

export default function CursorGlow() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canPointFine = window.matchMedia("(pointer: fine)").matches;
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (!canPointFine || prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                pointerEvents: "none",
            }}
        />
    );
}
```

- [ ] **Step 2: Mount it once at the app root**

In `src/main.tsx`, add the import and render `<CursorGlow />` above `<App />` so it overlays every route:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import CursorGlow from "./components/CursorGlow.tsx";
import { createGlobalStyle } from "styled-components";
```

(rest of the file's `GlobalStyle` definition unchanged), then change the render call:

```tsx
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <GlobalStyle />
        <CursorGlow />
        <App />
    </StrictMode>
);
```

- [ ] **Step 3: Type-check and build**

Run: `npm run build`
Expected: completes with no TypeScript errors.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, open the printed local URL in a browser.
Verify:
- Page loads normally, no visual change yet (canvas is transparent/empty).
- Open browser devtools, confirm a `<canvas>` element covering the full viewport exists in the DOM.
- Resize the browser window and confirm (via devtools) the canvas `width`/`height` attributes track the window size.
- In devtools, emulate "prefers-reduced-motion: reduce" (Rendering tab → Emulate CSS media) and confirm no console errors; the canvas still mounts but its internal effect body returns early (no resize listener attached — fine, since there's nothing drawn yet either way).

- [ ] **Step 5: Commit**

```bash
git add src/components/CursorGlow.tsx src/main.tsx
git commit -m "Add cursor glow canvas scaffold, mounted at app root"
```

---

### Task 2: Mouse trail + color-shifting glow core

**Files:**
- Modify: `src/components/CursorGlow.tsx`

**Interfaces:**
- Consumes: the `canvasRef`, `resize` effect, and gating checks from Task 1 — extend the same `useEffect` body, don't duplicate it.
- Produces: internal `TrailPoint` type and `mapHue` helper that Task 3 reuses for burst coloring. Exact names: `type TrailPoint = { x: number; y: number; hue: number; t: number }`, `function mapHue(rawHue: number): number`.

- [ ] **Step 1: Extend the component with mouse tracking, hue accumulation, and the trail/glow draw loop**

Replace the contents of `src/components/CursorGlow.tsx` with:

```tsx
import { useEffect, useRef } from "react";

const TRAIL_MAX_AGE = 400; // ms a trail point stays visible
const HUE_MIN = 180; // cool-band start (cyan-ish blue)
const HUE_RANGE = 140; // cool-band width -> ends ~320 (pink)
const HUE_SENSITIVITY = 0.6; // hue-accumulator degrees per px moved
const MOVE_EPSILON = 1; // px; ignores jitter so hue freezes when "stationary"

type TrailPoint = { x: number; y: number; hue: number; t: number };

function mapHue(rawHue: number) {
    const normalized = ((rawHue % 360) + 360) % 360;
    return HUE_MIN + (normalized / 360) * HUE_RANGE;
}

export default function CursorGlow() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const pointsRef = useRef<TrailPoint[]>([]);
    const hueAccumRef = useRef(0);
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);
    const cursorPosRef = useRef<{ x: number; y: number } | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const canPointFine = window.matchMedia("(pointer: fine)").matches;
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (!canPointFine || prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX: x, clientY: y } = e;
            cursorPosRef.current = { x, y };
            const last = lastPosRef.current;
            const dist = last ? Math.hypot(x - last.x, y - last.y) : 0;
            if (!last || dist > MOVE_EPSILON) {
                hueAccumRef.current += dist * HUE_SENSITIVITY;
                pointsRef.current.push({
                    x,
                    y,
                    hue: mapHue(hueAccumRef.current),
                    t: performance.now(),
                });
                lastPosRef.current = { x, y };
            }
        };
        window.addEventListener("mousemove", handleMouseMove);

        const draw = () => {
            const now = performance.now();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            pointsRef.current = pointsRef.current.filter(
                (p) => now - p.t < TRAIL_MAX_AGE
            );

            const points = pointsRef.current;
            for (let i = 1; i < points.length; i++) {
                const p0 = points[i - 1];
                const p1 = points[i];
                const age = now - p1.t;
                const alpha = Math.max(0, 1 - age / TRAIL_MAX_AGE) * 0.8;
                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(p1.x, p1.y);
                ctx.strokeStyle = `hsla(${p1.hue}, 90%, 65%, ${alpha})`;
                ctx.lineWidth = 3;
                ctx.lineCap = "round";
                ctx.shadowBlur = 15;
                ctx.shadowColor = `hsla(${p1.hue}, 90%, 65%, ${alpha})`;
                ctx.stroke();
            }

            const cursor = cursorPosRef.current;
            if (cursor) {
                const hue = mapHue(hueAccumRef.current);
                const gradient = ctx.createRadialGradient(
                    cursor.x,
                    cursor.y,
                    0,
                    cursor.x,
                    cursor.y,
                    18
                );
                gradient.addColorStop(0, `hsla(${hue}, 100%, 75%, 0.9)`);
                gradient.addColorStop(1, `hsla(${hue}, 100%, 75%, 0)`);
                ctx.shadowBlur = 0;
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(cursor.x, cursor.y, 18, 0, Math.PI * 2);
                ctx.fill();
            }

            rafRef.current = requestAnimationFrame(draw);
        };
        rafRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                pointerEvents: "none",
            }}
        />
    );
}
```

- [ ] **Step 2: Type-check and build**

Run: `npm run build`
Expected: completes with no TypeScript errors.

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open the app in a browser.
Verify:
- Moving the mouse shows a glowing streak trailing behind the cursor, and a glowing core sitting right at the live cursor position.
- The glow's color visibly shifts (cycling through blue/cyan/purple/pink) while moving the mouse continuously in one direction.
- Stop moving the mouse and hold it still for a couple seconds: the core glow's color stops changing (freezes), and the trailing streak shrinks away and disappears (no residual old segments).
- Move the mouse very slowly (near `MOVE_EPSILON`) and confirm there's no color flicker/jitter.
- The real OS cursor (arrow/pointer) is still visible and normal clicking/hovering on page links (e.g. the Header nav) still works.

- [ ] **Step 4: Commit**

```bash
git add src/components/CursorGlow.tsx
git commit -m "Add color-shifting trail and glow core to cursor effect"
```

---

### Task 3: Click burst ring effect

**Files:**
- Modify: `src/components/CursorGlow.tsx`

**Interfaces:**
- Consumes: `mapHue`, `hueAccumRef`, the shared `draw` loop, and the shared cleanup `return` from Task 2 — extend them in place, don't create a second loop or a second `mousedown`-only effect.

- [ ] **Step 1: Add burst state, a `mousedown` listener, and burst rendering inside the existing draw loop**

Apply these edits to `src/components/CursorGlow.tsx` (on top of Task 2's version):

Add a burst max-age constant next to `TRAIL_MAX_AGE`:

```tsx
const TRAIL_MAX_AGE = 400; // ms a trail point stays visible
const BURST_MAX_AGE = 500; // ms a click-burst ring stays visible
```

Add a `Burst` type next to `TrailPoint`:

```tsx
type TrailPoint = { x: number; y: number; hue: number; t: number };
type Burst = { x: number; y: number; hue: number; t: number };
```

Add a `burstsRef` next to `pointsRef`:

```tsx
const pointsRef = useRef<TrailPoint[]>([]);
const burstsRef = useRef<Burst[]>([]);
```

Add a `mousedown` handler next to the `mousemove` listener registration:

```tsx
const handleMouseDown = (e: MouseEvent) => {
    burstsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        hue: mapHue(hueAccumRef.current),
        t: performance.now(),
    });
};
window.addEventListener("mousedown", handleMouseDown);
```

Prune expired bursts alongside the existing points pruning inside `draw`:

```tsx
pointsRef.current = pointsRef.current.filter(
    (p) => now - p.t < TRAIL_MAX_AGE
);
burstsRef.current = burstsRef.current.filter(
    (b) => now - b.t < BURST_MAX_AGE
);
```

Draw the expanding rings — add this block in `draw`, after the cursor glow core block and before `rafRef.current = requestAnimationFrame(draw);`:

```tsx
for (const b of burstsRef.current) {
    const age = now - b.t;
    const progress = age / BURST_MAX_AGE;
    const radius = 4 + progress * 36;
    const alpha = Math.max(0, 1 - progress);
    ctx.beginPath();
    ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${b.hue}, 100%, 75%, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = `hsla(${b.hue}, 100%, 75%, ${alpha})`;
    ctx.stroke();
}
```

Remove the `mousedown` listener in the cleanup `return`, alongside the existing removals:

```tsx
return () => {
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mousedown", handleMouseDown);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
};
```

- [ ] **Step 2: Type-check and build**

Run: `npm run build`
Expected: completes with no TypeScript errors.

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open the app in a browser.
Verify:
- Clicking anywhere on the page produces a glowing ring that expands outward from the click point and fades out over roughly half a second.
- The ring's color matches whatever hue the cursor glow was showing at the moment of the click.
- Clicking rapidly in different spots produces multiple independent rings expanding simultaneously, each fading out on its own without errors in the console.
- Clicking still works normally on real page elements (e.g. the "Github" link in the Header, the scroll-to-top button in `App.tsx`) — the burst is purely visual and doesn't block the click.
- Navigate between `/` and an unknown route (e.g. `/doesnotexist`, which renders `NotFound`) and confirm the cursor glow effect (trail, core, clicks) keeps working without remounting glitches.

- [ ] **Step 4: Commit**

```bash
git add src/components/CursorGlow.tsx
git commit -m "Add expanding light-ring burst on click"
```
