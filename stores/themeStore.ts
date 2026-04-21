import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  updateTheme: (systemColorScheme: "light" | "dark") => void;
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

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "system",
      isDark: false,
      setMode: (mode) => set({ mode }),
      updateTheme: (systemColorScheme) =>
        set((state) => ({
          isDark:
            state.mode === "system"
              ? systemColorScheme === "dark"
              : state.mode === "dark",
        })),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => secureStorage),
    },
  ),
);
