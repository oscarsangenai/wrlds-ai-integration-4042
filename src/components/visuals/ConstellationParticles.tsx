import React, { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

interface ConstellationParticlesProps {
  className?: string;
  density?: number; // number of particles base
  paused?: boolean; // external pause control
  autoMobileDensity?: boolean; // auto-adjust for mobile
}

// Lightweight canvas constellation with mouse linking + business-grade autopause
const ConstellationParticles: React.FC<ConstellationParticlesProps> = ({ 
  className, 
  density = 70, 
  paused = false,
  autoMobileDensity = true 
}) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  // FIX: Autopause when offscreen or tab hidden
  const handleVisibilityChange = useCallback(() => {
    isPausedRef.current = document.hidden || paused || shouldReduceMotion;
  }, [paused, shouldReduceMotion]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [handleVisibilityChange]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0, height = 0;

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let points: P[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // FIX: Mobile-safe density scaling for business devices
      let effectiveDensity = density;
      if (autoMobileDensity) {
        const isMobile = width < 768;
        effectiveDensity = isMobile ? Math.floor(density * 0.55) : density;
      }
      
      const count = Math.floor(effectiveDensity * (width * height) / (1280 * 720));
      points = new Array(Math.max(20, count)).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.2 + 0.4,
      }));
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse.current = null; };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      // FIX: Business-grade autopause + performance throttling
      if (isPausedRef.current) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Update particles only when not paused
      for (const p of points) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // FIX: Executive neon styling with enhanced visibility
      const linkDist = Math.min(140, Math.max(80, Math.hypot(width, height) / 16));
      const scaledLinkDist = width < 768 ? linkDist * 0.8 : linkDist;
      
      // Executive neon stroke - more visible for business professionals
      ctx.strokeStyle = `rgba(139, 92, 246, 0.6)`;
      ctx.lineWidth = 1.4;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < scaledLinkDist) {
            ctx.globalAlpha = 1 - d / scaledLinkDist;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Draw points with neon glow effect
      ctx.fillStyle = `rgba(167, 139, 250, 0.9)`;
      ctx.shadowColor = `rgba(139, 92, 246, 0.8)`;
      ctx.shadowBlur = 8;
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Mouse links (executive network feel)
      if (mouse.current) {
        const m = mouse.current;
        for (const p of points) {
          const d = Math.hypot(p.x - m.x, p.y - m.y);
          if (d < scaledLinkDist) {
            ctx.globalAlpha = 1 - d / scaledLinkDist;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(192, 132, 252, 0.4)`;
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    // FIX: Initialize autopause state and start animation
    handleVisibilityChange();
    rafRef.current = requestAnimationFrame(draw);
    
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [density, handleVisibilityChange]);

  return <canvas ref={ref} className={"pointer-events-none absolute inset-0 z-0 " + (className || "")} />;
};

export default ConstellationParticles;
