import { useQuery } from "@tanstack/react-query";
import api from "../../lib/wretch";
import { useStore } from "@/lib/store";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { WretchError } from "wretch";

export const fetchPrfForms = async (): Promise<PRF_FORM[]> => {
  const req = api.catcher(404, (error) => {
    toast.error("Forms not found");
    return null;
  });

  return (await req.get("/prfform")) as Promise<PRF_FORM[]>;
};
export const fetchPrfForm = async (id: string): Promise<PRF_FORM> => {
  const req = api.catcher(404, (error) => {
    toast.error("Form not found");
    return null;
  });

  return (await req.get(`/prfform/${id}`)) as Promise<PRF_FORM>;
};

export const usePrfForms = () => {
  const setPrfForms = useStore((state) => state.setPrfForms);

  return useQuery({
    queryKey: ["prfForms"],
    queryFn: async () => {
      try {
        const data = await fetchPrfForms();
        const processedData = data
          .map((prf) => {
            prf.prfData = JSON.parse(prf.prfData as string);
            return prf;
          })
        // Filter out null values
        setPrfForms(processedData); // Store in Zustand on success
        return data;
      } catch (error) {
        const err = error as WretchError;
        toast.error(`Error fetching PRF forms -> ${err.json.title}`);
      }
    },
  });
};

export const usePrfForm = (id: string) => {
  return useQuery({
    queryKey: ["prfForm", id],
    queryFn: async () => {
      try {
        const data = await fetchPrfForm(id);
        data.prfData = JSON.parse(data.prfData as string);
        return data;
      } catch (error) {
        const err = error as WretchError;
        toast.error(`Error fetching PRF form -> ${err.json.title}`);
      }
    },
  });
};
