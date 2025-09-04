
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactInfo from '@/components/ContactInfo';
import FloatingContactButton from '@/components/FloatingContactButton';
import ConstellationParticles from '@/components/visuals/ConstellationParticles';

type PageLayoutProps = {
  children: React.ReactNode;
  showContact?: boolean;
  showGeometry?: boolean; // FIX: Sitewide geometric field control
};

const PageLayout = ({ children, showContact = true, showGeometry = true }: PageLayoutProps) => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const isHomePage = location.pathname === '/';

  // Effect to scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background w-full">
      <Navbar />
      <motion.main
        key={location.pathname}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="relative isolate flex-1 pt-[var(--header-h)] contain-paint"
        style={{ position: 'relative', zIndex: 10 }}
        role="main"
        aria-live="polite"
      >
        {/* Centralized background wrapper - properly isolated */}
        {showGeometry && !isHomePage && (
          <div 
            aria-hidden="true"
            role="presentation"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden isolate"
          >
            <ConstellationParticles 
              density={32} 
              autoMobileDensity={true}
              className="w-full h-full"
            />
          </div>
        )}
        <div className="relative z-10">
          {children}
        </div>
      </motion.main>
      {showContact && <ContactInfo />}
      <Footer />
      {showContact && <FloatingContactButton />}
    </div>
  );
};

export default PageLayout;
