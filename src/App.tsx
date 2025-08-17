import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import TransitionRoute from "@/components/motion/TransitionRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import DevelopmentProcess from "./pages/DevelopmentProcess";
import TechDetails from "./pages/TechDetails";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Spotlight from "./pages/Spotlight";
import Join from "./pages/Join";
import GetInvolved from "./pages/GetInvolved";
import Placeholder from "./pages/Placeholder"; // Terms of Service placeholder

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<TransitionRoute><Index /></TransitionRoute>} />
        <Route path="/about" element={<TransitionRoute><About /></TransitionRoute>} />
        <Route path="/community" element={<TransitionRoute><Community /></TransitionRoute>} />
        <Route path="/resources" element={<TransitionRoute><Resources /></TransitionRoute>} />
        <Route path="/spotlight" element={<TransitionRoute><Spotlight /></TransitionRoute>} />
        <Route path="/join" element={<TransitionRoute><Join /></TransitionRoute>} />
        <Route path="/get-involved" element={<TransitionRoute><GetInvolved /></TransitionRoute>} />
        <Route path="/blog" element={<TransitionRoute><Blog /></TransitionRoute>} />
        <Route path="/blog/:slug" element={<TransitionRoute><BlogPostDetail /></TransitionRoute>} />
        <Route path="/development-process" element={<TransitionRoute><DevelopmentProcess /></TransitionRoute>} />
        <Route path="/tech-details" element={<TransitionRoute><TechDetails /></TransitionRoute>} />
        <Route path="/privacy-policy" element={<TransitionRoute><PrivacyPolicy /></TransitionRoute>} />
        <Route path="/terms-of-service" element={<TransitionRoute><Placeholder /></TransitionRoute>} />
        <Route path="*" element={<TransitionRoute><NotFound /></TransitionRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
