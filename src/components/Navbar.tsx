
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    const updateNavHeight = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        const height = nav.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--nav-h', `${height}px`);
        document.documentElement.style.setProperty('--header-h', `${height}px`);
      }
    };

    // Setup ResizeObserver for navbar height stability
    const nav = document.querySelector('nav');
    let resizeObserver: ResizeObserver | null = null;
    
    if (nav && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        updateNavHeight();
      });
      resizeObserver.observe(nav);
    }
    
    // Listen for orientation changes
    const handleOrientationChange = () => {
      setTimeout(updateNavHeight, 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange);
    updateNavHeight(); // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('orientationchange', handleOrientationChange);
      resizeObserver?.disconnect();
    };
  }, []);

  const location = useLocation();
  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      id="navbar"
      data-testid="navbar"
      className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full bg-[hsl(var(--footer))] shadow-lg")}
      initial={{
      opacity: 1,
      y: 0
    }} animate={{
      opacity: 1,
      y: 0
    }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={`${import.meta.env.BASE_URL || '/'}lovable-uploads/b7475833-17ac-4265-9aab-d6bc61ae42ce.png`} alt="Gen AI Global Logo" className="h-8 w-auto md:h-10" loading="lazy" decoding="async" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu className="z-50 text-[hsl(var(--primary-foreground))]">
              <NavigationMenuList>
                 {[
                   { to: '/', label: 'Home' },
                   { to: '/about', label: 'About Us' },
                   { to: '/community', label: 'Community' },
                   { to: '/resources', label: 'Resources' },
                   { to: '/spotlight', label: 'Spotlight' },
                 ].map((item) => (
                  <NavigationMenuItem key={item.to}>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-transparent",
                        isActive(item.to)
                          ? "text-[hsl(var(--accent))] underline underline-offset-4"
                          : "text-[hsl(var(--primary-foreground))]"
                      )}
                    >
                      <Link to={item.to} aria-current={isActive(item.to) ? 'page' : undefined}>
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                
                {/* Apply dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-transparent text-[hsl(var(--primary-foreground))]">
                    Apply
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="z-50 bg-background">
                    <ul className="grid w-[200px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/apply/member"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">General Member</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Join our community
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/apply/volunteer"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Volunteer</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Help build our community
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button type="button" onClick={toggleMenu} className="inline-flex items-center p-2 focus:outline-none text-[hsl(var(--footer-foreground))] focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(var(--primary))]">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={cn("md:hidden transition-all duration-300 overflow-hidden w-full", isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0")}> 
        <div className="px-3 pt-2 pb-3 space-y-1 shadow-sm overflow-y-auto max-h-screen bg-[hsl(var(--footer))]"> 
           {[
             { to: '/', label: 'Home' },
             { to: '/about', label: 'About Us' },
             { to: '/community', label: 'Community' },
             { to: '/resources', label: 'Resources' },
             { to: '/spotlight', label: 'Spotlight' },
           ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isActive(item.to) ? 'page' : undefined}
              className={cn(
                "block px-3 py-1.5 rounded-md text-sm",
                isActive(item.to) ? "text-[hsl(var(--accent))] underline underline-offset-4 font-semibold" : "text-[hsl(var(--footer-foreground))]"
              )}
              onClick={() => { setIsMenuOpen(false); window.scrollTo(0,0); }}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Apply section */}
          <div className="pt-2 border-t border-white/10">
            <div className="px-3 py-1.5 text-xs font-semibold text-[hsl(var(--footer-foreground))]/60 uppercase tracking-wider">
              Apply
            </div>
            <Link
              to="/apply/member"
              className="block px-3 py-1.5 rounded-md text-sm text-[hsl(var(--footer-foreground))] hover:text-[hsl(var(--accent))]"
              onClick={() => { setIsMenuOpen(false); window.scrollTo(0,0); }}
            >
              General Member
            </Link>
            <Link
              to="/apply/volunteer"
              className="block px-3 py-1.5 rounded-md text-sm text-[hsl(var(--footer-foreground))] hover:text-[hsl(var(--accent))]"
              onClick={() => { setIsMenuOpen(false); window.scrollTo(0,0); }}
            >
              Volunteer
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
