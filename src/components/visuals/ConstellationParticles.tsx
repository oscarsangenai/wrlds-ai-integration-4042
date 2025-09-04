import React, { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

interface ConstellationParticlesProps {
  className?: string;
  density?: number; // number of particles base
  paused?: boolean; // external pause control
  autoMobileDensity?: boolean; // auto-adjust for mobile
  executiveMode?: boolean; // enhanced neon styling for home page
  strokeWidth?: number;
  strokeOpacity?: number;
  haloRadius?: number;
  haloOpacity?: number;
  parallaxAmplitude?: number;
  animationPeriod?: number;
}

// Lightweight canvas constellation with mouse linking + business-grade autopause
const ConstellationParticles: React.FC<ConstellationParticlesProps> = ({ 
  className, 
  density = 70, 
  paused = false,
  autoMobileDensity = true,
  executiveMode = false,
  strokeWidth = 1.4,
  strokeOpacity = 0.6,
  haloRadius = 8,
  haloOpacity = 0.8,
  parallaxAmplitude = 0,
  animationPeriod = 14
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

    // Cap DPR on mobile for performance
    const isMobileDevice = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobileDevice ? 1.5 : 2);
    let width = 0, height = 0;

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let points: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      // Guard against zero dimensions
      if (width <= 0 || height <= 0) return;
      
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // FIX: Mobile-safe density scaling for business devices
      let effectiveDensity = density;
      if (autoMobileDensity) {
        const isMobile = width < 768;
        if (executiveMode) {
          // Executive mode: desktop 36/56, mobile 22/34  
          effectiveDensity = isMobile ? 22 : 36;
        } else {
          effectiveDensity = isMobile ? Math.floor(density * 0.55) : density;
        }
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

    // Debounced resize handler
    let resizeTimeout: number;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resize, 150);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse.current = null; };

    canvas.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave, { passive: true });
    window.addEventListener("resize", debouncedResize, { passive: true });
    resize();

    let lastFrameTime = 0;
    let isVisible = true;
    const targetFPS = isMobileDevice ? 30 : 60; // Mobile FPS cap
    const frameInterval = 1000 / targetFPS;

    // Setup intersection observer for performance
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    const draw = (currentTime = 0) => {
      // Enhanced pause logic with visibility check
      if (isPausedRef.current || !isVisible || shouldReduceMotion) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Guard against zero dimensions
      if (width <= 0 || height <= 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // FPS limiter for mobile
      if (currentTime - lastFrameTime < frameInterval) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = currentTime;

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
      
      // Executive neon stroke - configurable for executive mode
      ctx.strokeStyle = `rgba(139, 92, 246, ${strokeOpacity})`;
      ctx.lineWidth = strokeWidth;
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
      ctx.shadowColor = `rgba(139, 92, 246, ${haloOpacity})`;
      ctx.shadowBlur = haloRadius;
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
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", debouncedResize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      intersectionObserver.disconnect();
    };
  }, [density, handleVisibilityChange]);

  return <canvas ref={ref} className={"pointer-events-none " + (className || "")} aria-hidden="true" role="presentation" />;
};

export default ConstellationParticles;
