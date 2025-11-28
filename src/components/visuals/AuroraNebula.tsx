import { memo } from "react";
import { cn } from "@/lib/utils";

interface AuroraNebulaProps {
  className?: string;
}

/**
 * Pure CSS aurora nebula background effect.
 * Uses custom keyframe animations for slow drift and parallax.
 * Respects prefers-reduced-motion via CSS media query.
 */
const AuroraNebula = memo(({ className }: AuroraNebulaProps) => {
  return (
    <div className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}>
      {/* Subtle dotted star grid with parallax */}
      <div
        className="absolute inset-0 opacity-40"
        style={{ 
          background: "radial-gradient(hsl(var(--accent)/0.12) 1px, transparent 1px)", 
          backgroundSize: "22px 22px",
          animation: "starfield-parallax 30s ease-in-out infinite"
        }}
      />

      {/* Aurora blob 1 - Top left */}
      <div
        className="absolute -top-24 -left-24 h-[60vh] w-[60vw] rounded-full blur-3xl"
        style={{ 
          background: "radial-gradient(closest-side, hsl(var(--accent)/0.35), transparent 70%)", 
          mixBlendMode: "screen",
          animation: "aurora-drift-1 26s ease-in-out infinite"
        }}
      />
      
      {/* Aurora blob 2 - Top right */}
      <div
        className="absolute -top-16 right-[-10%] h-[50vh] w-[45vw] rounded-full blur-3xl"
        style={{ 
          background: "radial-gradient(closest-side, hsl(var(--accent)/0.28), transparent 70%)", 
          mixBlendMode: "screen",
          animation: "aurora-drift-2 24s ease-in-out infinite"
        }}
      />
      
      {/* Aurora blob 3 - Bottom center */}
      <div
        className="absolute bottom-[-10%] left-1/2 h-[45vh] w-[50vw] -translate-x-1/2 rounded-full blur-3xl"
        style={{ 
          background: "radial-gradient(closest-side, hsl(var(--accent)/0.22), transparent 70%)", 
          mixBlendMode: "screen",
          animation: "aurora-drift-3 28s ease-in-out infinite"
        }}
      />
    </div>
  );
});

AuroraNebula.displayName = 'AuroraNebula';

export default AuroraNebula;
