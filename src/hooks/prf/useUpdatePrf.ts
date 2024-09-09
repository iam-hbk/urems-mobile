import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/lib/store";
import { PRF_FORM } from "@/interfaces/prf-form";

const updatePrfForm = async (updatedPrf: PRF_FORM) => {
  const payload: any = updatedPrf;
  payload.prfData = JSON.stringify(updatedPrf.prfData);

  const response = await fetch(`https://localhost:7089/api/PrfForm/${payload.prfFormId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 204) {
    // No content, return null or an empty object
    return null;
  } else if (response.ok) {
    const data = await response.json();
    console.log("Data From Network Request -> ", data);
    return data;
  } else {
    // Handle non-2xx status codes
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update PRF form');
  }
};

export const useUpdatePrf = () => {
  const queryClient = useQueryClient();
  const updatePrfInStore = useStore((state) => state.updatePrfForm);

  return useMutation({
    mutationFn: updatePrfForm,
    onSuccess: (data) => {
      if (data) {
        // Process data only if it's not null
        const processedData: PRF_FORM = {
          ...data,
          prfData: JSON.parse(data.prfData as string),
        };
        console.log("Sending", processedData);
        updatePrfInStore(processedData);
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
