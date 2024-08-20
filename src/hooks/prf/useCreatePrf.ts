
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/wretch";
import { useStore } from "@/lib/store";
import { PRF_FORM } from "@/interfaces/prf-form";

const createPrfForm = async (newPrf: PRF_FORM): Promise<PRF_FORM> => {
  const payload: any = newPrf;
  payload.prfData = JSON.stringify(newPrf.prfData);
  return (await api.url("/PrfForm").post(newPrf)) as Promise<PRF_FORM>;
};

export const useCreatePrf = () => {
  const queryClient = useQueryClient();
  const addPrf = useStore((state) => state.addPrfForm);

  return useMutation({
    mutationFn: async (data: PRF_FORM) => {
      try {
        const newPrf = await createPrfForm(data);
        const processedData: PRF_FORM = {
          ...newPrf,
          prfData: JSON.parse(newPrf.prfData as string),
        };
        return processedData;
      } catch (error) {
        console.error("Error creating PRF Form", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      addPrf(data);
      queryClient.invalidateQueries({
        queryKey: ["prfForms"],
      });
    },
    onError: (error) => {
      console.error("Error creating PRF Form", error);
    },
  });
};
