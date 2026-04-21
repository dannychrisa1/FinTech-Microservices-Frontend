import { useMutation } from "@tanstack/react-query";
import api from "./api";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      code: string;
      newPassword: string;
    }) => {
      const response = await api.post("/auth/reset-password", data);
      return response.data;
    },
  });
};
