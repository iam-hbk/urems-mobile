import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/lib/store";
import { PRF_FORM } from "@/interfaces/prf-form";
import { UREM__ERP_API_BASE } from "@/lib/wretch";

const updatePrfForm = async (updatedPrf: PRF_FORM) => {
  try {
    // Create a clean payload without any undefined values
    const cleanPayload = {
      prfFormId: updatedPrf.prfFormId,
      patientId: updatedPrf.patientId,
      EmployeeID: updatedPrf.EmployeeID || "2",
      CrewID: updatedPrf.CrewID,
      isCompleted: updatedPrf.isCompleted ?? false,
      prfData: JSON.stringify(updatedPrf.prfData),
    };

    console.log("Sending", cleanPayload);

    const response = await fetch(
      `${UREM__ERP_API_BASE}/api/PrfForm/${cleanPayload.prfFormId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanPayload),
      },
    );

    if (response.status === 204) {
      // Return the original data since the server returned no content
      return {
        ...updatedPrf,
        prfData: updatedPrf.prfData, // Keep the original parsed prfData
      };
    } else if (response.ok) {
      const data = await response.json();
      console.log("Data From Network Request -> ", data);
      return {
        ...data,
        prfData:
          typeof data.prfData === "string"
            ? JSON.parse(data.prfData)
            : data.prfData,
      };
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update PRF form");
    }
  } catch (error) {
    console.error("Error updating PRF form:", error);
    throw error;
  }
};

export const useUpdatePrf = () => {
  const queryClient = useQueryClient();
  const updatePrfInStore = useStore((state) => state.updatePrfForm);

  return useMutation({
    mutationFn: updatePrfForm,
    onSuccess: (data) => {
      console.log("Updating PRF With -> ", JSON.parse(data.prfData));
      if (data) {
        updatePrfInStore(data);
      }
      queryClient.invalidateQueries({
        queryKey: ["prfForms"],
      });
    },
    onError: (error) => {
      console.error("Error updating PRF Form:", error);
    },
  });
};
