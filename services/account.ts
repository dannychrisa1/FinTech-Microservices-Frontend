import { useAuthStore } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import api from "./api";

export const useAccount = () => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const response = await api.get("/account");
      return response.data.data;
    },
    enabled: !!token, //only run query if token exists
    staleTime: 1000 * 60, // iminute
  });
};
