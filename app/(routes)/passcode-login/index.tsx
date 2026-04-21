import CustomModal from "@/components/CustomModal";
import { useModal } from "@/hooks/useModal";
import { useAuthStore } from "@/stores/authStore";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PasscodeLoginScreen() {
  const [passcode, setPasscode] = useState("");
  const logout = useAuthStore((state) => state.logout);
  const unlock = useAuthStore((state) => state.unlock);
  const [isLoading, setIsLoading] = useState(false);
  const loginWithPasscode = useAuthStore((state) => state.loginWithPasscode);
  const user = useAuthStore((state) => state.user);
  const clearError = useAuthStore((state) => state.clearError);
  const error = useAuthStore((state) => state.error);
  const { modal, showError, hideModal } = useModal();

  const handlePasscodeComplete = async (code: string) => {
    if (!user?.email) {
      showError("Error", "Please login with email first");
      router.replace("/(routes)/login");
      return;
    }

    setIsLoading(true);
    try {
      await loginWithPasscode(user.email, code);
      unlock();
      router.replace("/(tabs)");
    } catch (err: any) {
      const errorMessage = err?.message || error || "Invalid passcode";
      showError("Login Failed", errorMessage);
      clearError();
      setPasscode("");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasscodeDots = (length: number) => {
    return (
      <View className="flex-row justify-center gap-4 my-8">
        {[...Array(6)].map((_, index) => (
          <View
            key={index}
            className={`w-4 h-4 rounded-full ${
              index < length ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
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

    return (
      <View className="mt-8">
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-around mb-4">
            {row.map((num) => (
              <TouchableOpacity
                key={num}
                onPress={() => {
                  if (num === "⌫") {
                    setPasscode((prev) => prev.slice(0, -1));
                  } else if (num && passcode.length < 6) {
                    const newCode = passcode + num;
                    setPasscode(newCode);
                    if (newCode.length === 6) {
                      handlePasscodeComplete(newCode);
                    }
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
        <View className="flex-1 justify-center px-6">
          <Text className="text-2xl font-poppins-bold text-gray-900 text-center mb-2">
            Enter Passcode
          </Text>
          <Text className="text-gray-500 font-poppins text-center mb-8">
            Use your 6-digit passcode to login
          </Text>

          {renderPasscodeDots(passcode.length)}
          {renderNumbers()}

          <TouchableOpacity
            onPress={async () => {
              await logout();
              router.replace("/(routes)/login");
            }}
          >
            <Text className="text-blue-600 font-poppins text-center">
              Sign out
            </Text>
          </TouchableOpacity>
        </View>
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
