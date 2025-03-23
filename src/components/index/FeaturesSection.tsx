import { BarChart, Eye, Map, Upload, UserPlus, Zap } from "lucide-react";

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

export const FeaturesSection = () => {
  return (
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
  );
}; 