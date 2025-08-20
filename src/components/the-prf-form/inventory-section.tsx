"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Accordion } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, AlertCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { InventorySchema, InventoryType } from "@/interfaces/prf-schema";
import { useZuStandCrewStore } from "@/lib/zuStand/crew";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InventorySection() {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find((prf) => {
    return prf.prfFormId?.toString() === prfId;
  });

  const inputRef = React.useRef<HTMLInputElement>(null);
  //   console.log("PRF From Store -> ", prf_from_store);
  const {
    zsVehicle,
    zsUpdateFluidStock,
    zsUpdateMedicationStock,
    zsUpdateEquipmentStock,
    zsUpdateConsumableStock,
  } = useZuStandCrewStore();
  const [activeTab, setActiveTab] = useState("medications");

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();

  // Create a combined inventory array for the form
  const allInventoryItems = React.useMemo(() => {
    if (!zsVehicle) return [];

    const medications = zsVehicle.inventory.medications.map((med) => ({
      itemId: med.id,
      name: `${med.name} (${med.dose})`,
      category: "medication" as const,
      quantityUsed: 0,
      availableStock: med.currentStock,
      notes: "",
    }));

    const fluids = zsVehicle.inventory.fluids.map((fluid) => ({
      itemId: fluid.id,
      name: `${fluid.name}`,
      category: "fluid" as const,
      quantityUsed: 0,
      availableStock: fluid.currentStock,
      notes: "",
    }));

    const equipment = zsVehicle.inventory.equipment.map((item) => ({
      itemId: item.id,
      name: item.name,
      category: "equipment" as const,
      quantityUsed: 0,
      availableStock: item.currentStock,
      notes: "",
    }));

    const consumables = zsVehicle.inventory.consumables.map((item) => ({
      itemId: item.id,
      name: item.name,
      category: "consumable" as const,
      quantityUsed: 0,
      availableStock: item.currentStock,
      notes: "",
    }));

    return [...medications, ...fluids, ...equipment, ...consumables];
  }, [zsVehicle]);

  const form = useForm<InventoryType>({
    resolver: zodResolver(InventorySchema),
    values: prf_from_store?.prfData.inventory?.data,
    defaultValues: prf_from_store?.prfData?.inventory?.data || {
      items: [],
      additionalNotes: "",
    },
  });

  // Initialize form with inventory items that have been used
  useEffect(() => {
    const existingItems = form.getValues().items;
    console.log("Existing Items -> ", existingItems);

    // If no items have been added yet, initialize with empty array
    if (existingItems.length === 0) {
      form.setValue("items", []);
    }
  }, [form, allInventoryItems]);

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Function to add an item to the form
  const addInventoryItem = (item: (typeof allInventoryItems)[0]) => {
    // Check if item already exists in the form
    const existingIndex = fields.findIndex(
      (field) => field.itemId === item.itemId,
    );

    if (existingIndex >= 0) {
      // Item already exists, show a toast notification
      toast.info(`${item.name} is already in your list`, {
        duration: 2000,
      });
      return;
    }

    // Add the item to the form
    append({
      ...item,
      quantityUsed: 1, // Default to 1 unit used
    });
  };

  // Function to update quantity used
  const updateQuantityUsed = (index: number, newQuantity: number) => {
    const item = fields[index];

    // Validate that quantity doesn't exceed available stock
    if (newQuantity > item.availableStock) {
      toast.error(
        `Cannot use more than available stock (${item.availableStock})`,
        {
          duration: 3000,
        },
      );
      return;
    }

    // Update the item
    update(index, {
      ...item,
      quantityUsed: newQuantity,
    });
  };

  function onSubmit(values: InventoryType) {
    // Update inventory in the store
    values.items.forEach((item) => {
      if (item.category === "medication") {
        zsUpdateMedicationStock(item.itemId, item.quantityUsed);
      } else if (item.category === "fluid") {
        zsUpdateFluidStock(item.itemId, item.quantityUsed);
      } else if (item.category === "equipment") {
        zsUpdateEquipmentStock(item.itemId, item.quantityUsed);
      } else if (item.category === "consumable") {
        zsUpdateConsumableStock(item.itemId, item.quantityUsed);
      }
    });

    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        ...prf_from_store?.prfData,
        inventory: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
      },
      EmployeeID: prf_from_store?.EmployeeID || "2",
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: () => {
        toast.success("Inventory Information Updated", {
          duration: 3000,
          position: "top-right",
        });
        router.push(`/edit-prf/${prfId}`);
      },
      onError: () => {
        toast.error("An error occurred", {
          duration: 3000,
          position: "top-right",
        });
      },
    });
  }

  // Filter inventory items by category for the tabs
  const medications = allInventoryItems.filter(
    (item) => item.category === "medication",
  );
  const fluids = allInventoryItems.filter((item) => item.category === "fluid");
  const equipment = allInventoryItems.filter(
    (item) => item.category === "equipment",
  );
  const consumables = allInventoryItems.filter(
    (item) => item.category === "consumable",
  );

  return (
    <Accordion
      type="single"
      defaultValue="inventory"
      collapsible
      className="w-full"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Inventory
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Selected Items Section */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Items</CardTitle>
                <CardDescription>
                  Items that will be deducted from inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                    <AlertCircle className="mb-2 h-6 w-6" />
                    <p>
                      No items selected yet. Add items from the inventory below.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fields.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Available: {item.availableStock}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.notes`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Notes (optional)"
                                    className="w-24 sm:w-32"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantityUsed`}
                            render={({ field }) => {
                              const handleQuantityChange = (
                                newValue: number,
                              ) => {
                                if (
                                  newValue >= 1 &&
                                  newValue <= item.availableStock
                                ) {
                                  field.onChange(newValue);
                                  updateQuantityUsed(index, newValue);
                                }
                              };

                              return (
                                <FormItem className="flex-shrink-0">
                                  <FormControl>
                                    <div className="flex items-center">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-r-none"
                                        onClick={() => {
                                          const newValue = Math.max(
                                            1,
                                            field.value - 1,
                                          );
                                          handleQuantityChange(newValue);
                                          inputRef.current?.focus();
                                        }}
                                      >
                                        -
                                      </Button>
                                      <Input
                                        ref={inputRef}
                                        value={field.value}
                                        type="number"
                                        min={1}
                                        max={item.availableStock}
                                        step={1}
                                        className="w-12 border-x-0 text-center"
                                        onChange={(e) => {
                                          const value = parseInt(
                                            e.target.value,
                                          );
                                          if (!isNaN(value)) {
                                            handleQuantityChange(value);
                                          }
                                        }}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-l-none"
                                        onClick={() => {
                                          const newValue = Math.min(
                                            item.availableStock,
                                            field.value + 1,
                                          );
                                          handleQuantityChange(newValue);
                                          inputRef.current?.focus();
                                        }}
                                      >
                                        +
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Inventory Section */}
            <Card>
              <CardHeader>
                <CardTitle>Available Inventory</CardTitle>
                <CardDescription>
                  Select items from the ambulance inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="medications"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                    <TabsTrigger value="fluids">Fluids</TabsTrigger>
                    <TabsTrigger value="equipment">Equipment</TabsTrigger>
                    <TabsTrigger value="consumables">Consumables</TabsTrigger>
                  </TabsList>

                  <TabsContent value="medications" className="mt-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2">
                      {medications.map((item) => (
                        <Button
                          key={item.itemId}
                          type="button"
                          variant="outline"
                          className="h-auto justify-start py-3"
                          onClick={() => addInventoryItem(item)}
                        >
                          <div className="text-left">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Available: {item.availableStock}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="fluids" className="mt-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2">
                      {fluids.map((item) => (
                        <Button
                          key={item.itemId}
                          type="button"
                          variant="outline"
                          className="h-auto justify-start py-3"
                          onClick={() => addInventoryItem(item)}
                        >
                          <div className="text-left">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Available: {item.availableStock}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="equipment" className="mt-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2">
                      {equipment.map((item) => (
                        <Button
                          key={item.itemId}
                          type="button"
                          variant="outline"
                          className="h-auto justify-start py-3"
                          onClick={() => addInventoryItem(item)}
                        >
                          <div className="text-left">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Available: {item.availableStock}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="consumables" className="mt-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2">
                      {consumables.map((item) => (
                        <Button
                          key={item.itemId}
                          type="button"
                          variant="outline"
                          className="h-auto justify-start py-3"
                          onClick={() => addInventoryItem(item)}
                        >
                          <div className="text-left">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Available: {item.availableStock}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes about inventory usage"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updatePrfQuery.isPending}
              className="w-full sm:w-auto"
            >
              {updatePrfQuery.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Inventory Information
            </Button>
          </div>
        </form>
      </Form>
    </Accordion>
  );
}
