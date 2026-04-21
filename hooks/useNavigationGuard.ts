import { useAuthStore } from "@/stores/authStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { router, useSegments } from "expo-router";
import { useEffect } from "react";

export const useNavigationGuard = (isHydrated: boolean) => {
  const segments = useSegments();

  const hasOnboarded = useOnboardingStore((state) => state.hasOnboarded);
  const token = useAuthStore((state) => state.token);
  const isUnlocked = useAuthStore((state) => state.isUnlocked);

  useEffect(() => {
    if (!isHydrated) return;

    const currentRoute = segments.join("/");

    const isModalRoute =
      currentRoute.includes("deposit") || currentRoute.includes("withdraw");

    if (isModalRoute) return;

    const inOnboarding = segments[0] === "onboarding";
    const inAuth = segments[0] === "(routes)";
    const inTabs = segments[0] === "(tabs)";

    // ONBOARDING
    if (!hasOnboarded && segments[0] !== "onboarding") {
      router.replace("/onboarding");
      return;
    }

    // Not logged in
    if (hasOnboarded && !token && segments[0] !== "(routes)") {
      router.replace("/(routes)/login");
      return;
    }

    // LOCKED
    if (
      token &&
      !isUnlocked &&
      segments.join("/") !== "(routes)/passcode-login"
    ) {
      router.replace("/(routes)/passcode-login");
      return;
    }

    // Fully authenticated
    if (token && isUnlocked && segments[0] !== "(tabs)") {
      router.replace("/(tabs)");
    }
  }, [segments, isHydrated, hasOnboarded, token, isUnlocked]);
};
