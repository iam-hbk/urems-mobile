"use client";

import React, { createContext, useContext, useState } from "react";
import { LoadScript } from "@react-google-maps/api";

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(
  undefined,
);

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }
  return context;
};

interface GoogleMapsProviderProps {
  children: React.ReactNode;
  apiKey: string;
  libraries?: ("places" | "geometry" | "drawing" | "visualization")[];
}

export function GoogleMapsProvider({
  children,
  apiKey,
  libraries = ["places"],
}: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | undefined>(undefined);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (error: Error) => {
    setLoadError(error);
    console.error("Google Maps failed to load:", error);
  };

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={libraries}
        onLoad={handleLoad}
        onError={handleError}
      >
        {children}
      </LoadScript>
    </GoogleMapsContext.Provider>
  );
}
