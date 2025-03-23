import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { RouteCard } from "@/components/RouteCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AccessibilityControls } from "@/components/AccessibilityControls";
import { useAuth } from "@/hooks/useAuth";
import { Route, HoldColor } from "@/lib/types";
import { Plus, Search, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [highContrast, setHighContrast] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    sortBy: "latest" as "latest" | "oldest",
    holdColor: "" as HoldColor | "",
    gradeRange: "all" as "all" | "beginner" | "intermediate" | "advanced"
  });

  const holdColors: { value: HoldColor; label: string; color: string }[] = [
    { value: "red", label: "Red", color: "#ef4444" },
    { value: "blue", label: "Blue", color: "#3b82f6" },
    { value: "green", label: "Green", color: "#22c55e" },
    { value: "yellow", label: "Yellow", color: "#eab308" },
    { value: "orange", label: "Orange", color: "#f97316" },
    { value: "purple", label: "Purple", color: "#a855f7" },
    { value: "pink", label: "Pink", color: "#ec4899" },
    { value: "black", label: "Black", color: "#171717" },
    { value: "white", label: "White", color: "#f5f5f5" },
    { value: "gray", label: "Gray", color: "#808080" },
  ];
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    
    const fetchRoutes = async () => {
      try {
        setIsLoading(true);
        
        if (!user) return;
        
        const { data, error } = await supabase
          .from('routes')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setRoutes(data as Route[]);
      } catch (error: any) {
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
      // First fetch the route to get the image URL
      const { data: routeData, error: fetchError } = await supabase
        .from('routes')
        .select('image_url')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Delete the route from the database
      const { error: deleteError } = await supabase
        .from('routes')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        throw deleteError;
      }
      
      // If image is stored in Supabase Storage, delete it too
      if (routeData.image_url && routeData.image_url.includes('storage/v1')) {
        const path = routeData.image_url.split('/').pop();
        if (path) {
          const { error: storageError } = await supabase.storage
            .from('route_images')
            .remove([path]);
          
          if (storageError) {
            console.error("Error deleting image:", storageError);
          }
        }
      }
      
      // Update state to remove the deleted route
      setRoutes(routes.filter(route => route.id !== id));
      
      toast({
        title: "Route deleted",
        description: "The route has been successfully removed.",
      });
    } catch (error: any) {
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
      // Find the route and toggle feedback if it's the same
      const route = routes.find(r => r.id === id);
      const updatedFeedback = route?.user_feedback === feedback ? null : feedback;
      
      // Update database
      const { error } = await supabase
        .from('routes')
        .update({ user_feedback: updatedFeedback })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update state with the new feedback
      setRoutes(
        routes.map(route => {
          if (route.id === id) {
            return {
              ...route,
              user_feedback: updatedFeedback,
            };
          }
          return route;
        })
      );
    } catch (error: any) {
      console.error("Error updating feedback:", error);
      toast({
        title: "Error",
        description: "Failed to update feedback. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Filter routes based on search query and active filters
  const filteredRoutes = routes.filter(route => {
    const routeName = route.name || "Untitled Route";
    const routeLocation = route.location || "";
    const matchesSearch = (
      routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      routeLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.predicted_grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.hold_color.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesColor = !activeFilters.holdColor || route.hold_color === activeFilters.holdColor;

    const gradeValue = parseInt(route.predicted_grade.replace(/\D/g, ''));
    let matchesGrade = true;
    if (activeFilters.gradeRange === "beginner") {
      matchesGrade = gradeValue <= 3;
    } else if (activeFilters.gradeRange === "intermediate") {
      matchesGrade = gradeValue > 3 && gradeValue <= 6;
    } else if (activeFilters.gradeRange === "advanced") {
      matchesGrade = gradeValue > 6;
    }

    return matchesSearch && matchesColor && matchesGrade;
  }).sort((a, b) => {
    if (activeFilters.sortBy === "latest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
  });

  const handleFilterChange = (type: keyof typeof activeFilters, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  return (
    <>
      <Navbar highContrast={highContrast} />
      <div className={`min-h-screen pt-24 pb-16 px-6 ${highContrast ? "bg-black text-white" : ""}`}>
        <div className="max-w-6xl mx-auto page-transition">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Routes</h1>
              <p className={`${highContrast ? "text-white" : "text-gray-600"}`}>
                Manage and review your climbing routes
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button 
                onClick={() => navigate("/upload")}
                className={highContrast ? "bg-white text-black hover:bg-gray-200 border border-black space-x-2" : "button-primary flex items-center space-x-2"}
              >
                <Plus className="h-5 w-5 mr-2" />
                <span>Upload New Route</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-3">
              <div className="relative mb-6">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${highContrast ? "text-white" : "text-gray-400"} h-5 w-5`} />
                <Input
                  placeholder="Search routes by name, location, grade..."
                  className={`pl-10 ${highContrast ? "bg-black text-white border-white focus:ring-white" : "input-field"} py-6`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-full ${
                        highContrast
                          ? "border-2 border-white text-black hover:bg-white hover:text-black"
                          : "border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      {activeFilters.gradeRange === "all" ? "All Grades" : 
                       activeFilters.gradeRange === "beginner" ? "Beginner (V0-V3)" :
                       activeFilters.gradeRange === "intermediate" ? "Intermediate (V4-V6)" : "Advanced (V7+)"}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleFilterChange("gradeRange", "all")}>
                      All Grades
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterChange("gradeRange", "beginner")}>
                      Beginner (V0-V3)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterChange("gradeRange", "intermediate")}>
                      Intermediate (V4-V6)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFilterChange("gradeRange", "advanced")}>
                      Advanced (V7+)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-full ${
                        highContrast
                          ? "border-2 border-white text-black hover:bg-white hover:text-black"
                          : "border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {!highContrast && activeFilters.holdColor ? (
                        <div 
                          className={`h-3 w-3 rounded-full mr-2 ${activeFilters.holdColor === "white" ? "border border-black" : ""}`}
                          style={{ 
                            backgroundColor: holdColors.find(c => c.value === activeFilters.holdColor)?.color 
                          }} 
                        />
                      ) : null}
                      {activeFilters.holdColor ? 
                        holdColors.find(c => c.value === activeFilters.holdColor)?.label : 
                        "Hold Color"}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleFilterChange("holdColor", "")}>
                      All Colors
                    </DropdownMenuItem>
                    {holdColors.map((color) => (
                      <DropdownMenuItem 
                        key={color.value}
                        onClick={() => handleFilterChange("holdColor", color.value)}
                      >
                        {!highContrast && (
                          <div 
                            className={`h-3 w-3 rounded-full mr-2 ${color.value === "white" ? "border border-black" : ""}`}
                            style={{ backgroundColor: color.color }} 
                          />
                        )}
                        {color.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full ${
                    highContrast
                      ? "border-2 border-white text-gray-500 hover:bg-white hover:text-black"
                      : "border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  } ${activeFilters.sortBy === "latest" ? (highContrast ? "bg-white text-black" : "bg-gray-100") : ""}`}
                  onClick={() => handleFilterChange("sortBy", "latest")}
                >
                  Latest
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full ${
                    highContrast
                      ? "border-2 border-white text-gray-500 hover:bg-white hover:text-black"
                      : "border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  } ${activeFilters.sortBy === "oldest" ? (highContrast ? "bg-white text-black" : "bg-gray-100") : ""}`}
                  onClick={() => handleFilterChange("sortBy", "oldest")}
                >
                  Oldest
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <AccessibilityControls onContrastToggle={setHighContrast} />
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
                  <p className={`${highContrast ? "text-white" : "text-gray-600"} mb-6`}>
                    No routes match your search criteria. Try a different search term.
                  </p>
                ) : (
                  <p className={`${highContrast ? "text-black" : "text-gray-600"} mb-6`}>
                    You haven't uploaded any climbing routes yet. Upload your first route to get started.
                  </p>
                )}
                <Button 
                  onClick={() => navigate("/upload")}
                  className={highContrast ? "bg-white text-black hover:bg-gray-200 border border-black" : "button-primary"}
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
