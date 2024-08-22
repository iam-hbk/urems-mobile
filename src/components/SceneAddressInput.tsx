"use client";

import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { X, MapPin, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";

type SceneAddressInputProps = {
  name: string;
  label: string;
  placeholder?: string;
};

const SceneAddressInput: React.FC<SceneAddressInputProps> = ({
  name,
  label,
  placeholder,
}) => {
  const { control, setValue, formState, watch } = useFormContext();
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentValue = watch(name);

  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (
        typeof window !== "undefined" &&
        window.google &&
        window.google.maps &&
        window.google.maps.places
      ) {
        autocompleteRef.current =
          new window.google.maps.places.AutocompleteService();
        setIsGoogleMapsLoaded(true);
        handleUseCurrentLocation(true);
      } else {
        setIsGoogleMapsLoaded(false);
      }
    };

    checkGoogleMapsLoaded();

    const timeoutId = setTimeout(checkGoogleMapsLoaded, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleInputChange = (value: string) => {
    if (value.length >= 2 && autocompleteRef.current && isGoogleMapsLoaded) {
      autocompleteRef.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: "za" }, // Restrict to South Africa
        },
        (predictions: google.maps.places.AutocompletePrediction[] | null) => {
          setSuggestions(predictions || []);
          setIsOpen(true);
        }
      );
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (
    suggestion: google.maps.places.AutocompletePrediction
  ) => {
    setValue(name, suggestion.description, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setSuggestions([]);
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleUseCurrentLocation = (doItAnyway?: boolean) => {
    if ("geolocation" in navigator) {
      console.log("Getting location...", navigator.geolocation);
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (
            (isGoogleMapsLoaded && window.google.maps.Geocoder) ||
            doItAnyway
          ) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
              { location: { lat: latitude, lng: longitude } },
              (results, status) => {
                if (status === "OK" && !!results && results[0]) {
                  setValue(name, results[0].formatted_address, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                } else {
                  setValue(name, `Lat: ${latitude}, Lng: ${longitude}`, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  toast("Geocoding failed", {
                    description:
                      "Using coordinates instead. You can edit the address manually.",
                  });
                }
                setIsLoadingLocation(false);
              }
            );
          } else {
            setValue(name, `Lat: ${latitude}, Lng: ${longitude}`, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
            setIsLoadingLocation(false);
            toast("Location set", {
              description:
                "Google Maps is not available. Using coordinates instead. You can edit the address manually.",
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
          toast.error("Error getting location", {
            description:
              error.message ||
              "Please try again or enter your address manually.",
          });
        },
        { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
      );
    } else {
      toast.warning("Geolocation not supported", {
        description:
          "Your browser doesn't support geolocation. Please enter your address manually.",
      });
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                ref={(e) => {
                  field.ref(e);
                  inputRef.current = e;
                }}
                placeholder={placeholder}
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange(e.target.value);
                }}
                onFocus={() => currentValue.length >= 2 && setIsOpen(true)}
                className="pr-20"
                aria-autocomplete="list"
                aria-controls="suggestions-list"
                aria-expanded={isOpen}
              />
              <div className="absolute right-0 top-0 h-full flex items-center">
                <Button
                  onClick={() => handleUseCurrentLocation()}
                  variant="ghost"
                  size="sm"
                  className="h-full px-2 hover:bg-transparent"
                  title="Use current location"
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </Button>
                {currentValue && (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setValue(name, "", {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                      setSuggestions([]);
                      setIsOpen(false);
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-full px-2 hover:bg-transparent"
                    title="Clear input"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </FormControl>
          {isOpen &&
            currentValue.length >= 2 &&
            isGoogleMapsLoaded &&
            suggestions.length > 0 && (
              <Command className="absolute z-50 w-full max-w-md rounded-md border shadow-md">
                <CommandList className="max-h-[200px] overflow-y-auto">
                  <CommandGroup>
                    {suggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion.place_id}
                        onSelect={() => handleSuggestionClick(suggestion)}
                        className="cursor-pointer"
                      >
                        {suggestion.description}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SceneAddressInput;
