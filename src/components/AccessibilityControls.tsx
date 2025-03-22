
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ColorBlindnessFilter } from "@/lib/types";
import { Eye, EyeOff, Contrast } from "lucide-react";

interface AccessibilityControlsProps {
  onFilterChange: (filter: ColorBlindnessFilter) => void;
  onContrastToggle: (highContrast: boolean) => void;
}

export const AccessibilityControls = ({
  onFilterChange,
  onContrastToggle,
}: AccessibilityControlsProps) => {
  const [currentFilter, setCurrentFilter] = useState<ColorBlindnessFilter>("none");
  const [highContrast, setHighContrast] = useState(false);

  const filters: { value: ColorBlindnessFilter; label: string }[] = [
    { value: "none", label: "Normal Vision" },
    { value: "protanopia", label: "Protanopia" },
    { value: "deuteranopia", label: "Deuteranopia" },
    { value: "tritanopia", label: "Tritanopia" },
  ];

  const handleFilterChange = (filter: ColorBlindnessFilter) => {
    setCurrentFilter(filter);
    onFilterChange(filter);
  };

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    onContrastToggle(!highContrast);
  };

  return (
    <div className="flex flex-col space-y-4 p-4 glass-card rounded-lg animate-fadeIn">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Accessibility Options</h3>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Color Vision</span>
        <div className="flex space-x-2">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={currentFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange(filter.value)}
              className="text-xs py-1 h-8"
            >
              {filter.value === "none" ? (
                <Eye className="h-3 w-3 mr-1" />
              ) : (
                <EyeOff className="h-3 w-3 mr-1" />
              )}
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">High Contrast</span>
        <Button
          variant={highContrast ? "default" : "outline"}
          size="sm"
          onClick={toggleContrast}
          className="text-xs py-1 h-8"
        >
          <Contrast className="h-3 w-3 mr-1" />
          {highContrast ? "On" : "Off"}
        </Button>
      </div>
      
      {/* Hidden SVG filters */}
      <svg className="svg-filters">
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.567, 0.433, 0, 0, 0
                      0.558, 0.442, 0, 0, 0
                      0, 0.242, 0.758, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625, 0.375, 0, 0, 0
                      0.7, 0.3, 0, 0, 0
                      0, 0.3, 0.7, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.95, 0.05, 0, 0, 0
                      0, 0.433, 0.567, 0, 0
                      0, 0.475, 0.525, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
