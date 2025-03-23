import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { 
  ArrowRight, 
  ChevronDown, 
  Upload, 
  BarChart, 
  Map, 
  UserPlus, 
  Zap, 
  Eye,
  Check,
  Play
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar highContrast={highContrast} />

      {/* Hero Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
        {/* Decorative climbing wall image */}
        <div className="absolute top-0 left-0 w-60 md:w-80 lg:w-96 h-auto z-0 opacity-80 transform -translate-x-1/4 -translate-y-1/4 rotate-12">
          <img 
            src="/climbing-wall.png" 
            alt="" 
            className="w-full h-auto object-contain" 
            aria-hidden="true"
          />
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div 
            className={`flex flex-col lg:flex-row items-center justify-between gap-16 transition-opacity duration-1000 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900">
                AI-Powered Route <span className="bg-clip-text text-transparent bg-gradient-to-r from-yepai-blue to-yepai-teal">Grading</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                Upload images of climbing routes and get instant difficulty predictions. Perfect for climbers of all levels.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
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
            
            <div className="lg:w-1/2 relative">
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
              
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                <span className="text-sm font-medium text-gray-500">Predicted Grade</span>
                <h3 className="text-2xl font-bold">V7</h3>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium">Blue Holds</span>
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

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fadeIn">
            <span className="text-sm font-semibold text-yepai-blue uppercase tracking-wider">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6 tracking-tight">
              Made for <span className="text-yepai-blue">Climbers</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to analyze, track, and improve your climbing experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-8 rounded-2xl transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-gray-200 bg-white"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-100 mb-6">
                  <feature.icon className="h-7 w-7 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-yepai-blue uppercase tracking-wider">Process</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6 tracking-tight">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your climbing routes graded in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mt-4 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-yepai-blue uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6 tracking-tight">
              What climbers are saying
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="p-8 rounded-2xl bg-gray-50 border border-gray-100"
              >
                <div className="flex items-center space-x-1 text-yepai-blue mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">{testimonial.comment}</p>
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-300 mr-3">
                      <img src={testimonial.image} alt="Profile" className="h-full w-full object-cover rounded-full" />
                    </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to elevate your climbing?
          </h2>
          {user ? (
            <>
              <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                Upload new routes to get AI-powered insights on their difficulty.
              </p>
              <Button 
                onClick={() => navigate("/upload")}
                className={highContrast ? "rounded-full bg-white text-black hover:bg-gray-200 border-2 border-black text-lg py-7 px-10" : "rounded-full bg-white text-black hover:bg-gray-100 text-lg py-7 px-10"}
              >
                Upload a Route
                <Upload className="ml-2 h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                Join YepAI today and start getting AI-powered insights on your climbing routes.
              </p>
              <Button 
                onClick={() => navigate("/register")}
                className={highContrast ? "rounded-full bg-white text-black hover:bg-gray-200 border-2 border-black text-lg py-7 px-10" : "rounded-full bg-white text-black hover:bg-gray-100 text-lg py-7 px-10"}
              >
                Create Your Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="mt-6 text-sm text-gray-400">No credit card required</p>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Feature data
const features = [
  {
    title: "AI Grading",
    description: "Upload images of your climbing routes and get instant AI-powered difficulty predictions.",
    icon: Zap,
  },
  {
    title: "Route Management",
    description: "Organize your climbing routes, provide feedback, and track your progress over time.",
    icon: BarChart,
  },
  {
    title: "Accessibility Features",
    description: "Color blindness filters and high contrast mode for improved visibility.",
    icon: Eye,
  },
  {
    title: "Simple Uploads",
    description: "Easily upload photos of climbing routes with details like hold color and location.",
    icon: Upload,
  },
  {
    title: "Location Tracking",
    description: "Add location details to your routes to remember where you've climbed.",
    icon: Map,
  },
  {
    title: "Personal Account",
    description: "Create an account to save your routes and access your climbing history anytime.",
    icon: UserPlus,
  },
];

// Steps data
const steps = [
  {
    title: "Upload your route",
    description: "Take a photo of the climbing route and upload it to the app with basic details.",
  },
  {
    title: "AI analyzes the route",
    description: "Our AI model processes the image and calculates the difficulty based on hold patterns.",
  },
  {
    title: "Get your grade",
    description: "Receive an accurate difficulty prediction within seconds and save it to your profile.",
  },
];

// Testimonials data
const testimonials = [
  {
    comment: "Yepai has completely changed how I approach new routes. The AI grading is surprisingly accurate!",
    name: "Ryan Velasco",
    role: "Competitive Climber",
    image: "/ryan.jpg",
  },
  {
    comment: "As a route setter, this tool helps me standardize our route difficulties across locations.",
    name: "Henrik Christensen",
    role: "Route Setter",
    image: "/henry.jpg",
  },
  {
    comment: "The app is intuitive and the predictions have been spot on. Great for tracking my progress.",
    name: "Gabe Luce",
    role: "Recreational Climber",
    image: "/gabe.jpg",
  },
];

export default Index;
