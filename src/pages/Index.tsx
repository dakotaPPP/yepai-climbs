import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  TestimonialsSection,
  CTASection
} from "@/components/index";

const Index = () => {
  const [highContrast, setHighContrast] = useState(false);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar highContrast={highContrast} />
      <HeroSection highContrast={highContrast} scrollToFeatures={scrollToFeatures} />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection highContrast={highContrast} />
      <Footer />
    </div>
  );
};

export default Index;
