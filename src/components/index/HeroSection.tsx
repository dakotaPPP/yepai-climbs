import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface HeroSectionProps {
  highContrast: boolean;
  scrollToFeatures: () => void;
}

export const HeroSection = ({ highContrast, scrollToFeatures }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Animation states
  const [showAI, setShowAI] = useState(false);
  const [showRouteGrading, setShowRouteGrading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Sequence the animations with timeouts
    const aiTimer = setTimeout(() => setShowAI(true), 500);
    const routeTimer = setTimeout(() => setShowRouteGrading(true), 1200);
    const contentTimer = setTimeout(() => setShowContent(true), 1900);
    const imageTimer = setTimeout(() => setShowImage(true), 2600);
    
    // Clean up timers
    return () => {
      clearTimeout(aiTimer);
      clearTimeout(routeTimer);
      clearTimeout(contentTimer);
      clearTimeout(imageTimer);
    };
  }, []);

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Decorative climbing wall image */}
      <div className="absolute top-0 left-0 h-60px opacity-80 transform -translate-x-1/2 -translate-y-1/4">
        <img 
          src="/climbing-wall.png" 
          alt="" 
          className="w-full h-auto object-contain" 
          aria-hidden="true"
        />
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div 
          className={`flex flex-col lg:flex-row items-center justify-between gap-16 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left z-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900">
              <span className={`bg-clip-text text-transparent bg-gradient-to-r from-yepai-blue to-yepai-teal transition-opacity duration-1000 ${showAI ? 'opacity-100' : 'opacity-0'}`}>
                AI-Powered
              </span>{" "}
              <span className={`transition-opacity duration-1000 ${showRouteGrading ? 'opacity-100' : 'opacity-0'}`}>
                Route Grading
              </span>
            </h1>
            
            <p className={`text-xl text-gray-600 max-w-xl leading-relaxed transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
              Upload images of climbing routes and get instant difficulty predictions. Perfect for climbers of all levels.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
              {user ? (
                <Button 
                  onClick={() => navigate("/dashboard")} 
                  className={highContrast ? "rounded-full bg-white text-black hover:bg-gray-200 border-2 border-black" : "rounded-full bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg"}
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate("/register")} 
                    className={highContrast ? "rounded-full bg-white text-black hover:bg-gray-200 border-2 border-black px-8 py-6 text-lg" : "rounded-full bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg"}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/login")}
                    className={highContrast ? "rounded-full border-2 border-white bg-transparent text-white hover:bg-white hover:text-black px-8 py-6 text-lg" : "rounded-full border-2 border-gray-300 hover:border-gray-400 bg-transparent text-gray-800 px-8 py-6 text-lg"}
                  >
                    Log In
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className={`lg:w-1/2 relative transition-all duration-1000 transform ${showImage ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <a 
              href="https://youtu.be/Z7C-xXhnCwE?si=mAtc2E1r8jLFCPhH" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-float">
                <div className="absolute inset-0 bg-gradient-to-tr from-yepai-blue/10 to-transparent z-10"/>
                  <img 
                    src="/demo-image.png" 
                    alt="Climbing route preview" 
                    className="w-full h-auto object-cover"
                  />
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-5 rounded-xl shadow-lg flex items-center gap-3 z-20">
                  <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center">
                    <Play className="h-5 w-5 text-white ml-1" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">See how it works</p>
                    <p className="text-base font-bold">Watch the demo</p>
                  </div>
                </div>
              </div>
            </a>
            
            <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
              <span className="text-sm font-medium text-gray-500">Predicted Grade</span>
              <h3 className="text-2xl font-bold">V1</h3>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-black"></div>
                <span className="font-medium">Black Holds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce">
        <Button 
          variant="ghost" 
          onClick={scrollToFeatures}
          className="rounded-full h-12 w-12 flex items-center justify-center"
        >
          <ChevronDown className="h-6 w-6 text-gray-400" />
        </Button>
      </div>

      {/* Trusted by brands section */}
      <div className="max-w-6xl mx-auto mt-24">
        <p className="text-center text-gray-500 text-sm font-medium mb-8">
          TRUSTED BY CLIMBING GYMS WORLDWIDE
        </p>
        <div className="infinite-carousel-container">
          <div className="infinite-carousel-track opacity-60">
            {/* First set of logos */}
            <div className="flex items-center gap-20 px-10">
              <div className="h-12 w-auto rounded flex-shrink-0">
                <img src="/stoneco-logo.png" alt="Stone Co" className="h-full object-contain" />
              </div>
              <div className="h-12 w-auto rounded flex-shrink-0">
                <img src="/momentum-logo.png" alt="Momentum" className="h-full object-contain" />
              </div>
              <div className="h-12 w-auto rounded flex-shrink-0">
                <img src="/bouldering-project-logo.svg" alt="Bouldering Project" className="h-full object-contain" />
              </div>
              <div className="h-12 w-auto rounded flex-shrink-0">
                <img src="/stoneco-logo.png" alt="Stone Co" className="h-full object-contain" />
              </div>
              <div className="h-12 w-auto rounded flex-shrink-0">
                <img src="/momentum-logo.png" alt="Momentum" className="h-full object-contain" />
              </div>
            </div>
            
            {/* Duplicate set of logos for seamless looping */}
            <div className="flex items-center gap-20 px-10">
              <div className="h-12 w-auto rounded flex-shrink-0">
                <img src="/stoneco-logo.png" alt="Stone Co" className="h-full object-contain" />
              </div>
              <div className="h-12 w-auto rounded flex-shrink-0">
                <img src="/momentum-logo.png" alt="Momentum" className="h-full object-contain" />
              </div>
              <div className="h-12 w-auto rounded flex-shrink-0">
                <img src="/bouldering-project-logo.svg" alt="Bouldering Project" className="h-full object-contain" />
              </div>
              <div className="h-12 w-auto rounded flex-shrink-0">
                <img src="/stoneco-logo.png" alt="Stone Co" className="h-full object-contain" />
              </div>
              <div className="h-12 w-auto rounded flex-shrink-0">
                <img src="/momentum-logo.png" alt="Momentum" className="h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 