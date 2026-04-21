import api from "@/services/api";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  isPasscodeSet: boolean;
  balance?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  isUnlocked: boolean; //
  unlock: () => void;
  lock: () => void;

  // Actions
  register: (name: string, email: string, password: string) => Promise<void>;
  verifyOtp: (
    email: string,
    otp: string,
  ) => Promise<{ requiresPasscodeSetup: boolean }>;
  setupPasscode: (email: string, passcode: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithPasscode: (email: string, passcode: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Custom storage object using SecureStore
const secureStorage = {
  getItem: async (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      isUnlocked: false, //locked on start

      unlock: () => set({ isUnlocked: true }),
      lock: () => set({ isUnlocked: false }),

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/register", {
            name,
            email,
            password,
          });
          // Registration just returns a success message; no token yet
          set({ isLoading: false });
        } catch (error: any) {
          let message = "Registration failed";
          const data = error.response?.data;
          if (data) {
            if (typeof data.message === "string") {
              message = data.message;
            } else if (Array.isArray(data.message)) {
              message = data.message.join(", "); // Convert array to string
            } else if (data.error) {
              message = data.error;
            }
          }
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      verifyOtp: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/verify-otp", { email, otp });
          const data = response.data.data;
          set({
            user: {
              id: data.id,
              name: data.name,
              email: data.email,
              accountNumber: data.accountNumber,
              isPasscodeSet: false,
            },
            isLoading: false,
          });
          return {
            requiresPasscodeSetup: data.requiresPasscodeSetup,
          };
        } catch (error: any) {
          const message =
            error.response?.data?.message || "OTP verification failed";
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      setupPasscode: async (email, passcode) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/setup-passcode", {
            email,
            passcode,
          });
          const { data } = response.data;
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, isPasscodeSet: true },
              isLoading: false,
            });
          } else {
            set({
              user: {
                id: data.id,
                name: data.name,
                email: data.email,
                accountNumber: data.accountNumber,
                isPasscodeSet: data.isPasscodeSet,
              },
              isLoading: false,
            });
          }
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Passcode setup failed";
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/login", { email, password });
          const { token, data: userData } = response.data;
          await SecureStore.setItemAsync("access_token", token);
          set({
            token,
            user: {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              accountNumber: userData.accountNumber,
              isPasscodeSet: userData.isPasscodeSet,
              balance: userData.balance,
            },
            isLoading: false,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || "Login failed";
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      loginWithPasscode: async (email, passcode) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/login-with-passcode", {
            email,
            passcode,
          });
          const { token, data: userData } = response.data;
          await SecureStore.setItemAsync("access_token", token);
          set({
            token,
            user: {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              accountNumber: userData.accountNumber,
              isPasscodeSet: userData.isPasscodeSet,
              balance: userData.balance,
            },
            isLoading: false,
          });
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Passcode login failed";
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      resendOtp: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/resend-otp", { email });
          set({ isLoading: false });
          return response.data;
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Failed to resend OTP";
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      logout: async () => {
        await SecureStore.deleteItemAsync("access_token");
        set({ user: null, token: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.lock(); // FORCE LOCK ON APP START
      },
    },
  ),
);
