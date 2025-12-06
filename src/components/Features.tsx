import { useEffect, useRef, useState } from 'react';
import { Activity, Shield, HardHat, Zap, ArrowRight, Box, Truck, Code, CheckCircle, Rocket, Factory, Microchip, Handshake, RefreshCcw, MessageSquare } from "lucide-react";
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from 'react-router-dom';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  const [currentSprint, setCurrentSprint] = useState(1);
  const totalSprints = 3;
  const isMobile = useIsMobile();

  const features = [
    {
      icon: <Activity className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Sports Performance",
      description: "Specialized fabrics that analyze form, provide instant feedback, and help prevent injuries in athletic equipment.",
      image: `${import.meta.env.BASE_URL || '/'}lovable-uploads/48e540e5-6a25-44e4-b3f7-80f3bfc2777a.png`
    },
    {
      icon: <Shield className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Military & Defense",
      description: "Tactical gear with embedded sensors for soldier health monitoring, environmental awareness, and enhanced safety.",
      image: `${import.meta.env.BASE_URL || '/'}lovable-uploads/48ecf6e2-5a98-4a9d-af6f-ae2265cd4098.png`
    },
    {
      icon: <HardHat className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Industrial Safety",
      description: "Protective workwear that detects hazards, monitors fatigue, and prevents workplace injuries through early intervention.",
      image: `${import.meta.env.BASE_URL || '/'}lovable-uploads/cf8966e3-de0d-445f-9fbd-ee6c48daa7ff.png`
    },
    {
      icon: <Zap className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Thermal Regulation",
      description: "Adaptive heating and cooling textiles that respond to body temperature and environmental conditions.",
      image: `${import.meta.env.BASE_URL || '/'}lovable-uploads/6739bd63-bf19-4abd-bb23-0b613bbf7ac8.png`
    }
  ];

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact-info');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in');
          (entry.target as HTMLElement).style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    if (featuresRef.current) {
      const elements = featuresRef.current.querySelectorAll('.feature-item');
      elements.forEach(el => {
        if (!el.classList.contains('animate-slide-in')) {
          (el as HTMLElement).style.opacity = '0';
          observer.observe(el);
        }
      });
    }
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const animateProgress = () => {
      setProgressValue(0);
      interval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentSprint(prev => prev < totalSprints ? prev + 1 : 1);
              animateProgress();
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    };
    animateProgress();
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const sensorCaseStudies = [{
    image: `${import.meta.env.BASE_URL || '/'}lovable-uploads/843446fe-638e-4efb-b885-ed3cd505325a.png`,
    title: "Firefighter Safety",
    description: "Advanced protective gear with gas, temperature, positioning, and motion sensors for safer emergency response."
  }, {
    image: `${import.meta.env.BASE_URL || '/'}lovable-uploads/5463c9c5-0946-4280-a14b-17636ff69a98.png`,
    title: "Industrial Worker Protection",
    description: "Safety workwear with vibration, pressure, and heating sensors to prevent injuries and monitor environmental hazards."
  }, {
    image: `${import.meta.env.BASE_URL || '/'}lovable-uploads/c5f8ee24-9815-4ebe-b65d-6f3d449feb8b.png`,
    title: "Sports Performance",
    description: "Smart athletic wear with temperature and pressure sensors that track hydration, foot strike patterns, and performance metrics."
  }];
  const stepFlowItems = [{
    icon: <Microchip className="h-10 w-10 text-gray-700" />,
    title: "WRLDS Proprietary Modules",
    description: "Our core technology components developed in-house"
  }, {
    icon: <Factory className="h-10 w-10 text-gray-700" />,
    title: "Vetted Off-the-Shelf Hardware",
    description: "Carefully selected components that complement our technology"
  }, {
    icon: <Handshake className="h-10 w-10 text-gray-700" />,
    title: "Vetted Production Partners",
    description: "Expert manufacturing partners for quality and reliability"
  }];
  const sprintPhases = [{
    name: "Planning",
    icon: <CheckCircle className="h-4 w-4" />
  }, {
    name: "Development",
    icon: <Code className="h-4 w-4" />
  }, {
    name: "Testing",
    icon: <Box className="h-4 w-4" />
  }, {
    name: "Review",
    icon: <RefreshCcw className="h-4 w-4" />
  }];

  return <>
      <section id="features" className="relative bg-white overflow-hidden py-10 md:py-[50px] w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8" ref={featuresRef}> 
          <div className="text-center mb-10 max-w-3xl mx-auto feature-item">
            <div className="inline-block mb-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              Textile Sensor Applications
            </div>
            <p className="text-gray-600 mt-4">
              Our textile sensor technology transforms ordinary fabrics into intelligent interfaces that collect data, monitor conditions, and enhance performance across diverse sectors.
            </p>
          </div>
          
          {/* Feature cards grid - accessible layout without scroll hijacking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="feature-item rounded-xl overflow-hidden transform transition-all duration-500 relative shadow-lg hover:-translate-y-1 h-[280px]"
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
                onMouseEnter={() => setHoveredFeature(index)} 
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover transition-all duration-300 grayscale"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    hoveredFeature === index 
                      ? "bg-black/50" 
                      : "bg-black/70"
                  )}></div>
                </div>
                
                <div className="relative z-10 flex flex-col justify-between p-6 h-full">
                  <div>
                    <div className={cn(
                      "inline-block p-3 bg-gray-800/40 backdrop-blur-sm rounded-lg transition-all duration-300 transform mb-4",
                      hoveredFeature === index ? "hover:scale-110" : ""
                    )}>
                      <div className={`transform transition-transform duration-300 ${hoveredFeature === index ? 'rotate-12' : ''}`}>
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-white text-xl mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {feature.description}
                    </p>
                  </div>
                  <div className={`h-0.5 bg-white/70 mt-3 transition-all duration-500 ${hoveredFeature === index ? 'w-full' : 'w-0'}`}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 mb-8 feature-item">
            <div className="text-center mb-8">
              <div className="inline-block mb-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                Textile Sensor Applications
              </div>
              <h3 className="text-2xl font-bold">Real-World Use Cases</h3>
              <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                Explore how our textile sensors are applied in different professional contexts, 
                from emergency response to construction and athletics.
                <span className="block text-sm mt-1 text-blue-500">Scroll horizontally to see more examples →</span>
              </p>
            </div>
            
            <div className="rounded-xl overflow-hidden bg-white p-4 feature-item">
              <Carousel className="w-full max-w-7xl mx-auto">
                <CarouselContent className="flex">
                  {sensorCaseStudies.map((study, index) => <CarouselItem key={study.title} className="md:basis-1/3 flex-shrink-0">
                      <Card className="border border-gray-100 shadow-md">
                        <CardContent className="p-0">
                            <div className="w-full h-full">
                             <img src={study.image} alt={study.title} className="w-full h-auto object-contain" loading="lazy" decoding="async" />
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-lg">{study.title}</h4>
                            <p className="text-sm text-gray-600 mt-2">{study.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>)}
                </CarouselContent>
                <div className="flex justify-center mt-6 gap-2">
                  <CarouselPrevious className="relative static left-auto translate-y-0 hover:bg-gray-100" />
                  <CarouselNext className="relative static right-auto translate-y-0 hover:bg-gray-100" />
                </div>
              </Carousel>
              <div className="text-center mt-6 text-sm text-gray-600">
                <p className="font-medium">These examples showcase just a few ways our textile sensors can enhance safety and performance</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button type="button" onClick={scrollToContact} className="inline-flex items-center px-4 sm:px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all group w-full sm:w-auto">
            Need Custom Solutions?
            <MessageSquare className="ml-2 w-4 h-4 group-hover:animate-pulse" />
          </Button>
          
          <Button type="button" onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center px-4 sm:px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all group w-full sm:w-auto">
            Learn More About Our Technology
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
      
      <section id="technology" className="bg-gray-50 py-10 md:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              Our Approach
            </div>
            <h2 className="text-3xl font-bold mb-4">How our technology works</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              WRLDS builds hardware and software with proprietary and off-the-shelf modules, 
              allowing us to develop completely unique solutions at high speed and lower risk.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-10 transition-all duration-300 hover:shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {stepFlowItems.map((item, index) => <HoverCard key={item.title}>
                  <HoverCardTrigger asChild>
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 h-full cursor-pointer">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-gray-50 rounded-full p-4 mb-4">
                          {item.icon}
                        </div>
                        <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 shadow-lg">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{item.title}</h4>
                      <p className="text-sm">{item.description}</p>
                      {index === 0 && <p className="text-xs text-gray-500">Our proprietary technology provides the core foundation of every solution we build.</p>}
                      {index === 1 && <p className="text-xs text-gray-500">We carefully select the best off-the-shelf components to complement our proprietary technology.</p>}
                      {index === 2 && <p className="text-xs text-gray-500">Our network of production partners ensures quality manufacturing at scale.</p>}
                    </div>
                  </HoverCardContent>
                </HoverCard>)}
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-bold mb-4">Our Agile Development Process</h3>
                  <p className="text-gray-600 mb-6">
                    We work in efficient 2-week sprints, ensuring rapid iteration and continuous improvement of your product.
                  </p>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium text-gray-700">Sprint {currentSprint} of {totalSprints}</span>
                      <span className="text-sm text-gray-500">{progressValue}% Complete</span>
                    </div>
                    <Progress value={progressValue} className="h-2 mb-6" />
                    
                    <div className="grid grid-cols-4 gap-2">
                      {sprintPhases.map((phase, index) => (
                        <div 
                          key={phase.name}
                          className={cn(
                            "flex flex-col items-center p-2 rounded-lg transition-all duration-300",
                            progressValue >= (index + 1) * 25 ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {phase.icon}
                          <span className="text-xs mt-1">{phase.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                    <div 
                      className="absolute inset-0 rounded-full border-4 border-gray-700 transition-all duration-300"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(progressValue / 100 * 2 * Math.PI)}% ${50 - 50 * Math.cos(progressValue / 100 * 2 * Math.PI)}%, 50% 50%)`
                      }}
                    ></div>
                    <div className="absolute inset-4 rounded-full bg-white shadow-lg flex items-center justify-center">
                      <div className="text-center">
                        <Rocket className="h-12 w-12 mx-auto text-gray-700 mb-2" />
                        <span className="text-2xl font-bold">{progressValue}%</span>
                        <p className="text-xs text-gray-500">Sprint Progress</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="product-flow" className="bg-white py-10 md:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              Product Flow
            </div>
            <h2 className="text-3xl font-bold mb-4">From Concept to Customer</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our end-to-end process takes your product idea from initial concept through manufacturing to the hands of your customers.
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { icon: <Code className="h-8 w-8" />, title: "Design", description: "Concept & prototyping" },
                { icon: <Microchip className="h-8 w-8" />, title: "Develop", description: "Hardware & software integration" },
                { icon: <Factory className="h-8 w-8" />, title: "Manufacture", description: "Production & quality assurance" },
                { icon: <Truck className="h-8 w-8" />, title: "Deliver", description: "Distribution & support" }
              ].map((step, index) => (
                <div key={step.title} className="flex flex-col items-center">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
                    "bg-white border-4 border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white"
                  )}>
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 text-center">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>;
};

export default Features;