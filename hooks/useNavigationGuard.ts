import { router, useSegments } from "expo-router";
import { useEffect } from "react";

export const useNavigationGuard = (
  isHydrated: boolean,
  isReady: boolean,
  token: string | null,
  showOnboarding: boolean,
  isUnlocked: boolean,
) => {
  const segments = useSegments();

  useEffect(() => {
    if (!isHydrated || !isReady) return;

    const currentRoute = segments.join("/");

    // Ignore modal screens - don't redirect when they are open
    const isModalRoute =
      currentRoute.includes("deposit") || currentRoute.includes("withdraw");

    if (isModalRoute) return;

    const inOnboarding = segments[0] === "onboarding";
    const inAuth = segments[0] === "(routes)";
    const inTabs = segments[0] === "(tabs)";

    if (showOnboarding) {
      if (!inOnboarding) router.replace("/onboarding");
      return;
    }

    // Not logged in
    if (!token) {
      if (!inAuth) router.replace("/(routes)/login");
      return;
    }

    // Logged in but locked (needs passcode)
    if (token && !isUnlocked) {
      router.replace("/(routes)/passcode-login");
      return;
    }

    // Logged in and unlocked
    if (token && isUnlocked) {
      if (!inTabs) router.replace("/(tabs)");
    }
  }, [token, isUnlocked, isHydrated, isReady, showOnboarding, segments]);
};
