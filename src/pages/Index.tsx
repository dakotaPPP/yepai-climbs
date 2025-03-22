
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, ChevronDown } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

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
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yepai-blue/5 to-yepai-teal/5 -z-10" />
        
        <div 
          className={`max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-yepai-blue">AI-Powered</span> Climbing Route Grading
            </h1>
            
            <p className="text-lg text-gray-600 md:text-xl max-w-2xl">
              Upload images of climbing routes and get instant difficulty predictions. Track your progress and manage your climbing journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Button 
                onClick={() => navigate("/register")} 
                className="button-primary text-lg py-6"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate("/login")}
                className="button-secondary text-lg py-6"
              >
                Log In
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl animate-float">
              <div className="absolute inset-0 bg-gradient-to-tr from-yepai-blue/20 to-transparent z-10" />
              <img 
                src="/placeholder.svg" 
                alt="Climbing route preview" 
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div className="absolute -top-4 -right-4 bg-white p-3 rounded-lg shadow-lg animate-slideIn" style={{ animationDelay: "0.3s" }}>
              <span className="text-sm font-medium text-yepai-blue">Predicted</span>
              <h3 className="text-2xl font-bold">V7</h3>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-lg shadow-lg animate-slideIn" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yepai-coral"></div>
                <span className="font-medium">Red Holds</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer animate-pulse">
          <Button 
            variant="ghost" 
            onClick={scrollToFeatures}
            className="rounded-full"
          >
            <ChevronDown className="h-8 w-8 text-gray-400" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-slideUp">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Features designed for <span className="text-yepai-blue">climbers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to analyze, track, and improve your climbing experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg animate-slideUp"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yepai-blue/10 mb-4">
                  <feature.icon className="h-6 w-6 text-yepai-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-yepai-blue to-yepai-teal text-white">
        <div className="max-w-4xl mx-auto text-center animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to elevate your climbing experience?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join Yepai today and start getting AI-powered insights on your climbing routes.
          </p>
          <Button 
            onClick={() => navigate("/register")}
            className="bg-white text-yepai-blue hover:bg-gray-100 text-lg py-6 px-8"
          >
            Create Your Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-2xl font-semibold mb-6">
            <span className="text-yepai-blue">Yep</span>
            <span className="text-yepai-coral">ai</span>
          </div>
          <p className="text-gray-500 mb-8">
            AI-powered climbing route analysis
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <a href="#" className="hover:text-yepai-blue transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-yepai-blue transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-yepai-blue transition-colors">Contact</a>
          </div>
          <p className="mt-8 text-xs text-gray-400">
            © {new Date().getFullYear()} Yepai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Feature data
import { Upload, BarChart, Map, UserPlus, Zap, Eye } from "lucide-react";

const features = [
  {
    title: "AI Grading",
    description: "Upload images of your climbing routes and get instant AI-powered difficulty predictions.",
    icon: Zap,
  },
  {
    title: "Route Uploads",
    description: "Easily upload photos of climbing routes with details like hold color and location.",
    icon: Upload,
  },
  {
    title: "Accessibility Features",
    description: "Color blindness filters and high contrast mode for improved visibility.",
    icon: Eye,
  },
  {
    title: "Route Management",
    description: "Organize your climbing routes, provide feedback, and track your progress.",
    icon: BarChart,
  },
  {
    title: "Location Tracking",
    description: "Add location details to your routes to remember where you've climbed.",
    icon: Map,
  },
  {
    title: "User Accounts",
    description: "Create an account to save your routes and access your climbing history anytime.",
    icon: UserPlus,
  },
];

export default Index;
