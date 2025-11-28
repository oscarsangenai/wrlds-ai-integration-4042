import { ArrowRight, Code, Cpu, Layers, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/useInView";

const Hero = () => {
  const isMobile = useIsMobile();
  const { ref: heroRef, isInView: heroInView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: cardsRef, isInView: cardsInView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  
  return <div className="relative w-full">
      <div className="banner-container bg-black relative overflow-hidden min-h-[min(92vh,500px)] sm:min-h-[min(92vh,600px)] md:min-h-[min(92vh,700px)] lg:min-h-[min(92vh,800px)] w-full">
        <div className="absolute inset-0 bg-black w-full">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="metadata"
            className={`w-full h-full object-cover opacity-70 grayscale ${isMobile ? 'object-right' : 'object-center'}`}
            poster={`${import.meta.env.BASE_URL || '/'}lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png`}
          >
            <source src={`${import.meta.env.BASE_URL || '/'}lovable-uploads/video_1751292840840_1751292842546.mp4`} type="video/mp4" />
            {/* Fallback image if video fails to load */}
            <img 
              src={`${import.meta.env.BASE_URL || '/'}lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png`}
              alt="WRLDS Technologies Connected People" 
              className={`w-full h-full object-cover opacity-70 grayscale ${isMobile ? 'object-right' : 'object-center'}`}
              fetchPriority="high"
              loading="eager"
              decoding="sync"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-white"></div>
        </div>
        
        <div className="banner-overlay bg-transparent pt-20 sm:pt-24 md:pt-32 w-full">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full">
            <div ref={heroRef} className={`w-full max-w-4xl text-center ${heroInView ? 'animate-slide-up' : ''}`}>
              <h1 className="banner-title text-white">The Future of Smart Textile Technology is here.</h1>
              <p className="banner-subtitle text-gray-300 mt-4 sm:mt-6">
                We integrate AI-powered textile sensors into clothing, footwear, and wearables.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center items-center">
                {/* Styled as a button but using an anchor tag for project navigation */}
                <button type="button"
                  className="w-full sm:w-auto min-h-[44px] px-6 sm:px-8 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all shadow-lg hover:shadow-xl hover:shadow-gray-300/20 flex items-center justify-center group text-sm sm:text-base font-medium"
                  onClick={e => {
                    e.preventDefault();
                    const projectsSection = document.getElementById('projects');
                    if (projectsSection) {
                      projectsSection.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  Explore Projects
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                {/* Using the Button component from shadcn but with custom styling to match the explore button */}
                <button type="button"
                  className="w-full sm:w-auto min-h-[44px] px-6 sm:px-8 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:shadow-gray-300/20 flex items-center justify-center group text-sm sm:text-base font-medium"
                  onClick={scrollToContact}
                >
                  Contact Us
                  <MessageSquare className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div ref={cardsRef} className={`mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 ${cardsInView ? 'animate-in' : ''}`}>
          <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-slide-up stagger-1">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 flex items-center justify-center rounded-lg text-gray-500 mb-2 md:mb-3">
              <Cpu className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-gray-800">Smart Textiles</h3>
            <p className="text-gray-600 text-xs md:text-sm">Intelligent fabric sensors that seamlessly integrate into clothing and footwear.</p>
          </div>
          
          <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-slide-up stagger-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 flex items-center justify-center rounded-lg text-gray-500 mb-2 md:mb-3">
              <Code className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-gray-800">Adaptive AI</h3>
            <p className="text-gray-600 text-xs md:text-sm">Industry-specific algorithms that transform textile sensor data into meaningful insights.</p>
          </div>
          
          <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-slide-up stagger-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 flex items-center justify-center rounded-lg text-gray-500 mb-2 md:mb-3">
              <Layers className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-gray-800">Cross-Industry</h3>
            <p className="text-gray-600 text-xs md:text-sm">Solutions for sports, military, healthcare, industrial, and professional environments.</p>
          </div>
        </div>
      </div>
    </div>;
};

export default Hero;
