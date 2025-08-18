
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactInfo from '@/components/ContactInfo';
import FloatingContactButton from '@/components/FloatingContactButton';
import AuroraNebula from '@/components/visuals/AuroraNebula';
import ConstellationParticles from '@/components/visuals/ConstellationParticles';

type PageLayoutProps = {
  children: React.ReactNode;
  showContact?: boolean;
};

const PageLayout = ({ children, showContact = true }: PageLayoutProps) => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  // Effect to scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background w-full max-w-[100vw] overflow-x-hidden relative">
      {/* Background animations - fixed top-right, responsive */}
      <div className="fixed top-16 right-0 w-80 h-80 md:w-96 md:h-96 lg:w-[30rem] lg:h-[30rem] z-0 pointer-events-none">
        <AuroraNebula className="w-full h-full" />
        <ConstellationParticles className="w-full h-full" density={40} />
      </div>
      
      <Navbar />
      <motion.main
        key={location.pathname}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="pt-16 md:pt-20 flex-1 relative z-10"
        role="main"
        aria-live="polite"
      >
        {children}
      </motion.main>
      {showContact && <ContactInfo />}
      <Footer />
      {showContact && <FloatingContactButton />}
    </div>
  );
};

export default PageLayout;
