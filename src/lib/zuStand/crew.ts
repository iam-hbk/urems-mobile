import { create } from "zustand";
// import { persist } from "zustand/middleware";

interface FluidItem {
  id: string;
  name: string;
  volume: number; // in milliliters
  currentStock: number; // number of units in stock
}

interface MedicationItem {
  id: string;
  name: string;
  dose: string;
  route: string;
  currentStock: number;
}

interface EquipmentItem {
  id: string;
  name: string;
  currentStock: number;
}

interface ConsumableItem {
  id: string;
  name: string;
  currentStock: number;
}

interface VehicleInventory {
  fluids: FluidItem[];
  medications: MedicationItem[];
  equipment: EquipmentItem[];
  consumables: ConsumableItem[];
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
  zsUpdateMedicationStock: (medicationId: string, unitsUsed: number) => void;
  zsUpdateEquipmentStock: (equipmentId: string, unitsUsed: number) => void;
  zsUpdateConsumableStock: (consumableId: string, unitsUsed: number) => void;
}

// Mock data for initial vehicle inventory
const mockVehicleInventory: VehicleInventory = {
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
  medications: [
    {
      id: "adr-1mg",
      name: "Adrenaline",
      dose: "1mg/1ml",
      route: "IM/IV",
      currentStock: 10,
    },
    {
      id: "asp-300",
      name: "Aspirin",
      dose: "300mg",
      route: "PO",
      currentStock: 20,
    },
    {
      id: "gtn-400",
      name: "GTN Spray",
      dose: "400mcg/dose",
      route: "SL",
      currentStock: 5,
    },
    {
      id: "morph-10",
      name: "Morphine",
      dose: "10mg/1ml",
      route: "IM/IV",
      currentStock: 8,
    },
  ],
  equipment: [
    {
      id: "eq-bvm",
      name: "Bag Valve Mask",
      currentStock: 2,
    },
    {
      id: "eq-spo2",
      name: "SpO2 Sensor",
      currentStock: 3,
    },
  ],
  consumables: [
    {
      id: "con-gloves",
      name: "Gloves (pair)",
      currentStock: 50,
    },
    {
      id: "con-gauze",
      name: "Gauze Pads",
      currentStock: 30,
    },
    {
      id: "con-bandage",
      name: "Bandages",
      currentStock: 20,
    },
  ],
};

// Mock vehicle data
const mockVehicle: Vehicle = {
  vehicleId: 1,
  vehicleName: "Romeo 1",
  vehicleLicense: "ABC123",
  vehicleRegistrationNumber: "REG123456",
  VINNumber: "VIN123456789",
  vehicleTypeID: 1,
  inventory: mockVehicleInventory,
};

export const useZuStandCrewStore = create<useZuStandCrewStoreItems>()((set, get) => ({
  zsCrewID: null,
  zsVehicle: mockVehicle,
  zsSetCrewID: (val: number) => set({ zsCrewID: val }),
  zsSetVehicle: (vehicle: Vehicle) => set({ 
    zsVehicle: {
      ...vehicle,
      inventory: vehicle.inventory || mockVehicleInventory,
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
  zsUpdateMedicationStock: (medicationId: string, unitsUsed: number) => {
    const currentVehicle = get().zsVehicle;
    if (!currentVehicle) return;

    set({
      zsVehicle: {
        ...currentVehicle,
        inventory: {
          ...currentVehicle.inventory,
          medications: currentVehicle.inventory.medications.map(med => 
            med.id === medicationId 
              ? { ...med, currentStock: Math.max(0, med.currentStock - unitsUsed) }
              : med
          ),
        },
      },
    });
  },
  zsUpdateEquipmentStock: (equipmentId: string, unitsUsed: number) => {
    const currentVehicle = get().zsVehicle;
    if (!currentVehicle) return;

    set({
      zsVehicle: {
        ...currentVehicle,
        inventory: {
          ...currentVehicle.inventory,
          equipment: currentVehicle.inventory.equipment.map(item => 
            item.id === equipmentId 
              ? { ...item, currentStock: Math.max(0, item.currentStock - unitsUsed) }
              : item
          ),
        },
      },
    });
  },
  zsUpdateConsumableStock: (consumableId: string, unitsUsed: number) => {
    const currentVehicle = get().zsVehicle;
    if (!currentVehicle) return;

    set({
      zsVehicle: {
        ...currentVehicle,
        inventory: {
          ...currentVehicle.inventory,
          consumables: currentVehicle.inventory.consumables.map(item => 
            item.id === consumableId 
              ? { ...item, currentStock: Math.max(0, item.currentStock - unitsUsed) }
              : item
          ),
        },
      },
    });
  },
}));

