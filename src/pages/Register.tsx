import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [highContrast, setHighContrast] = useState(false);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await register(email, password, name);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };
  
  return (
    <>
      <Navbar highContrast={highContrast} />
      <div className="min-h-screen flex items-center justify-center px-6 pt-20 pb-10 page-transition">
        <div className="absolute inset-0 bg-gradient-to-br from-yepai-blue/5 to-yepai-teal/5 -z-10" />
        
        <Card className="max-w-md w-full p-8 shadow-lg neo-morphism animate-fadeIn">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
            <p className="text-gray-600">Join Yepai and start analyzing your climbing routes</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name (optional)
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input-field"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>
            
            <div className="pt-2">
              <Button
                type="submit"
                className={highContrast 
                  ? "w-full bg-white text-black border-2 border-black hover:bg-gray-200"
                  : "w-full button-primary"
                }
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : "Create Account"}
              </Button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={() => navigate("/login")}
                className={highContrast 
                  ? "text-white hover:text-gray-200 p-0" 
                  : "text-yepai-blue hover:underline p-0"
                }
              >
                Log in
              </Button>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Register;
