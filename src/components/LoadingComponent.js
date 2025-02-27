import React, { useEffect, useState } from 'react';
import { Loader2, RefreshCw, Coffee, Moon, Sun } from 'lucide-react';

const LoadingComponent = () => {
  const [progress, setProgress] = useState(0);
  const [currentIcon, setCurrentIcon] = useState(0);
  
  const icons = [
    <Loader2 className="animate-spin" />,
    <RefreshCw className="animate-spin" />,
    <Coffee className="animate-bounce" />,
    <Moon className="animate-pulse" />,
    <Sun className="animate-pulse" />
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    
    const iconTimer = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % icons.length);
    }, 1500);
    
    return () => {
      clearInterval(timer);
      clearInterval(iconTimer);
    };
  }, [icons.length]); 
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-64 p-8 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center justify-center mb-6 text-indigo-600">
        <div className="mr-3 w-12 h-12">
          {icons[currentIcon]}
        </div>
        <h2 className="text-2xl font-bold">Loading...</h2>
      </div>
      
      <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mb-4">
        <div 
          className="h-4 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="text-sm text-gray-600">
        {progress < 30 && "Preparing your content..."}
        {progress >= 30 && progress < 60 && "Almost there..."}
        {progress >= 60 && progress < 90 && "Just a few more moments..."}
        {progress >= 90 && "Ready any second now!"}
      </p>
    </div>
  );
};

export default LoadingComponent;