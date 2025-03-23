import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Contrast } from "lucide-react";
import { useHighContrast } from "@/hooks/useHighContrast";

interface AccessibilityControlsProps {
  onContrastToggle: (highContrast: boolean) => void;
}

export const AccessibilityControls = ({
  onContrastToggle,
}: AccessibilityControlsProps) => {
  // Use our custom hook which handles cookie persistence
  const { highContrast, toggleHighContrast } = useHighContrast();

  // Sync parent component with our high contrast state
  useEffect(() => {
    onContrastToggle(highContrast);
  }, [highContrast, onContrastToggle]);

  return (
    <div className="flex flex-col space-y-4 p-4 glass-card rounded-lg animate-fadeIn">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Accessibility Options</h3>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">High Contrast</span>
        <Button
          variant={highContrast ? "default" : "outline"}
          size="sm"
          onClick={toggleHighContrast}
          className="text-xs py-1 h-8"
        >
          <Contrast className="h-3 w-3 mr-1" />
          {highContrast ? "On" : "Off"}
        </Button>
      </div>
    </div>
  );
};
