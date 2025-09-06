import { motion, useReducedMotion } from 'framer-motion';

const SpotlightHeader = () => {
  const shouldReduceMotion = useReducedMotion();

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.2 : 0.6, ease: 'easeOut' }
    }
  };

  return (
    <motion.section 
      className="relative z-10 pt-20 pb-8 px-4 text-center"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent text-balance text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl mb-6 font-sans">
          Member Spotlight
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Celebrating the outstanding members and achievements that drive our Gen AI Global community forward.
        </p>
      </div>
    </motion.section>
  );
};

export default SpotlightHeader;