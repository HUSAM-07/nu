"use client";

// Note: Page metadata is handled by the root layout.tsx using the Metadata API
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, AlertCircle, Loader2, Camera, X, Info } from "lucide-react";
import Image from "next/image";

export default function ConsolePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Clean up the media stream when component unmounts
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Security: Check if the file is an image
      if (!file.type.match(/^image\/(jpeg|png|gif|bmp|webp)$/i)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF, BMP, or WebP).');
        return;
      }
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image too large. Please upload an image smaller than 10MB.');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          // Reset analysis when new image is uploaded
          setAnalysis(null);
          setError(null);
        }
      };
      
      reader.onerror = () => {
        setError('Error reading the image file. Please try another image.');
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  const activateCamera = async () => {
    try {
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera not supported on this device or browser.');
        return;
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Prefer rear camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Save the stream reference for cleanup
      mediaStreamRef.current = stream;
      
      // Set the video source
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraActive(true);
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please check permissions.');
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame on the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL (using JPEG for smaller size)
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setSelectedImage(imageDataUrl);
        
        // Clean up camera
        stopCamera();
        
        // Reset analysis when new image is captured
        setAnalysis(null);
      }
    }
  };

  const stopCamera = () => {
    // Stop all tracks in the stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Reset video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Security: Validate image before sending to API
      if (!selectedImage.startsWith('data:image/')) {
        setError('Invalid image format');
        setLoading(false);
        return;
      }
      
      // API call to the Gemini model
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze image');
      }
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setAnalysis(null);
      } else if (data.analysis) {
        setAnalysis(formatAnalysis(data.analysis));
      } else {
        setError("Unexpected response format from the server");
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError(error instanceof Error ? error.message : 'Error analyzing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Format the raw analysis text into a more readable format
  const formatAnalysis = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **bold** to <strong>
      .replace(/\n\n/g, '<br/><br/>') // Replace double newlines with breaks
      .replace(/\n([0-9]+\))/g, '<br/><br/>$1'); // Add extra space before numbered points
  };

  return (
    <>
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8" aria-labelledby="page-heading">
        <div className="max-w-5xl mx-auto rounded-3xl bg-white p-4 sm:p-6 md:p-10 shadow-sm">
          <div className="mb-6 sm:mb-8 lg:mb-16">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="flex-1">
                <p className="text-xl font-medium mb-2">Nu.</p>
                <h1 id="page-heading" className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
                  Know what&apos;s in it.
                </h1>
                
                <div className="flex flex-wrap gap-2 md:gap-4 mt-6 lg:mt-12">
                  <Button variant="outline" className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 text-sm sm:text-base">
                    Explore Calories
                  </Button>
                  <Button variant="outline" className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 text-sm sm:text-base">
                    Nutrients
                  </Button>
                  <Button variant="outline" className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 text-sm sm:text-base">
                    History
                  </Button>
                </div>
              </div>
              
              <div className="relative mt-6 lg:mt-0">
                <div className="flex flex-col items-center lg:items-end">
                  <div className="relative h-48 w-48 sm:h-60 sm:w-60 lg:h-80 lg:w-80">
                    <Image
                      src="/bakery-image.png"
                      alt="Croissant pastry"
                      fill
                      sizes="(max-width: 640px) 192px, (max-width: 768px) 240px, (max-width: 1024px) 288px, 320px"
                      style={{ objectFit: "contain" }}
                      priority
                    />
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-white border border-gray-200 rounded-full px-4 sm:px-6 py-1 sm:py-2 text-center">
                        <span className="text-xl sm:text-2xl font-bold">320</span>
                      </div>
                      <span className="text-xs sm:text-sm mt-1">Calories</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-white border border-gray-200 rounded-full px-4 sm:px-6 py-1 sm:py-2 text-center">
                        <span className="text-xl sm:text-2xl font-bold">17g</span>
                      </div>
                      <span className="text-xs sm:text-sm mt-1">Fat</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-white border border-gray-200 rounded-full px-4 sm:px-6 py-1 sm:py-2 text-center">
                        <span className="text-xl sm:text-2xl font-bold">38g</span>
                      </div>
                      <span className="text-xs sm:text-sm mt-1">Carbs</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-white border border-gray-200 rounded-full px-4 sm:px-6 py-1 sm:py-2 text-center">
                        <span className="text-xl sm:text-2xl font-bold">6g</span>
                      </div>
                      <span className="text-xs sm:text-sm mt-1">Protein</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Upload Section */}
            <section aria-labelledby="upload-heading">
              <h3 id="upload-heading" className="text-xl font-medium mb-4">Upload image</h3>
              <Card className="h-80 sm:h-96 border-2 rounded-2xl overflow-hidden shadow-none">
                {selectedImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={selectedImage}
                      alt="Uploaded food"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                      priority
                    />
                    <div className="absolute bottom-4 right-4">
                      <Button
                        variant="outline"
                        className="bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white"
                        onClick={() => setSelectedImage(null)}
                        size="sm"
                        aria-label="Remove image"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : cameraActive ? (
                  <div className="relative w-full h-full bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-full w-full object-cover"
                      aria-label="Camera preview"
                    />
                    <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
                    
                    <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-4">
                      <Button
                        variant="default"
                        className="rounded-full bg-white text-gray-800 hover:bg-gray-100"
                        onClick={captureImage}
                        aria-label="Take photo"
                      >
                        Capture Photo
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white"
                        onClick={stopCamera}
                        aria-label="Cancel camera"
                      >
                        <X className="h-4 w-4 mr-2" aria-hidden="true" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md bg-gray-100 flex items-center justify-center mb-6" aria-hidden="true">
                      <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                    </div>
                    <p className="text-lg sm:text-xl text-center mb-6">Upload image</p>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg, image/png, image/gif, image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      aria-label="Upload food image"
                    />
                    <div className="flex flex-col xs:flex-row space-y-3 xs:space-y-0 xs:space-x-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleButtonClick}
                        aria-label="Select image from files"
                      >
                        <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
                        Choose file
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={activateCamera}
                        aria-label="Take photo with camera"
                      >
                        <Camera className="h-4 w-4 mr-2" aria-hidden="true" />
                        Take Photo
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
              {selectedImage && (
                <div className="mt-4 flex justify-center">
                  <Button 
                    onClick={analyzeImage}
                    disabled={loading}
                    className="mt-4"
                    size="lg"
                    aria-label={loading ? "Analyzing image, please wait" : "Analyze food image"}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                        Analyzing...
                      </>
                    ) : "Analyze Food"}
                  </Button>
                </div>
              )}
            </section>

            {/* Output Section */}
            <section aria-labelledby="output-heading">
              <h3 id="output-heading" className="text-xl font-medium mb-4">Output</h3>
              <Card className="h-80 sm:h-96 rounded-2xl shadow-none border-2">
                <CardContent className="p-6 sm:p-8 h-full">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4" aria-live="polite" aria-busy="true">
                      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" aria-hidden="true" />
                      <p className="text-gray-500 text-xl text-center">Analyzing your food...</p>
                      <p className="text-gray-400 text-sm text-center">This may take a moment</p>
                    </div>
                  ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center" aria-live="assertive">
                      <AlertCircle className="h-12 w-12 text-red-500 mb-4" aria-hidden="true" />
                      <p className="text-gray-800 text-center">{error}</p>
                    </div>
                  ) : analysis ? (
                    <div className="h-full overflow-auto" aria-live="polite">
                      <div 
                        className="text-gray-800"
                        dangerouslySetInnerHTML={{ __html: analysis }}
                      ></div>
                    </div>
                  ) : selectedImage ? (
                    <div className="flex items-center justify-center h-full" aria-live="polite">
                      <div className="flex flex-col items-center text-center">
                        <Info className="h-8 w-8 text-blue-500 mb-4" aria-hidden="true" />
                        <p className="text-gray-500 text-xl">No analysis available. Click &quot;Analyze Food&quot; to begin.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-300 text-xl">Generated text</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </>
  );
} 