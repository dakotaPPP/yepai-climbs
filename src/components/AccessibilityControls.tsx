import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Contrast } from "lucide-react";

interface AccessibilityControlsProps {
  onContrastToggle: (highContrast: boolean) => void;
}

export const AccessibilityControls = ({
  onContrastToggle,
}: AccessibilityControlsProps) => {
  const [highContrast, setHighContrast] = useState(false);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    onContrastToggle(newValue);
  };

  return (
    <div className={`flex flex-col space-y-4 p-4 rounded-lg animate-fadeIn ${
      highContrast ? "bg-black text-white border border-white" : "glass-card"
    }`}>
      <h3 className={`text-sm font-medium mb-2 ${
        highContrast ? "text-white" : "text-gray-700"
      }`}>Accessibility Options</h3>
      
      <div className="flex items-center justify-between">
        <span className={`text-sm ${
          highContrast ? "text-white" : "text-gray-600"
        }`}>High Contrast</span>
        <Button
          variant={highContrast ? "outline" : "outline"}
          size="sm"
          onClick={toggleHighContrast}
          className={`text-xs py-1 h-8 ${
            highContrast ? "bg-white text-black hover:bg-gray-200 border-black border-2" : ""
          }`}
        >
          <Contrast className="h-3 w-3 mr-1" />
          {highContrast ? "On" : "Off"}
        </Button>
      </div>
    </div>
  );
};
