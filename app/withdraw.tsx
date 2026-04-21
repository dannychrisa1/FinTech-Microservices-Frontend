import CustomModal from "@/components/CustomModal";
import { useModal } from "@/hooks/useModal";
import { useAccount } from "@/services/account";
import api from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WithdrawScreen() {
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { modal, showSuccess, showError, hideModal } = useModal();
  const { data: account, refetch: refetchAccount } = useAccount();

  const balance = account?.balance ?? 0;

  const handleWithdraw = async () => {
    const numAmount = parseFloat(amount);

    // Validation
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      showError("Error", "Please enter a valid amount");
      return;
    }

    if (numAmount > balance) {
      showError("Error", "Insufficient balance");
      return;
    }

    if (!destination.trim()) {
      showError("Error", "Please enter destination account/bank details");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/account/withdraw", {
        accountNumber: user?.accountNumber,
        amount: numAmount,
      });

      if (response.data) {
        showSuccess(
          "Withdrawal Request Submitted",
          `₦${numAmount.toLocaleString()} will be sent to ${destination}\n\nFunds will be processed within 1-2 business days.`,
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Withdrawal failed. Please try again.";
      showError("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView className="flex-1 px-5">
          {/* Header */}
          <View className="flex-row items-center mt-2 mb-6">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text className="text-2xl font-poppins-bold text-gray-900">
              Withdraw Funds
            </Text>
          </View>

          {/* Balance Info */}
          <View className="bg-blue-50 rounded-xl p-4 mb-6">
            <Text className="text-gray-600 font-poppins">
              Available Balance
            </Text>
            <Text className="text-2xl font-poppins-bold text-blue-800">
              ₦
              {balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>

          {/* Amount Input */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <Text className="text-gray-500 font-poppins mb-2">
              Amount (₦ NGN)
            </Text>
            <View className="flex-row items-center border-b border-gray-200 pb-2">
              <Text className="text-2xl font-poppins text-gray-800 mr-2">
                ₦
              </Text>
              <TextInput
                className="flex-1 text-2xl font-poppins text-gray-800"
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Destination Input */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <Text className="text-gray-500 font-poppins mb-2">
              Withdraw to (Bank Account)
            </Text>
            <TextInput
              className="border-b border-gray-200 pb-2 text-gray-800 font-poppins"
              placeholder="Bank name & account number"
              value={destination}
              onChangeText={setDestination}
              editable={!isLoading}
            />
            <Text className="text-xs text-gray-400 mt-2">
              Funds will be sent to this account within 1-2 business days
            </Text>
          </View>

          {/* Withdraw Button */}
          <TouchableOpacity
            onPress={handleWithdraw}
            disabled={isLoading}
            className={`rounded-xl py-4 mb-6 ${isLoading ? "bg-gray-400" : "bg-red-600"}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-poppins-semibold text-lg">
                Confirm Withdrawal
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
