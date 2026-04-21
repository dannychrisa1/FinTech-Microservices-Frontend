import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { AppState } from "react-native";

export const useAppLock = () => {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "background" || state === "inactive") {
        useAuthStore.getState().lock();
      }
    });

    return () => subscription.remove();
  }, []);
};
