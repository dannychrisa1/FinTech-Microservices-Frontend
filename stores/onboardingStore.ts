import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OnboardingState {
  hasOnboarded: boolean;
  setHasOnboarded: (value: boolean) => void;
}

// 🔥 SecureStore adapter (INLINE)
const secureStorage = {
  getItem: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },

  setItem: async (key: string, value: string) => {
    return await SecureStore.setItemAsync(key, value);
  },

  removeItem: async (key: string) => {
    return await SecureStore.deleteItemAsync(key);
  },
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      setHasOnboarded: (value) => set({ hasOnboarded: value }),
    }),
    {
      name: "onboarding-storage",

      // 🔥 THIS FIXES YOUR CRASH
      storage: createJSONStorage(() => secureStorage),
    },
  ),
);
