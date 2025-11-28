/**
 * Pure CSS loading spinner with staggered pulse animation.
 * No framer-motion dependency - uses CSS keyframes from index.css.
 * Respects prefers-reduced-motion via CSS media query.
 */
export const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center min-h-[100px]">
      <div className="relative w-[48px] h-4">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={`dot-${index}`}
            className={`absolute inline-block w-4 h-4 bg-primary rounded-full dot-pulse dot-pulse-${index + 1}`}
            style={{
              left: `${index * 12}px`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingAnimation;
