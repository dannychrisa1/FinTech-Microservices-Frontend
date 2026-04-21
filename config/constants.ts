export const PAYSTACK_PUBLIC_KEY =
  process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

if (!PAYSTACK_PUBLIC_KEY && !__DEV__) {
  console.warn(" Paystack public key is missing. Check your .env file");
}
