import React, { Suspense, lazy, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import TransitionRoute from '@/components/motion/TransitionRoute';
import LoadingAnimation from '@/components/LoadingAnimation';

// Lazy pages for route-level code splitting
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const About = lazy(() => import('./pages/About'));
const Community = lazy(() => import('./pages/Community'));
const Resources = lazy(() => import('./pages/Resources'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const DevelopmentProcess = lazy(() => import('./pages/DevelopmentProcess'));
const TechDetails = lazy(() => import('./pages/TechDetails'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Spotlight = lazy(() => import('./pages/Spotlight'));
const Hackathon = lazy(() => import('./pages/Hackathon'));
const GetInvolved = lazy(() => import('./pages/GetInvolved'));
const Placeholder = lazy(() => import('./pages/Placeholder'));
const Careers = lazy(() => import('./pages/Careers'));
const ApplicationConfirmation = lazy(() => import('./pages/ApplicationConfirmation'));
const FireCatProject = lazy(() => import('./pages/FireCatProject'));
const HockeyProject = lazy(() => import('./pages/HockeyProject'));
const PetProject = lazy(() => import('./pages/PetProject'));
const SportRetailProject = lazy(() => import('./pages/SportRetailProject'));
const WorkwearProject = lazy(() => import('./pages/WorkwearProject'));

// Hidden registration pages - DO NOT ADD TO NAVIGATION
const MemberApply = lazy(() => import('./pages/apply/MemberApply'));
const VolunteerApply = lazy(() => import('./pages/apply/VolunteerApply'));
const FormSubmissions = lazy(() => import('./pages/FormSubmissions'));


const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL || '/'}>
        <AnimatedRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<LoadingAnimation />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<TransitionRoute><Index /></TransitionRoute>} />
          <Route path="/about" element={<TransitionRoute><About /></TransitionRoute>} />
          <Route path="/hackathon" element={<TransitionRoute><Hackathon /></TransitionRoute>} />
          <Route path="/community" element={<TransitionRoute><Community /></TransitionRoute>} />
          <Route path="/resources" element={<TransitionRoute><Resources /></TransitionRoute>} />
          <Route path="/spotlight" element={<TransitionRoute><Spotlight /></TransitionRoute>} />
          <Route path="/get-involved" element={<TransitionRoute><GetInvolved /></TransitionRoute>} />
          <Route path="/blog" element={<TransitionRoute><Blog /></TransitionRoute>} />
          <Route path="/blog/:slug" element={<TransitionRoute><BlogPostDetail /></TransitionRoute>} />
          <Route path="/development-process" element={<TransitionRoute><DevelopmentProcess /></TransitionRoute>} />
          <Route path="/tech-details" element={<TransitionRoute><TechDetails /></TransitionRoute>} />
          <Route path="/privacy-policy" element={<TransitionRoute><PrivacyPolicy /></TransitionRoute>} />
          <Route path="/terms-of-service" element={<TransitionRoute><Placeholder /></TransitionRoute>} />
          <Route path="/careers" element={<TransitionRoute><Careers /></TransitionRoute>} />
          <Route path="/application-confirmation" element={<TransitionRoute><ApplicationConfirmation /></TransitionRoute>} />
          <Route path="/projects/firecat" element={<TransitionRoute><FireCatProject /></TransitionRoute>} />
          <Route path="/projects/hockey" element={<TransitionRoute><HockeyProject /></TransitionRoute>} />
          <Route path="/projects/pet" element={<TransitionRoute><PetProject /></TransitionRoute>} />
          <Route path="/projects/sport-retail" element={<TransitionRoute><SportRetailProject /></TransitionRoute>} />
          <Route path="/projects/workwear" element={<TransitionRoute><WorkwearProject /></TransitionRoute>} />
          
          {/* Hidden registration routes - accessible by direct URL only, not in site navigation */}
          <Route path="/apply/member" element={<TransitionRoute><MemberApply /></TransitionRoute>} />
          <Route path="/apply/volunteer" element={<TransitionRoute><VolunteerApply /></TransitionRoute>} />
          
          {/* Admin dashboard for form submissions */}
          <Route path="/admin/form-submissions" element={<TransitionRoute><FormSubmissions /></TransitionRoute>} />
          
          <Route path="*" element={<TransitionRoute><NotFound /></TransitionRoute>} />

        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default App;