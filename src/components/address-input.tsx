"use client";

import React, { useState, useRef } from "react";
import {
  Control,
  useController,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Autocomplete } from "@react-google-maps/api";
import { MapPin, X, Loader } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FormLabel } from "./ui/form";
import { toast } from "sonner";
import { useGoogleMaps } from "./GoogleMapsProvider";
import { cn } from "@/lib/utils";

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

interface AddressInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  useFullAddressAsValueOnly?: boolean;
  isRequired?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AddressInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label = "Address",
  useFullAddressAsValueOnly = false,
  isRequired = false,
  placeholder = "Enter address",
  disabled = false,
  className,
}: AddressInputProps<TFieldValues, TName>) {
  const { isLoaded: isGoogleMapsLoaded, loadError } = useGoogleMaps();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [userExplicitlyWantsDetailed, setUserExplicitlyWantsDetailed] =
    useState(false);
  const [committedValueForCancel, setCommittedValueForCancel] = useState<
    AddressData | string | null
  >(null);

  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController<TFieldValues, TName>({
    name,
    control,
  });

  const isValueStructuredAddress =
    typeof value === "object" && value !== null && "fullAddress" in value;
  const currentFullAddress: string = isValueStructuredAddress
    ? (value as AddressData).fullAddress
    : typeof value === "string"
      ? value
      : "";

  const showDetailedView = userExplicitlyWantsDetailed || !currentFullAddress;

  const switchToSummaryView = () => {
    const addressToTest =
      typeof value === "object" && value !== null && "fullAddress" in value
        ? (value as AddressData).fullAddress
        : typeof value === "string"
          ? value
          : "";
    if (addressToTest) {
      setUserExplicitlyWantsDetailed(false);
    } else {
      setUserExplicitlyWantsDetailed(true);
    }
    setCommittedValueForCancel(null);
  };

  const parseAddressComponents = (
    place: google.maps.places.PlaceResult,
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
      onChange(
        useFullAddressAsValueOnly ? addressData.fullAddress : addressData,
      );
      switchToSummaryView();
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser", {
        position: "top-center",
        richColors: true,
      });
      return;
    }

    if (!isGoogleMapsLoaded || loadError) {
      toast.error("Google Maps is not available", {
        position: "top-center",
        richColors: true,
      });
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const geocoder = new google.maps.Geocoder();
          const response = await geocoder.geocode({
            location: { lat: latitude, lng: longitude },
          });

          if (response.results && response.results[0]) {
            const addressData = parseAddressComponents(response.results[0]);
            addressData.coordinates = { lat: latitude, lng: longitude };
            onChange(
              useFullAddressAsValueOnly ? addressData.fullAddress : addressData,
            );
            toast.success("Location detected successfully", {
              position: "top-center",
              richColors: true,
            });
            switchToSummaryView();
          } else {
            toast.error("Unable to get address for current location", {
              position: "top-center",
              richColors: true,
            });
            setUserExplicitlyWantsDetailed(true);
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          toast.error("Failed to get address from location", {
            position: "top-center",
            richColors: true,
          });
          setUserExplicitlyWantsDetailed(true);
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLoadingLocation(false);
        setUserExplicitlyWantsDetailed(true);

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
      },
    );
  };

  const handleInputChange = (field: keyof AddressData, newValue: string) => {
    let currentAddressData: AddressData;
    if (typeof value === "string") {
      currentAddressData = {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        fullAddress: value,
        coordinates: undefined,
      };
    } else if (value && typeof value === "object" && "fullAddress" in value) {
      currentAddressData = { ...(value as AddressData) };
    } else {
      currentAddressData = {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        fullAddress: "",
        coordinates: undefined,
      };
    }

    const updatedAddressData = {
      ...currentAddressData,
      [field]: newValue,
    };

    onChange(
      useFullAddressAsValueOnly
        ? updatedAddressData.fullAddress
        : updatedAddressData,
    );
  };

  const clearAddress = () => {
    setCommittedValueForCancel(value);
    onChange(
      useFullAddressAsValueOnly
        ? ""
        : {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            fullAddress: "",
            coordinates: undefined,
          },
    );
    setUserExplicitlyWantsDetailed(true);
  };

  const handleEditDetailsClick = () => {
    setCommittedValueForCancel(value);
    setUserExplicitlyWantsDetailed(true);
  };

  const handleCancelDetailedEdit = () => {
    if (committedValueForCancel !== null) {
      onChange(
        useFullAddressAsValueOnly
          ? (committedValueForCancel as AddressData).fullAddress
          : committedValueForCancel,
      );
    }
    setUserExplicitlyWantsDetailed(false);
    setCommittedValueForCancel(null);
  };

  const hasValue =
    currentFullAddress ||
    (isValueStructuredAddress &&
      ((value as AddressData).street ||
        (value as AddressData).city ||
        (value as AddressData).state ||
        (value as AddressData).zipCode ||
        (value as AddressData).country));

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <FormLabel>
          {label}
          {isRequired && <span className="ml-1 text-destructive">*</span>}
        </FormLabel>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={disabled || isLoadingLocation || !isGoogleMapsLoaded}
            className="h-8"
          >
            {isLoadingLocation ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : !isGoogleMapsLoaded ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            <span className="ml-2">
              {isLoadingLocation
                ? "Getting Location..."
                : !isGoogleMapsLoaded
                  ? "Loading Maps..."
                  : "Use Current Location"}
            </span>
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
        {showDetailedView ? (
          <>
            {isGoogleMapsLoaded && !loadError ? (
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
                  value={currentFullAddress}
                  onChange={(e) =>
                    handleInputChange("fullAddress", e.target.value)
                  }
                  onBlur={onBlur}
                  disabled={disabled}
                  className={error ? "border-destructive" : ""}
                />
              </Autocomplete>
            ) : (
              <div className="relative">
                <Input
                  placeholder={
                    loadError
                      ? "Google Maps failed to load"
                      : "Loading Google Maps..."
                  }
                  value={currentFullAddress}
                  onChange={(e) =>
                    handleInputChange("fullAddress", e.target.value)
                  }
                  onBlur={onBlur}
                  disabled={true}
                  className={error ? "border-destructive" : ""}
                />
                {!loadError && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            )}

            <Input
              placeholder="Street Address"
              value={
                isValueStructuredAddress ? (value as AddressData).street : ""
              }
              onChange={(e) => handleInputChange("street", e.target.value)}
              disabled={disabled}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="City"
                value={
                  isValueStructuredAddress ? (value as AddressData).city : ""
                }
                onChange={(e) => handleInputChange("city", e.target.value)}
                disabled={disabled}
              />
              <Input
                placeholder="State/Province"
                value={
                  isValueStructuredAddress ? (value as AddressData).state : ""
                }
                onChange={(e) => handleInputChange("state", e.target.value)}
                disabled={disabled}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="ZIP/Postal Code"
                value={
                  isValueStructuredAddress ? (value as AddressData).zipCode : ""
                }
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                disabled={disabled}
              />
              <Input
                placeholder="Country"
                value={
                  isValueStructuredAddress ? (value as AddressData).country : ""
                }
                onChange={(e) => handleInputChange("country", e.target.value)}
                disabled={disabled}
              />
            </div>

            {committedValueForCancel !== null && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelDetailedEdit}
                disabled={disabled}
                className="mt-2 w-full border-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
              >
                Cancel
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-row items-center justify-center space-x-2">
            <Input
              placeholder={placeholder}
              value={currentFullAddress}
              readOnly={true}
              onBlur={onBlur}
              disabled={true}
              className={error ? "border-destructive" : ""}
            />
            <Button
              type="button"
              variant="outline"
              // size="sm"
              onClick={handleEditDetailsClick}
              disabled={disabled}
              className="m-0 w-full sm:w-auto"
            >
              Edit Address Details
            </Button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}
      {loadError && (
        <p className="text-sm text-destructive">
          Google Maps failed to load. Address autocomplete is unavailable.
        </p>
      )}
    </div>
  );
}
