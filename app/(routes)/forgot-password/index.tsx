import CustomModal from "@/components/CustomModal";
import { useModal } from "@/hooks/useModal";
import { useForgotPassword } from "@/services/password";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const { modal, showSuccess, showError, hideModal } = useModal();
  const forgotPassword = useForgotPassword();

  const handleSubmit = async () => {
    if (!email) {
      showError("Error", "Please enter your email address");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      showError("Error", "Please enter a valid email address");
      return;
    }

    try {
      await forgotPassword.mutateAsync(email);
      showSuccess(
        "Email Sent! 📧",
        `We've sent a password reset code to ${email}. Please check your inbox.`,
      );
      setTimeout(() => {
        router.push({
          pathname: "/(routes)/reset-password",
          params: { email },
        });
      }, 2000);
    } catch (error: any) {
      showError(
        "Failed",
        error.response?.data?.message ||
          "Could not send reset code. Please try again.",
      );
    }
  };

  const isLoading = forgotPassword.isPending;

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
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
                Forgot Password?
              </Text>
              <Text className="text-gray-500 font-poppins text-base">
                Don't worry! Enter your email address and we'll send you a reset
                code.
              </Text>
            </View>

            {/* Email Input */}
            <View className="mt-6">
              <Text className="text-gray-800 font-poppins-medium mb-3">
                Email Address
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 text-gray-800 font-poppins"
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className={`rounded-xl py-4 mt-8 ${isLoading ? "bg-gray-400" : "bg-blue-600"}`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-poppins-semibold text-lg">
                  Send Reset Code
                </Text>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600 font-poppins">
                Remember your password?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(routes)/signup")}>
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
