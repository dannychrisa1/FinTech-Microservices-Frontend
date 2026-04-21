import CustomModal from "@/components/CustomModal";
import { useModal } from "@/hooks/useModal";
import { useAuthStore } from "@/stores/authStore";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SetupPasscode() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [step, setStep] = useState<"create" | "confirm">("create");
  const { modal, showSuccess, showError, hideModal } = useModal();

  const SetupPasscode = useAuthStore((state) => state.setupPasscode);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handlePasscodeInput = (code: string) => {
    if (step === "create") {
      setPasscode(code);
      if (code.length === 6) {
        //move to confirm step
        setStep("confirm");
        setConfirmPasscode("");
      }
    } else {
      setConfirmPasscode(code);
      if (code.length === 6) {
        //Verify and complete
        if (code === passcode) {
          handleSetupComplete(code);
        } else {
          // Passodes don't match, reset
          showError(
            "Passcode Setup Mismatch",
            "Passscode don't match. Please try again",
          );
          setStep("create");
          setPasscode("");
          setConfirmPasscode("");
        }
      }
    }
  };

  const handleSetupComplete = async (code: string) => {
    if (!email) {
      showError(
        "Error",
        "Emmail address is missing, please go back and try again",
      );
      return;
    }
    try {
      //API CALL TO SETUP PASSCODE
      await SetupPasscode(email, code);
      //on success, navigate to login
      router.replace("/(routes)/login");
    } catch (err) {
      showError(
        "Setup failed",
        error || "Could not set passcode.Please try again",
      );
    }
  };

  const renderPasscodeDots = (length: number) => {
    return (
      <View className="flex-row justify-center gap-4 my-8">
        {[
          ...Array(6).map((_, index) => (
            <View
              key={index}
              className={` w-4 h-4 rounded-full ${
                index < length ? "bg-blue-600" : "bg-gray-50"
              } `}
            />
          )),
        ]}
      </View>
    );
  };

  const renderNumbers = () => {
    const numbers = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      ["", "0", "⌫"],
    ];

    const currentLength =
      step === "create" ? passcode.length : confirmPasscode.length;

    return (
      <View className="mt-8">
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-around mb-4">
            {row.map((num) => (
              <TouchableOpacity
                key={num}
                onPress={() => {
                  if (num === "⌫") {
                    // Handle delete
                    if (step === "create") {
                      setPasscode(passcode.slice(0, -1));
                    } else {
                      setConfirmPasscode(confirmPasscode.slice(0, -1));
                    }
                  } else if (num && currentLength < 6) {
                    // Handle number input
                    handlePasscodeInput(
                      (step === "create" ? passcode : confirmPasscode) + num,
                    );
                  }
                }}
                disabled={num === ""}
                className={`w-20 h-20 rounded-full justify-center items-center ${
                  num === "" ? "opacity-0" : "bg-gray-100 active:bg-gray-200"
                }`}
              >
                <Text className="text-3xl font-poppins-semibold text-gray-800">
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
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
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View className="mt-12 mb-4">
              <Text className="text-3xl font-poppins-bold text-gray-900 mb-2 text-center">
                {step === "create" ? "Create Passcode" : "Confirm Passcode"}
              </Text>
              <Text className="text-gray-500 font-poppins text-base text-center">
                {step === "create"
                  ? "Create a 6-digit passcode to secure your account"
                  : "Please confirm your 6-digit passcode"}
              </Text>
            </View>

            {/* Passcode Dots */}
            {renderPasscodeDots(
              step === "create" ? passcode.length : confirmPasscode.length,
            )}

            {/* Skip for now button (only on create step) */}
            {step === "create" && (
              <TouchableOpacity
                onPress={() => router.replace("/")}
                className="mb-4"
              >
                <Text className="text-gray-500 font-poppins text-center">
                  Skip for now
                </Text>
              </TouchableOpacity>
            )}

            {/* Number Pad */}
            {renderNumbers()}
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
