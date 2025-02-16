import { create } from "zustand";
// import { persist } from "zustand/middleware";

interface Vehicle {
  vehicleId: number;
  vehicleName: string;
  vehicleLicense: string;
  vehicleRegistrationNumber: string;
  VINNumber: string;
  vehicleTypeID: number;
}

interface useZuStandCrewStoreItems {
  zsCrewID: null | number;
  zsVehicle: Vehicle | null;
  zsSetCrewID: (val: number) => void;
  zsSetVehicle: (vehicle: Vehicle) => void;
  zsClearCrewID: () => void;
  zsClearVehicle: () => void;
}

// Mock vehicle data
const mockVehicle: Vehicle = {
  vehicleId: 1,
  vehicleName: "Romeo 1",
  vehicleLicense: "ABC123",
  vehicleRegistrationNumber: "REG123456",
  VINNumber: "VIN123456789",
  vehicleTypeID: 1
};

export const useZuStandCrewStore = create<useZuStandCrewStoreItems>()(
  // persist(
  (set, get) => ({
    zsCrewID: null,
    zsVehicle: mockVehicle, // Initialize with mock data
    zsSetCrewID: (val: number) => set({ zsCrewID: val }),
    zsSetVehicle: (vehicle: Vehicle) => set({ zsVehicle: vehicle }),
    zsClearCrewID: () => set({ zsCrewID: null }),
    zsClearVehicle: () => set({ zsVehicle: null }),
  })
  // ,  )
)

