import { ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface CTASectionProps {
  highContrast: boolean;
}

export const CTASection = ({ highContrast }: CTASectionProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
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
  );
}; 