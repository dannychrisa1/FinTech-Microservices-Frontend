import CustomModal from "@/components/CustomModal";
import FormInput from "@/components/FormInput";
import { useModal } from "@/hooks/useModal";
import { useAuthStore } from "@/stores/authStore";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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

interface OtpFormData {
  otp: string;
}
export default function () {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { modal, showSuccess, showError, hideModal } = useModal();

  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const resendOtp = useAuthStore((state) => state.resendOtp);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const otpForm = useForm<OtpFormData>({
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  //start countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (data: OtpFormData) => {
    if (!email) {
      showError(
        "Error",
        "email address is missing. Please go back and try again.",
      );
      return;
    }
    try {
      const result = await verifyOtp(email, data.otp);
      //After successful verification , check if passcode needs to be set
      if (result.requiresPasscodeSetup) {
        router.push({
          pathname: "/(routes)/setup-passcode",
          params: { email: email },
        });
      } else {
        //if passcode already set(unlikely during signup ).go to dashboard
        router.replace("/");
      }
    } catch (err) {
      //show error message from store
      showError(
        "Verification failed",
        error || "Invalid OTP. Please try again",
      );
      clearError();
    }
  };

  const handleResendCode = async () => {
    if (!canResend || isResending) return;
    if (!email) {
      showError("Error", "Email address is missing");
      return;
    }

    setIsResending(true);
    try {
      await resendOtp(email);
      showSuccess(
        "Code Sent! 📧",
        "A new verification code has been sent to your email.",
      );
      setCanResend(false);
      setTimer(60);
      // Restart countdown
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } catch (err: any) {
      showError(
        "Failed",
        err.message || "Could not resend code. Please try again.",
      );
      setCanResend(true);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 px-6"
            showsHorizontalScrollIndicator={false}
          >
            {/* Header */}
            <View className="mt-12 mb-8">
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                className="text-3xl font-poppins-bold text-gray-900 mb-2"
              >
                Verify Email
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                className="text-gray-500 font-poppins text-base"
              >
                We've sent a verification code to
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                className="text-blue-600 font-poppins-semibold text-base mt-1"
              >
                {email || "your email"}
              </Text>
            </View>

            {/* OTP FIELD */}
            <View className="mt-6">
              <FormInput
                control={otpForm.control}
                name="otp"
                label="Verification Code"
                placeholder="Enter 6-digit code"
                icon="numeric"
                iconLibrary="material"
                rules={{
                  required: "Verification code is required",
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
            </View>

            {/* Resend Section */}
            <View className="flex-row justify-center items-center mt-6">
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                className="text-gray-500 font-poppins"
              >
                Didn&apos;t receive code?{" "}
              </Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={!canResend}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  className={`font-poppins-semibold ${
                    canResend ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {canResend ? "Resend Code" : `Resend in ${timer}s`}
                </Text>
              </TouchableOpacity>
            </View>
            {/* Verify Button */}
            <TouchableOpacity
              onPress={otpForm.handleSubmit(handleVerify)}
              disabled={isLoading || !otpForm.formState.isValid}
              className={`rounded-xl py-4 mt-8 ${
                otpForm.formState.isValid && !isLoading
                  ? "bg-blue-600"
                  : "bg-gray-400"
              }`}
            >
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                className="text-white text-center text-lg font-poppins-semibold"
              >
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </Text>
            </TouchableOpacity>
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
