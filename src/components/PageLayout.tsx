
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
    <div className="min-h-screen flex flex-col bg-background w-full max-w-[100vw] overflow-x-hidden">
      <Navbar />
      <motion.main
        key={location.pathname}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="relative isolate flex-1 pt-[var(--header-h)] overflow-visible"
        role="main"
        aria-live="polite"
      >
        {/* FIX: Sitewide GeometryField - enhanced visibility for business professionals */}
        {showGeometry && !isHomePage && (
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute inset-0 -z-10 overflow-visible opacity-30"
          >
            <ConstellationParticles 
              density={32} 
              autoMobileDensity={true}
              className="will-change-transform"
            />
          </div>
        )}
        {children}
      </motion.main>
      {showContact && <ContactInfo />}
      <Footer />
      {showContact && <FloatingContactButton />}
    </div>
  );
};

export default PageLayout;
