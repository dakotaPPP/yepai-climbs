import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { AccessibilityControls } from "@/components/AccessibilityControls";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { Route } from "@/lib/types";
import { ThumbsUp, ThumbsDown, ArrowLeft, Trash2, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RoutePreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  
  const routeData = location.state?.routeData as Route | undefined;
  const isNewUpload = location.state?.isNewUpload as boolean | undefined;
  
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState<Route | null>(routeData || null);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(
    routeData?.user_feedback || null
  );
  const [highContrast, setHighContrast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    
    // Redirect if no route data
    if (!routeData && !isLoading) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate, routeData, isLoading]);
  
  const handleFeedback = async (newFeedback: "like" | "dislike") => {
    try {
      if (!route) return;
      
      // Toggle feedback if already selected
      const updatedFeedback = feedback === newFeedback ? null : newFeedback;
      
      setFeedback(updatedFeedback);
      
      // Update feedback in the database
      const { error } = await supabase
        .from('routes')
        .update({ user_feedback: updatedFeedback })
        .eq('id', route.id);
      
      if (error) {
        throw error;
      }
      
      // Update local route state
      setRoute({
        ...route,
        user_feedback: updatedFeedback,
      });
      
      toast({
        title: updatedFeedback ? "Feedback saved" : "Feedback removed",
        description: updatedFeedback 
          ? "Thank you for providing your feedback!" 
          : "Your feedback has been removed.",
      });
    } catch (error: any) {
      console.error("Error updating feedback:", error);
      toast({
        title: "Error",
        description: "Failed to save feedback. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async () => {
    try {
      if (!route) return;
      
      setIsLoading(true);
      
      // Delete the route from the database
      const { error: deleteError } = await supabase
        .from('routes')
        .delete()
        .eq('id', route.id);
      
      if (deleteError) {
        throw deleteError;
      }
      
      // If image is stored in Supabase Storage, delete it too
      if (route.image_url && route.image_url.includes('storage/v1')) {
        const path = route.image_url.split('/').pop();
        if (path) {
          const { error: storageError } = await supabase.storage
            .from('route_images')
            .remove([path]);
          
          if (storageError) {
            console.error("Error deleting image:", storageError);
          }
        }
      }
      
      toast({
        title: "Route deleted",
        description: "The route has been successfully deleted.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error deleting route:", error);
      toast({
        title: "Error",
        description: "Failed to delete route. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    // For new routes the data is already saved to the database during upload
    // This function is just for UX flow now
    try {
      setIsSaving(true);
      
      // No need to do anything here as the route is already saved
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Route saved",
        description: "The route has been added to your collection.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving route:", error);
      toast({
        title: "Error",
        description: "Failed to save route. Please try again.",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  };
  
  if (!route) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading route..." />
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navbar highContrast={highContrast} />
      <div className={`min-h-screen pt-24 pb-16 px-6 ${highContrast ? "bg-black text-white" : ""}`}>
        <div className="max-w-5xl mx-auto page-transition">
          <div className="flex items-center mb-8">
            <Button
              variant={highContrast ? "outline" : "ghost"}
              onClick={() => navigate("/dashboard")}
              className={`${highContrast ? "text-black border-white border-2 hover:bg-black hover:text-white" : "text-gray-500"} mr-4`}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-2xl font-bold">
              {isNewUpload ? "Route Analysis" : "Route Details"}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className={`overflow-hidden ${highContrast ? "high-contrast" : "card-gradient"}`}>
                <div className="aspect-video overflow-hidden">
                  <img
                    src={route.image_url || "/placeholder.svg"}
                    alt={route.name || "Climbing route"}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        {route.name || "Untitled Route"}
                      </h2>
                      
                      {route.location && (
                        <p className="text-gray-600">{route.location}</p>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex space-x-3">
                      <div className={`px-4 py-2 rounded-full ${highContrast ? "bg-white text-black border-2 border-black" : "bg-yepai-blue/10 text-yepai-blue font-medium flex items-center"}`}>
                        <span className="text-xs mr-1">Hold Color:</span>
                        <span className="font-semibold">{route.hold_color}</span>
                      </div>
                      
                      <div className={`px-4 py-2 rounded-full ${highContrast ? "bg-white text-black border-2 border-black" : "bg-gradient-to-r from-yepai-blue to-yepai-teal text-white font-medium"}`}>
                        <span className="text-xs mr-1">Grade:</span>
                        <span className="font-semibold">{route.predicted_grade}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex space-x-2 mb-4 md:mb-0">
                      <Button
                        variant={feedback === "like" ? "default" : "outline"}
                        onClick={() => handleFeedback("like")}
                        className={
                          feedback === "like" 
                            ? (highContrast 
                              ? "bg-black text-white border-2 border-black hover:bg-white hover:text-black" 
                              : "bg-yepai-green text-white")
                            : (highContrast
                              ? "bg-white text-black border-2 border-black hover:bg-black hover:text-white"
                              : "text-gray-700 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500")
                        }
                        disabled={isLoading}
                      >
                        <ThumbsUp className="h-5 w-5 mr-2" />
                        Accurate
                      </Button>
                      
                      <Button
                        variant={feedback === "dislike" ? "default" : "outline"}
                        onClick={() => handleFeedback("dislike")}
                        className={
                          feedback === "dislike" 
                            ? (highContrast 
                              ? "bg-white text-black border-2 border-black hover:bg-black hover:text-white" 
                              : "bg-red-500 text-white")
                            : (highContrast
                              ? "text-black border-black bg-white border-2 hover:bg-black hover:text-white"
                              : "text-gray-700 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500")
                        }
                        disabled={isLoading}
                      >
                        <ThumbsDown className="h-5 w-5 mr-2" />
                        Inaccurate
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={handleDelete}
                          className={highContrast 
                            ? "bg-white text-black border-2 border-black hover:bg-black hover:text-white"
                            : "text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                          }
                          disabled={isLoading}
                        >
                          <Trash2 className="h-5 w-5 mr-2" />
                          Delete Route
                        </Button>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">How it works</h3>
                <Card className={`p-6 ${highContrast ? "high-contrast" : "bg-white"}`}>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Our AI model analyzes your climbing route image and predicts the difficulty grade.
                      The prediction is based on:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>The overall geometry of the climbing holds</li>
                      <li>The distance between holds</li>
                      <li>The angle of the wall</li>
                      <li>The types of holds (jugs, crimps, slopers, etc.)</li>
                      <li>The hold color you specified ({route.hold_color})</li>
                    </ul>
                    <p className="text-gray-700">
                      Your feedback helps our model improve over time. Thank you for contributing!
                    </p>
                  </div>
                </Card>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <AccessibilityControls
                  onContrastToggle={setHighContrast}
                />
                
                <Card className={`p-6 ${highContrast ? "high-contrast" : "bg-white"}`}>
                  <h3 className="font-medium mb-4">Route Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{route.name || "Untitled Route"}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Hold Color</p>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: getHoldColorHex(route.hold_color) }}
                        />
                        <p className="font-medium capitalize">{route.hold_color}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Predicted Grade</p>
                      <p className="font-medium">{route.predicted_grade}</p>
                    </div>
                    
                    {route.location && (
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{route.location}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-gray-500">Date Added</p>
                      <p className="font-medium">
                        {new Date(route.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className={`p-6 ${highContrast ? "high-contrast" : "bg-yepai-gray"}`}>
                  <h3 className="font-medium mb-4">Similar Routes</h3>
                  <p className="text-sm text-gray-600">
                    This feature is coming soon! We'll suggest similar routes based on your uploads.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function for hold colors
function getHoldColorHex(color: string): string {
  const colorMap: Record<string, string> = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    orange: "#f97316",
    purple: "#a855f7",
    pink: "#ec4899",
    black: "#171717",
    white: "#f5f5f5",
    brown: "#78532c",
  };
  
  return colorMap[color.toLowerCase()] || "#9ca3af";
}

export default RoutePreview;
