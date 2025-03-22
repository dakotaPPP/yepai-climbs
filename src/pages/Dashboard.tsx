
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { RouteCard } from "@/components/RouteCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AccessibilityControls } from "@/components/AccessibilityControls";
import { useAuth } from "@/hooks/useAuth";
import { Route, ColorBlindnessFilter } from "@/lib/types";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [colorFilter, setColorFilter] = useState<ColorBlindnessFilter>("none");
  const [highContrast, setHighContrast] = useState(false);
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    
    // Mock data fetch - in a real app this would call an API
    const fetchRoutes = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock routes data
        const mockRoutes: Route[] = [
          {
            id: "1",
            name: "Crimpy Problem",
            image_url: "/placeholder.svg",
            hold_color: "red",
            location: "Boulder Gym East",
            predicted_grade: "V5",
            user_feedback: "like",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Slopey Challenge",
            image_url: "/placeholder.svg",
            hold_color: "blue",
            location: "Climbing Center",
            predicted_grade: "V7",
            user_feedback: null,
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "3",
            name: null,
            image_url: "/placeholder.svg",
            hold_color: "green",
            location: null,
            predicted_grade: "V4",
            user_feedback: "dislike",
            created_at: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: "4",
            name: "Overhang Crusher",
            image_url: "/placeholder.svg",
            hold_color: "yellow",
            location: "Boulder Zone",
            predicted_grade: "V6",
            user_feedback: null,
            created_at: new Date(Date.now() - 259200000).toISOString(),
          },
        ];
        
        setRoutes(mockRoutes);
      } catch (error) {
        console.error("Error fetching routes:", error);
        toast({
          title: "Error",
          description: "Failed to load routes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchRoutes();
    }
  }, [user, authLoading, navigate]);
  
  const handleDeleteRoute = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state to remove the deleted route
      setRoutes(routes.filter(route => route.id !== id));
      
      toast({
        title: "Route deleted",
        description: "The route has been successfully removed.",
      });
    } catch (error) {
      console.error("Error deleting route:", error);
      toast({
        title: "Error",
        description: "Failed to delete route. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleFeedback = async (id: string, feedback: "like" | "dislike") => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state with the new feedback
      setRoutes(
        routes.map(route => {
          if (route.id === id) {
            return {
              ...route,
              user_feedback: route.user_feedback === feedback ? null : feedback,
            };
          }
          return route;
        })
      );
    } catch (error) {
      console.error("Error updating feedback:", error);
      toast({
        title: "Error",
        description: "Failed to update feedback. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Filter routes based on search query
  const filteredRoutes = routes.filter(route => {
    const routeName = route.name || "Untitled Route";
    const routeLocation = route.location || "";
    
    return (
      routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      routeLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.predicted_grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.hold_color.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  return (
    <>
      <Navbar />
      <div className={`min-h-screen pt-24 pb-16 px-6 ${highContrast ? "bg-black text-white" : ""}`}>
        <div className="max-w-6xl mx-auto page-transition">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Routes</h1>
              <p className="text-gray-600">
                Manage and review your climbing routes
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button 
                onClick={() => navigate("/upload")}
                className="button-primary flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Upload New Route</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-3">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search routes by name, location, grade..."
                  className="pl-10 input-field py-6"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <AccessibilityControls
                onFilterChange={setColorFilter}
                onContrastToggle={setHighContrast}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" text="Loading your routes..." />
            </div>
          ) : filteredRoutes.length === 0 ? (
            <Card className={`p-10 text-center ${highContrast ? "high-contrast" : "card-gradient"}`}>
              <div className="max-w-sm mx-auto">
                <h3 className="text-xl font-medium mb-2">No routes found</h3>
                {searchQuery ? (
                  <p className="text-gray-600 mb-6">
                    No routes match your search criteria. Try a different search term.
                  </p>
                ) : (
                  <p className="text-gray-600 mb-6">
                    You haven't uploaded any climbing routes yet. Upload your first route to get started.
                  </p>
                )}
                <Button 
                  onClick={() => navigate("/upload")}
                  className="button-primary"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Upload Your First Route
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  colorFilter={colorFilter}
                  highContrast={highContrast}
                  onDelete={handleDeleteRoute}
                  onFeedback={handleFeedback}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
