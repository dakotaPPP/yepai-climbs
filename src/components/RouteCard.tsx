import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Route } from "@/lib/types";
import { ThumbsUp, ThumbsDown, Trash2, MapPin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface RouteCardProps {
  route: Route;
  highContrast?: boolean;
  onDelete?: (id: string) => void;
  onFeedback?: (id: string, feedback: "like" | "dislike") => void;
}

export const RouteCard = ({
  route,
  highContrast = false,
  onDelete,
  onFeedback,
}: RouteCardProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(
    route.user_feedback as "like" | "dislike" | null
  );

  const formattedDate = new Date(route.created_at).toLocaleDateString();

  const handleFeedback = async (newFeedback: "like" | "dislike", e: React.MouseEvent) => {
    // Stop propagation to prevent card click when feedback buttons are clicked
    e.stopPropagation();
    
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Toggle feedback if already selected
      const updatedFeedback = feedback === newFeedback ? null : newFeedback;
      setFeedback(updatedFeedback);
      
      if (onFeedback) {
        await onFeedback(route.id, newFeedback);
      }
      
      toast({
        title: updatedFeedback ? "Feedback saved" : "Feedback removed",
        description: updatedFeedback 
          ? "Thank you for providing your feedback!" 
          : "Your feedback has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    // Stop propagation to prevent card click when delete button is clicked
    e.stopPropagation();
    
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      if (onDelete) {
        await onDelete(route.id);
      }
      
      toast({
        title: "Route deleted",
        description: "The route has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete route. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    // Navigate to the route preview page with the route data
    navigate("/route-preview", {
      state: {
        routeData: route,
        isNewUpload: false,
      },
    });
  };

  return (
    <Card 
      className={`overflow-hidden rounded-xl clickable-card ${
        highContrast ? "high-contrast" : "bg-white border border-gray-200"
      }`}
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={route.image_url || "/placeholder.svg"}
            alt={route.name || "Climbing route"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        {/* Corner Ribbon for Grade and Hold Color */}
        <div className="corner-ribbon">
          <div
            className={`corner-ribbon-inner ${highContrast ? "bg-white text-black" : ""}`}
            style={{ 
              backgroundColor: highContrast ? undefined : getHoldColorBg(route.hold_color),
              color: highContrast ? undefined : getHoldColorText(route.hold_color)
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs opacity-90 font-medium">{route.hold_color}</span>
              <span className="text-sm font-bold">{route.predicted_grade}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 truncate">
          {route.name || "Untitled Route"}
        </h3>
        
        {route.location && (
          <p className={`text-sm ${highContrast ? "text-white" : "text-gray-500"} mb-3 flex items-center`}>
            <MapPin className="h-3 w-3 mr-1" />
            {route.location}
          </p>
        )}
        
        <p className={`text-xs ${highContrast ? "text-white" : "text-gray-400"} mb-4`}>{formattedDate}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant={highContrast ? "outline" : "ghost"}
              size="sm"
              disabled={isLoading}
              onClick={(e) => handleFeedback("like", e)}
              className={`text-sm rounded-full ${
                highContrast
                  ? "text-white border-white border-2 hover:bg-white hover:text-black"
                  : feedback === "like" 
                    ? "text-green-600 bg-green-50" 
                    : "text-gray-500 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
            </Button>
            
            <Button
              variant={highContrast ? "outline" : "ghost"}
              size="sm"
              disabled={isLoading}
              onClick={(e) => handleFeedback("dislike", e)}
              className={`text-sm rounded-full ${
                highContrast
                  ? "text-white border-white border-2 hover:bg-white hover:text-black"
                  : feedback === "dislike" 
                    ? "text-red-600 bg-red-50" 
                    : "text-gray-500 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
            </Button>
          </div>
          
          {onDelete && (
            <Button
              variant={highContrast ? "outline" : "ghost"}
              size="sm"
              disabled={isLoading}
              onClick={(e) => handleDelete(e)}
              className={`text-sm rounded-full ${
                highContrast
                  ? "text-white border-white border-2 hover:bg-white hover:text-black"
                  : "text-gray-400 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// Helper functions for hold colors
function getHoldColorBg(color: string): string {
  const colorMap: Record<string, string> = {
    red: "rgba(239, 68, 68, 0.9)",
    blue: "rgba(59, 130, 246, 0.9)",
    green: "rgba(34, 197, 94, 0.9)",
    yellow: "rgba(234, 179, 8, 0.9)",
    orange: "rgba(249, 115, 22, 0.9)",
    purple: "rgba(168, 85, 247, 0.9)",
    pink: "rgba(236, 72, 153, 0.9)",
    black: "rgba(23, 23, 23, 0.9)",
    white: "rgba(245, 245, 245, 0.9)",
    brown: "rgba(120, 83, 44, 0.9)",
  };
  
  return colorMap[color.toLowerCase()] || "rgba(156, 163, 175, 0.9)";
}

function getHoldColorText(color: string): string {
  const darkColors = ["black", "blue", "purple", "brown"];
  return darkColors.includes(color.toLowerCase()) ? "#ffffff" : "#000000";
}
