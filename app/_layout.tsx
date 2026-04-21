import { PAYSTACK_PUBLIC_KEY } from "@/config/constants";
import Providers from "@/config/providers";
import { useAppLock } from "@/hooks/useAppLock";
import { useFonts } from "@/hooks/useFonts";
import { useHydration } from "@/hooks/useHydration";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuthStore } from "@/stores/authStore";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaystackProvider } from "react-native-paystack-webview";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const token = useAuthStore((state) => state.token);
  const isUnlocked = useAuthStore((state) => state.isUnlocked);
  // const colorScheme = useColorScheme();
  // const { isDark, mode } = useThemeStore();

  const { fontsLoaded } = useFonts();
  const { showOnboarding, isReady: onboardingReady } = useOnboarding();
  const { isHydrated } = useHydration();

  useAppLock();
  useNavigationGuard(
    isHydrated,
    onboardingReady,
    token,
    showOnboarding,
    isUnlocked,
  );

  const isLoading = !fontsLoaded || !onboardingReady || !isHydrated;

  // Determine navigation theme
  // const navigationTheme = isDark ? DarkTheme : DefaultTheme;

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <Providers>
          <PaystackProvider publicKey={PAYSTACK_PUBLIC_KEY} debug={__DEV__}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="(routes)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="deposit"
                options={{
                  presentation: "modal",
                  headerShown: true,
                  headerTitle: "Deposit Funds",
                }}
              />
              <Stack.Screen
                name="withdraw"
                options={{
                  presentation: "modal",
                  headerShown: true,
                  headerTitle: "Withdraw Funds",
                }}
              />
            </Stack>
          </PaystackProvider>
        </Providers>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
