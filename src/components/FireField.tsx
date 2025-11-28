import { memo } from 'react';
import { cn } from '@/lib/utils';

interface FireFieldProps {
  className?: string;
}

/**
 * Pure CSS animated background gradient field.
 * Replaces framer-motion with CSS keyframes for better performance.
 * Respects prefers-reduced-motion via CSS media query.
 */
const FireField = memo(({ className }: FireFieldProps) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Radial gradient layer 1 - Top left */}
      <div
        className="absolute -top-20 -left-20 w-96 h-96 opacity-60 animate-pulse-slow"
        style={{
          background: 'radial-gradient(circle, #8B5CF6 0%, #A78BFA 35%, #C084FC 60%, transparent 80%)',
          filter: 'blur(40px)',
          mixBlendMode: 'screen',
          animation: 'pulse-slow 10s ease-in-out infinite reverse'
        }}
      />

      {/* Radial gradient layer 2 - Bottom right */}
      <div
        className="absolute -bottom-20 -right-20 w-80 h-80 opacity-50"
        style={{
          background: 'radial-gradient(circle, #7C3AED 0%, #8B5CF6 40%, #F0ABFC 70%, transparent 90%)',
          filter: 'blur(35px)',
          mixBlendMode: 'screen',
          animation: 'pulse-slow 12s ease-in-out infinite reverse 1s'
        }}
      />

      {/* Conic gradient flare */}
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 opacity-30 animate-rotate-slow"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, #8B5CF6 20%, #C084FC 40%, transparent 60%, #A78BFA 80%, transparent 100%)',
          filter: 'blur(30px)',
          mixBlendMode: 'plus-lighter'
        }}
      />

      {/* Soft ambient glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, #8B5CF6 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
    </div>
  );
});

FireField.displayName = 'FireField';

export default FireField;
