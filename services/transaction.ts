import { useAuthStore } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import api from "./api";

export const useTransactions = (params: {
  page?: number;
  limit?: number;
  type?: "DEPOSIT" | "WITHDRAW" | "TRANSFER";
  startDate?: string;
  endDate?: string;
}) => {
  const user = useAuthStore((state) => state.user);
  const accountNumber = user?.accountNumber;
  return useQuery({
    queryKey: ["transactions", accountNumber, params],
    queryFn: async () => {
      if (!accountNumber) throw new Error("No account number");
      const response = await api.get("/transaction", {
        params: { accountNumber, ...params },
      });
      return response.data.data;
    },
    enabled: !!accountNumber,
    staleTime: 1000 * 60,
  });
};
