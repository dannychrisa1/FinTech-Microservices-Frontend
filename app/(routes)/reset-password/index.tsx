import CustomModal from "@/components/CustomModal";
import FormInput from "@/components/FormInput";
import { useModal } from "@/hooks/useModal";
import { useResetPassword } from "@/services/password";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ResetPasswordFormData {
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { modal, showSuccess, showError, hideModal } = useModal();
  const resetPassword = useResetPassword();

  const resetForm = useForm<ResetPasswordFormData>({
    mode: "onChange",
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: ResetPasswordFormData) => {
    if (!data.code || data.code.length !== 6) {
      showError("Error", "Please enter the 6-digit reset code");
      return;
    }

    if (!data.newPassword) {
      showError("Error", "Please enter a new password");
      return;
    }

    if (data.newPassword.length < 6) {
      showError("Error", "Password must be at least 6 characters");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      showError("Error", "Passwords do not match");
      return;
    }

    try {
      await resetPassword.mutateAsync({
        email: email as string,
        code: data.code,
        newPassword: data.newPassword,
      });
      showSuccess(
        "Password Reset Successful! 🎉",
        "Your password has been reset. Please login with your new password.",
      );
      setTimeout(() => {
        router.replace("/(routes)/login");
      }, 2000);
    } catch (error: any) {
      const message = error.response?.data?.message;
      if (message?.includes("expired")) {
        showError(
          "Code Expired",
          "The reset code has expired. Please request a new one.",
        );
      } else if (message?.includes("Invalid")) {
        showError(
          "Invalid Code",
          "The reset code is incorrect. Please try again.",
        );
      } else {
        showError(
          "Failed",
          message || "Could not reset password. Please try again.",
        );
      }
    }
  };

  const isLoading = resetPassword.isPending;

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="mt-12 mb-8">
              <TouchableOpacity onPress={() => router.back()} className="mb-6">
                <Ionicons name="arrow-back" size={24} color="#1f2937" />
              </TouchableOpacity>
              <Text className="text-3xl font-poppins-bold text-gray-900 mb-2">
                Reset Password
              </Text>
              <Text className="text-gray-500 font-poppins text-base">
                Enter the reset code sent to your email and create a new
                password.
              </Text>
            </View>

            {/* Reset Code Input */}
            <View className="gap-2 mt-6">
              <FormInput
                control={resetForm.control}
                name="code"
                label="Reset Code"
                placeholder="Enter 6-digit code"
                icon="key-outline"
                iconLibrary="ion"
                rules={{
                  required: "Reset code is required",
                  minLength: {
                    value: 6,
                    message: "Code must be 6 digits",
                  },
                  maxLength: {
                    value: 6,
                    message: "Code must be 6 digits",
                  },
                }}
              />

              {/* New Password Input */}
              <FormInput
                control={resetForm.control}
                name="newPassword"
                label="New Password"
                placeholder="Enter new password"
                icon="lock-closed-outline"
                iconLibrary="ion"
                secureTextEntry={true}
                rules={{
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
              />

              {/* Confirm Password Input */}
              <FormInput
                control={resetForm.control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                icon="lock-closed-outline"
                iconLibrary="ion"
                secureTextEntry={true}
                rules={{
                  required: "Please confirm your password",
                  validate: (value: string) =>
                    value === resetForm.watch("newPassword") ||
                    "Passwords do not match",
                }}
              />
            </View>
            <View>
              {/* Submit Button */}
              <TouchableOpacity
                onPress={resetForm.handleSubmit(handleSubmit)}
                disabled={isLoading}
                className={`rounded-xl py-4 mt-8 ${
                  isLoading ? "bg-gray-400" : "bg-blue-600"
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-poppins-semibold text-lg">
                    Reset Password
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Back to Login */}
            <View className="flex-row justify-center mt-6 mb-8">
              <Text className="text-gray-600 font-poppins">
                Remember your password?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(routes)/login")}>
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
