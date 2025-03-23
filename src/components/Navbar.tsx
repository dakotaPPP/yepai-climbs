import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="cursor-pointer bg-gradient-to-r from-yepai-blue via-purple-500 to-yepai-coral rounded-lg px-4 py-2"
          onClick={() => navigate("/")}
        >
          <span className="text-2xl font-semibold font-parkinsans tracking-tighter text-white" style={{ letterSpacing: "-0.05em" }}>
            YepAI
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button 
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="text-gray-700 hover:text-yepai-blue transition-colors"
              >
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-gray-700 hover:text-yepai-coral transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-yepai-blue transition-colors"
              >
                Log in
              </Button>
              <Button 
                onClick={() => navigate("/register")}
                className="button-primary"
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
