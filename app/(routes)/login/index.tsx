import CustomModal from "@/components/CustomModal";
import FormInput from "@/components/FormInput";
import { useModal } from "@/hooks/useModal";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  // const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);
  const { modal, showSuccess, showError, hideModal } = useModal();
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const loginForm = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignUpNavigation = () => {
    router.push("/(routes)/signup");
  };

  // const handleGoogleLogin = async () => {
  //   setLoadingProvider("google");
  // };

  // const handleFacebookLogin = async () => {
  //   setLoadingProvider("facebook");
  // };

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      // Get the updated user from the store after login
      const updatedUser = useAuthStore.getState().user;
      //after login, check if passcode is set
      if (updatedUser && !updatedUser.isPasscodeSet) {
        router.push({
          pathname: "/(routes)/setup-passcode",
          params: { email: data.email },
        });
      } else {
        showSuccess(
          "Welcome Back! 🎉",
          `Hello ${updatedUser?.name}, you have successfully logged in.`,
        );
        setTimeout(() => router.replace("/"), 1500);
      }
    } catch (err) {
      showError("Login Failed", "Invalid email or password. Please try again.");
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
                Welcome Back
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                className="text-gray-500 font-poppins text-base "
              >
                Sign in to your account
              </Text>
            </View>
            {/* Form Fields */}
            <View className="gap-6 mt-8">
              {/* Email Field */}
              <FormInput
                control={loginForm.control}
                name="email"
                label="Email"
                placeholder="enter your email"
                icon="email-outline"
                iconLibrary="material"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                }}
              />
              {/* Password Field */}
              <FormInput
                control={loginForm.control}
                name="password"
                label="Password"
                placeholder="enter your password"
                icon="lock-closed-outline"
                iconLibrary="ion"
                secureTextEntry={true}
                rules={{
                  required: "Password is required",
                }}
              />
              {/* Forgot Password Link */}
              <TouchableOpacity
                className="self-end mt-2"
                onPress={() => router.push("/(routes)/forgot-password")}
              >
                <Text className="text-blue-600 font-poppins font-bold">
                  Forgot Password
                </Text>
              </TouchableOpacity>
            </View>
            <View className="gap-6 mt-2"></View>
            {/* Submit button */}
            <TouchableOpacity
              onPress={loginForm.handleSubmit(onSubmit)}
              disabled={!loginForm.formState.isValid || isLoading}
              className={`rounded-xl py-4 mt-8 "
              ${loginForm.formState.isValid && !isLoading ? "bg-blue-600" : "bg-gray-400"}`}
            >
              <Text className="text-white text-center text-lg">
                {isLoading ? "Signing In..." : "Sign in"}
              </Text>
            </TouchableOpacity>
            {/* Divider */}
            {/* <Divider /> */}
            {/* Social Login Buttons */}
            {/* <View className="space-y-4">
              <GoogleButton
                title="Sign in with Google"
                onPress={handleGoogleLogin}
                isLoading={loadingProvider === "google"}
              />
              <FacebookButton
                title="Sign in with Facebook"
                onPress={handleFacebookLogin}
                isLoading={loadingProvider === "facebook"}
              />
            </View> */}
            <View className="flex-row justify-center mb-8">
              <Text className="text-gray-600 font-poppins">
                Don&apos;t have an account?{" "}
              </Text>
              <TouchableOpacity onPress={handleSignUpNavigation}>
                <Text className="text-blue-600 font-poppins font-bold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Custom Modal */}
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
