import { create } from "zustand";
// import { persist } from "zustand/middleware";

interface FluidItem {
  id: string;
  name: string;
  volume: number; // in milliliters
  currentStock: number; // number of units in stock
}

interface VehicleInventory {
  fluids: FluidItem[];
}

interface Vehicle {
  vehicleId: number;
  vehicleName: string;
  vehicleLicense: string;
  vehicleRegistrationNumber: string;
  VINNumber: string;
  vehicleTypeID: number;
  inventory: VehicleInventory;
}

interface useZuStandCrewStoreItems {
  zsCrewID: null | number;
  zsVehicle: Vehicle | null;
  zsSetCrewID: (val: number) => void;
  zsSetVehicle: (vehicle: Vehicle) => void;
  zsClearCrewID: () => void;
  zsUpdateFluidStock: (fluidId: string, volumeUsed: number) => void;
}

// Mock vehicle data
const mockVehicle: Vehicle = {
  vehicleId: 1,
  vehicleName: "Romeo 1",
  vehicleLicense: "ABC123",
  vehicleRegistrationNumber: "REG123456",
  VINNumber: "VIN123456789",
  vehicleTypeID: 1,
  inventory: {
    fluids: [
      {
        id: "ns-1000",
        name: "Normal Saline 1000ml",
        volume: 1000,
        currentStock: 10,
      },
      {
        id: "rl-1000",
        name: "Ringers Lactate 1000ml",
        volume: 1000,
        currentStock: 8,
      },
      {
        id: "d5w-500",
        name: "D5W 500ml",
        volume: 500,
        currentStock: 12,
      },
    ],
  }
};

export const useZuStandCrewStore = create<useZuStandCrewStoreItems>()(
  // persist(
  (set, get) => ({
    zsCrewID: null,
    zsVehicle: mockVehicle, // Initialize with mock data
    zsSetCrewID: (val: number) => set({ zsCrewID: val }),
    zsSetVehicle: (vehicle: Vehicle) => set({ 
      zsVehicle: {
        ...vehicle,
        inventory: vehicle.inventory || mockVehicle.inventory,
      } 
    }),
    zsClearCrewID: () => set({ zsCrewID: null }),
    zsUpdateFluidStock: (fluidId: string, volumeUsed: number) => {
      const currentVehicle = get().zsVehicle;
      if (!currentVehicle) return;

      set({
        zsVehicle: {
          ...currentVehicle,
          inventory: {
            ...currentVehicle.inventory,
            fluids: currentVehicle.inventory.fluids.map(fluid => 
              fluid.id === fluidId 
                ? { ...fluid, currentStock: Math.max(0, fluid.currentStock - volumeUsed) }
                : fluid
            ),
          },
        },
      });
    },
  })
  // ,  )
)

