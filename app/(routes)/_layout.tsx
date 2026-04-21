import { Stack } from "expo-router";

export default function RouteLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login/index" />
      <Stack.Screen name="signup/index" />
      <Stack.Screen name="verify-otp/index" />
      <Stack.Screen name="setup-passcode/index" />
      <Stack.Screen name="passcode-login/index" />
      <Stack.Screen name="forgot-password/index" />
      <Stack.Screen name="reset-password/index" />
    </Stack>
  );
}
