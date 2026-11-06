"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; c: string; a: number };

const COLORS = ["201,214,195", "207,224,236", "233,225,211"];
const ORANGE = "111,154,124";

export default function PresenceCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const box = canvas.parentElement!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, cx = 0, cy = 0;
    let dpr = 1;
    let parts: P[] = [];
    let t = 0;
    let last = 0;
    let raf = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999, on: false };

    const spawn = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      c: Math.random() < 0.07 ? ORANGE : COLORS[(Math.random() * COLORS.length) | 0],
      a: 0.25 + Math.random() * 0.5,
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = box.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cx = w / 2;
      cy = h / 2;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#14181a";
      ctx.fillRect(0, 0, w, h);
      const n = w < 600 ? 350 : 650;
      parts = Array.from({ length: n }, spawn);
    };

    const step = (dt: number) => {
      t += dt * 0.5;
      const breath = Math.sin(t * 3);
      const R = 150 + breath * 10;

      // scia
      ctx.fillStyle = "rgba(20,24,26,.1)";
      ctx.fillRect(0, 0, w, h);

      // anelli che respirano
      ctx.lineWidth = 1;
      [[1, 6], [1.55, 10], [2.1, 14]].forEach(([k, amp], i) => {
        ctx.strokeStyle = `rgba(201,214,195,${0.1 - i * 0.025})`;
        ctx.beginPath();
        ctx.arc(cx, cy, R * k + Math.sin(t * 3 - i * 0.8) * amp, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.lineWidth = 1.1;
      for (const p of parts) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const r = Math.hypot(dx, dy) || 1;
        // moto tangenziale + rumore + attrazione verso l'anello
        let fx = (-dy / r) * 0.22 + Math.sin(p.y * 0.012 + t * 2) * 0.08;
        let fy = (dx / r) * 0.22 + Math.cos(p.x * 0.012 + t * 1.6) * 0.08;
        const pull = (R - r) * 0.0016;
        fx += (dx / r) * pull;
        fy += (dy / r) * pull;

        // cursore: repulsione + vortice
        if (mouse.on) {
          const mx = p.x - mouse.x;
          const my = p.y - mouse.y;
          const md = Math.hypot(mx, my);
          if (md < 130 && md > 0.001) {
            const s = (1 - md / 130) ** 2;
            fx += (mx / md) * s * 1.6 + (-my / md) * s * 1.2;
            fy += (my / md) * s * 1.6 + (mx / md) * s * 1.2;
          }
        }

        const ox = p.x, oy = p.y;
        p.vx = p.vx * 0.94 + fx * 0.5;
        p.vy = p.vy * 0.94 + fy * 0.5;
        p.x += p.vx * 3;
        p.y += p.vy * 3;

        ctx.strokeStyle = `rgba(${p.c},${p.a})`;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20 || Math.random() < 0.002) {
          Object.assign(p, spawn(), { vx: 0, vy: 0 });
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const dt = Math.min((now - last) / 1000 || 0.016, 0.05);
      last = now;
      step(dt);
    };

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();

    if (reduce) {
      for (let i = 0; i < 260; i++) step(0.016); // singolo frame statico
    } else {
      start();
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (reduce) return;
        visible ? start() : stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) for (let i = 0; i < 260; i++) step(0.016);
    });
    ro.observe(box);

    const pos = (cX: number, cY: number) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = cX - r.left;
      mouse.y = cY - r.top;
      mouse.on = true;
    };
    const onMove = (e: PointerEvent) => pos(e.clientX, e.clientY);
    const onLeave = () => (mouse.on = false);
    const onTouch = (e: TouchEvent) => e.touches[0] && pos(e.touches[0].clientX, e.touches[0].clientY);

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("touchstart", onTouch, { passive: true });
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("touchend", onLeave);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchend", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full touch-pan-y" aria-hidden />;
}
