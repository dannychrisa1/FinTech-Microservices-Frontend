import { hasCompletedOnboarding } from "@/utils/onboarding";
import { useEffect, useState } from "react";

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await hasCompletedOnboarding();
      console.log("Onboarding check - completed:", completed); // Debug log
      setShowOnboarding(!completed);
      setIsReady(true);
    };
    checkOnboarding();
  }, []);

  return { showOnboarding, setShowOnboarding, isReady };
};
