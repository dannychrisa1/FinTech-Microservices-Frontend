import CustomModal from "@/components/CustomModal";
import FormInput from "@/components/FormInput";
import { useModal } from "@/hooks/useModal";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function () {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const { modal, showSuccess, showError, hideModal } = useModal();

  const signupForm = useForm<SignupFormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleLoginNavigation = () => {
    router.push("/login");
  };

  // const handleGoogleSignup = async () => {
  //   setLoadingProvider("google");
  // };

  // const handleFacebookSignup = async () => {
  //   setLoadingProvider("facebook");
  // };

  const onSubmit = async (data: SignupFormData) => {
    if (!termsAccepted) {
      Alert.alert(
        "Terms Required",
        "Please accept the Terms of Service and Privacy Policy.",
      );
      return;
    }
    try {
      //Call the register action
      await register(data.name, data.email, data.password);

      // On success, navigate to OTP verification
      router.push({
        pathname: "/(routes)/verify-otp",
        params: { email: data.email },
      } as any);
    } catch (err: any) {
      //Show Error that is already set in store
      const errorMessage = err?.message || error || "Something went wrong";
      showError("Registration Failed", errorMessage);
      clearError();
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="mt-8 mb-2">
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                className="text-3xl font-poppins-bold text-gray-900 mb-2"
              >
                Create Account
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                className="text-gray-500 font-poppins text-base"
              >
                Sign up to get started
              </Text>
            </View>

            {/* Form Fields */}
            <View className="gap-2 mt-6">
              {/* Name Field */}
              <FormInput
                control={signupForm.control}
                name="name"
                label="Full Name"
                placeholder="enter your full name"
                icon="account-outline"
                iconLibrary="material"
                rules={{
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                }}
              />

              {/* Email Field */}

              <FormInput
                control={signupForm.control}
                name="email"
                label="email"
                placeholder="enter your email"
                icon="email-outline"
                iconLibrary="material"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valide email address",
                  },
                }}
              />

              {/* Password Field */}

              <FormInput
                control={signupForm.control}
                name="password"
                label="Password"
                placeholder="create a password"
                icon="lock-closed-outline"
                iconLibrary="ion"
                secureTextEntry={true}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
              />

              {/* Confirm Password Field */}
              <FormInput
                control={signupForm.control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="confirm your password"
                icon="lock-closed-outline"
                iconLibrary="ion"
                secureTextEntry={true}
                rules={{
                  required: "Please confirm your password",
                  validate: (value: any) =>
                    value === signupForm.watch("password") ||
                    "Passwords do not match",
                }}
              />
            </View>
            {/* Terms and Conditions */}
            <View className="flex-row items-start mt-6">
              <TouchableOpacity
                className="mt-1"
                onPress={() => setTermsAccepted(!termsAccepted)}
              >
                <View
                  className={`w-5 h-5 border-2 rounded mr-3 ${termsAccepted ? "bg-blue-600 border-blue-600" : "border-gray-400"}`}
                >
                  {termsAccepted && (
                    <Text className="text-white text-xs text-center">✓</Text>
                  )}
                </View>
              </TouchableOpacity>
              <Text className="text-gray-600 font-poppins text-sm flex-1">
                By signing up, you agree to our{" "}
                <Text className="text-blue-600 font-poppins-bold">
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text className="text-blue-600 font-poppins-bold">
                  Privacy Policy
                </Text>
              </Text>
            </View>
            {/* Submit Button */}
            <TouchableOpacity
              onPress={signupForm.handleSubmit(onSubmit)}
              disabled={
                !signupForm.formState.isValid || isLoading || !termsAccepted
              }
              className={`rounded-xl py-4 mt-8 ${
                signupForm.formState.isValid && !isLoading && termsAccepted
                  ? "bg-blue-600"
                  : "bg-gray-400"
              }`}
            >
              <Text className="text-white text-center text-lg font-poppins-semibold">
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>
            {/* Divider */}
            {/* <Divider text="Or sign up with" /> */}

            {/* Social Signup Buttons */}
            {/* <View className="space-y-4">
              <GoogleButton
                title="Sign up with Google"
                onPress={handleGoogleSignup}
                isLoading={loadingProvider === "google"}
              />
              <FacebookButton
                title="Sign up with Facebook"
                onPress={handleFacebookSignup}
                isLoading={loadingProvider === "facebook"}
              />
            </View> */}
            {/* Login Link */}
            <View className="flex-row justify-center mb-8 mt-6">
              <Text className="text-gray-600 font-poppins">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={handleLoginNavigation}>
                <Text className="text-blue-600 font-poppins font-bold">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <CustomModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={hideModal}
      />
    </>
  );
}
