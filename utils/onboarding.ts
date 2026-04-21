import * as SecureStore from "expo-secure-store";

const ONBOARDING_KEY = "has_completed_onboarding";

export const hasCompletedOnboarding = async () => {
  try {
    const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
    return value === "true";
  } catch (error) {
    return false;
  }
};

export const setOnboardingCompleted = async () => {
  try {
    await SecureStore.setItemAsync(ONBOARDING_KEY, "true");
  } catch (error) {
    console.error("Failed to set onboarding completed:", error);
  }
};

export const resetOnboarding = async () => {
  try {
    await SecureStore.deleteItemAsync(ONBOARDING_KEY);
  } catch (error) {
    console.error("Failed to reset onboarding:", error);
  }
};
