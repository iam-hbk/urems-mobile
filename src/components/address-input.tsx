"use client";

import React, { useState, useRef, useEffect } from "react";
import { Control, useController } from "react-hook-form";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { MapPin, Loader2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FormLabel } from "./ui/form";
import { toast } from "sonner";

const libraries: ("places")[] = ["places"];

export interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  fullAddress: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface AddressInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function AddressInput({
  name,
  control,
  label = "Address",
  isRequired = false,
  placeholder = "Enter address",
  disabled = false,
}: AddressInputProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      fullAddress: "",
      coordinates: undefined,
    } as AddressData,
  });

  const parseAddressComponents = (
    place: google.maps.places.PlaceResult
  ): AddressData => {
    const components = place.address_components || [];
    const addressData: AddressData = {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      fullAddress: place.formatted_address || "",
      coordinates: place.geometry?.location
        ? {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }
        : undefined,
    };

    components.forEach((component) => {
      const types = component.types;

      if (types.includes("street_number")) {
        addressData.street = component.long_name;
      } else if (types.includes("route")) {
        addressData.street = addressData.street
          ? `${addressData.street} ${component.long_name}`
          : component.long_name;
      } else if (types.includes("locality")) {
        addressData.city = component.long_name;
      } else if (types.includes("administrative_area_level_1")) {
        addressData.state = component.long_name;
      } else if (types.includes("postal_code")) {
        addressData.zipCode = component.long_name;
      } else if (types.includes("country")) {
        addressData.country = component.long_name;
      }
    });

    return addressData;
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place) {
      const addressData = parseAddressComponents(place);
      onChange(addressData);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use Google Geocoding API to get address from coordinates
          const geocoder = new google.maps.Geocoder();
          const response = await geocoder.geocode({
            location: { lat: latitude, lng: longitude },
          });

          if (response.results && response.results[0]) {
            const addressData = parseAddressComponents(response.results[0]);
            addressData.coordinates = { lat: latitude, lng: longitude };
            onChange(addressData);
            toast.success("Location detected successfully");
          } else {
            toast.error("Unable to get address for current location");
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          toast.error("Failed to get address from location");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLoadingLocation(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location access denied by user");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information is unavailable");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out");
            break;
          default:
            toast.error("An unknown error occurred while getting location");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleInputChange = (field: keyof AddressData, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  const clearAddress = () => {
    onChange({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      fullAddress: "",
      coordinates: undefined,
    });
  };

  const hasValue = value && (
    value.fullAddress || 
    value.street || 
    value.city || 
    value.state || 
    value.zipCode || 
    value.country
  );

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      libraries={libraries}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>
            {label}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={disabled || isLoadingLocation}
              className="h-8"
            >
              {isLoadingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              <span className="ml-2">Use Current Location</span>
            </Button>
            {hasValue && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAddress}
                disabled={disabled}
                className="h-8"
                title="Clear address"
              >
                <X className="h-4 w-4" />
                <span className="ml-2">Clear</span>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Autocomplete
            onLoad={(autocomplete) => {
              autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={handlePlaceSelect}
            options={{
              types: ["address"],
              componentRestrictions: undefined,
            }}
          >
            <Input
              placeholder={placeholder}
              value={value?.fullAddress || ""}
              onChange={(e) => handleInputChange("fullAddress", e.target.value)}
              onBlur={onBlur}
              disabled={disabled}
              className={error ? "border-destructive" : ""}
            />
          </Autocomplete>

          <Input
            placeholder="Street Address"
            value={value?.street || ""}
            onChange={(e) => handleInputChange("street", e.target.value)}
            disabled={disabled}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="City"
              value={value?.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              disabled={disabled}
            />
            <Input
              placeholder="State/Province"
              value={value?.state || ""}
              onChange={(e) => handleInputChange("state", e.target.value)}
              disabled={disabled}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="ZIP/Postal Code"
              value={value?.zipCode || ""}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              disabled={disabled}
            />
            <Input
              placeholder="Country"
              value={value?.country || ""}
              onChange={(e) => handleInputChange("country", e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error.message}</p>
        )}
      </div>
    </LoadScript>
  );
} 