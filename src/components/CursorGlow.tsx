import { useEffect, useRef } from "react";

const TRAIL_MAX_AGE = 400; // ms a trail point stays visible
const BURST_MAX_AGE = 500; // ms a click-burst ring stays visible
const HUE_MIN = 180; // cool-band start (cyan-ish blue)
const HUE_RANGE = 140; // cool-band width -> ends ~320 (pink)
const HUE_SENSITIVITY = 0.6; // hue-accumulator degrees per px moved
const MOVE_EPSILON = 1; // px; ignores jitter so hue freezes when "stationary"

type TrailPoint = { x: number; y: number; hue: number; t: number };
type Burst = { x: number; y: number; hue: number; t: number };

function mapHue(rawHue: number) {
    const normalized = ((rawHue % 360) + 360) % 360;
    return HUE_MIN + (normalized / 360) * HUE_RANGE;
}

export default function CursorGlow() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const pointsRef = useRef<TrailPoint[]>([]);
    const burstsRef = useRef<Burst[]>([]);
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

        const handleMouseDown = (e: MouseEvent) => {
            burstsRef.current.push({
                x: e.clientX,
                y: e.clientY,
                hue: mapHue(hueAccumRef.current),
                t: performance.now(),
            });
        };
        window.addEventListener("mousedown", handleMouseDown);

        const draw = () => {
            const now = performance.now();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            pointsRef.current = pointsRef.current.filter(
                (p) => now - p.t < TRAIL_MAX_AGE
            );
            burstsRef.current = burstsRef.current.filter(
                (b) => now - b.t < BURST_MAX_AGE
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

            rafRef.current = requestAnimationFrame(draw);
        };
        rafRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
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
