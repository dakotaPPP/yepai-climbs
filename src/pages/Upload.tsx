import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { AccessibilityControls } from "@/components/AccessibilityControls";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { HoldColor } from "@/lib/types";
import { Upload as UploadIcon, Camera, X, Map, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const UploadPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [holdColor, setHoldColor] = useState<HoldColor>("red");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);
  
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
    { value: "brown", label: "Brown", color: "#78532c" },
  ];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };
  
  const processImageFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.).",
        variant: "destructive",
      });
      return;
    }
    
    setImageFile(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleUpload = async () => {
    if (!imagePreview || !user || !imageFile) {
      toast({
        title: "Missing image",
        description: "Please upload an image of the climbing route.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Process base64 image
      const base64Data = imagePreview.split(',')[1];
      const imageData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      // Generate unique file name
      const fileExt = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('route_images')
        .upload(fileName, imageData, {
          contentType: imageFile.type,
          cacheControl: '3600'
        });

      if (uploadError) {
        throw new Error('Failed to upload image: ' + uploadError.message);
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('route_images')
        .getPublicUrl(fileName);
      
      // Call FastAPI backend for grade prediction
      const predictionResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: publicUrl,
          hold_color: holdColor
        }),
      });
      
      if (!predictionResponse.ok) {
        const errorData = await predictionResponse.json();
        throw new Error(errorData.detail || 'Failed to predict grade');
      }
      
      const predictionData = await predictionResponse.json();
      const predictedGrade = predictionData.grade; // Assuming FastAPI returns a grade field
      
      // Insert into routes table with the predicted grade
      const { data: routeData, error: routeError } = await supabase
        .from('routes')
        .insert({
          user_id: user.id,
          name: name || null,
          image_url: publicUrl,
          hold_color: holdColor,
          location: location || null,
          predicted_grade: predictedGrade
        })
        .select()
        .single();

      if (routeError) {
        throw new Error('Failed to save route data: ' + routeError.message);
      }
      
      // Redirect to route preview with the new data
      navigate("/route-preview", {
        state: {
          routeData,
          isNewUpload: true,
        },
      });
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error processing your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className={`min-h-screen pt-24 pb-16 px-6 ${highContrast ? "bg-black text-white" : "bg-white"}`}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Upload New Route</h1>
            <p className="text-gray-600">
              Upload a photo of a climbing route to get an AI prediction of its difficulty
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className={`p-6 rounded-xl border border-gray-200 ${highContrast ? "high-contrast" : "bg-white"}`}>
                <div className="space-y-6">
                  {!imagePreview ? (
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragging 
                          ? "border-yepai-blue bg-yepai-blue/5" 
                          : "border-gray-300 hover:border-yepai-blue hover:bg-yepai-blue/5"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex flex-col items-center justify-center py-4">
                        <UploadIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          Drag and drop your image here
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          or click to browse files (JPEG, PNG)
                        </p>
                        <Button variant="outline" className="rounded-full">
                          <Camera className="h-5 w-5 mr-2" />
                          Select Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Route preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 bg-white rounded-full shadow-md"
                        onClick={clearImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Route Name (optional)</Label>
                      <Input
                        id="name"
                        placeholder="Give your route a name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location (optional)</Label>
                      <div className="relative">
                        <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="location"
                          placeholder="Where is this route located?"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="pl-10 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Hold Color</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {holdColors.map((color) => (
                          <Button
                            key={color.value}
                            type="button"
                            variant={holdColor === color.value ? "default" : "outline"}
                            className={`flex items-center justify-center h-10 rounded-lg ${
                              holdColor === color.value 
                                ? "ring-2 ring-yepai-blue ring-offset-2" 
                                : ""
                            }`}
                            style={{
                              backgroundColor: holdColor === color.value ? color.color : "",
                              color: holdColor === color.value && ["black", "blue", "purple", "green"].includes(color.value) ? "white" : "",
                              borderColor: color.color,
                            }}
                            onClick={() => setHoldColor(color.value)}
                          >
                            {color.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      onClick={handleUpload}
                      disabled={!imagePreview || isUploading}
                      className="w-full rounded-lg bg-black hover:bg-gray-800 text-white py-6"
                    >
                      {isUploading ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" className="mr-2" />
                          <span>Analyzing route...</span>
                        </div>
                      ) : (
                        <span>Upload and Predict Grade</span>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <AccessibilityControls
                  onContrastToggle={setHighContrast}
                />
                
                <Card className={`p-6 rounded-xl ${highContrast ? "high-contrast" : "bg-gray-50 border border-gray-200"}`}>
                  <div className="flex items-start mb-4">
                    <AlertTriangle className="h-5 w-5 text-yepai-blue mt-0.5 mr-2 flex-shrink-0" />
                    <h3 className="font-medium">Tips for best results</h3>
                  </div>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>Upload clear, well-lit photos of the climbing route</li>
                    <li>Ensure all holds are visible in the image</li>
                    <li>Select the correct hold color for more accurate predictions</li>
                    <li>Avoid including other climbers in the photo</li>
                    <li>For indoor routes, try to capture the entire wall</li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;
