import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import api from "./api";

// Initialize payment mutation
export const useInitializePayment = () => {
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!user?.email) {
        throw new Error("User email not found. Please log in again.");
      }

      const response = await api.post("/payment/initialize", {
        email: user.email,
        amount: amount,
      });

      return response.data.data;
    },
  });
};

// Verify payment mutation
export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: async (reference: string) => {
      const response = await api.post("/payment/verify", { reference });
      return response.data.data;
    },
  });
};
