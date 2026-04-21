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
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransferScreen() {
  const [amount, setAmount] = useState("");
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { modal, showSuccess, showError, hideModal } = useModal();

  const user = useAuthStore((state) => state.user);
  const { data: account, refetch: refetchAccount } = useAccount();

  const balance = account?.balance ?? 0;

  const handleTransfer = async () => {
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

    if (!recipientAccountNumber.trim()) {
      showError("Error", "Please enter recipient's account number");
      return;
    }

    if (recipientAccountNumber === user?.accountNumber) {
      showError("Error", "You cannot transfer to your own account");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/account/transfer", {
        fromAccount: user?.accountNumber,
        toAccount: recipientAccountNumber,
        amount: numAmount,
      });

      if (response.data) {
        showSuccess(
          "Transfer Successful",
          `₦${numAmount.toLocaleString()} has been sent to account ${recipientAccountNumber}`,
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Transfer failed. Please try again.";
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
              Transfer Money
            </Text>
          </View>

          {/* Balance hint */}
          <View className="bg-gray-100 rounded-xl p-3 mb-6">
            <Text className="text-gray-600 font-poppins text-center">
              Available: ₦
              {balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>

          {/* Recipient Account Number */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-4">
            <Text className="text-gray-500 font-poppins mb-2">
              Recipient's Account Number
            </Text>
            <TextInput
              className="border-b border-gray-200 pb-2 text-gray-800 font-poppins"
              placeholder="Enter 10-digit account number"
              value={recipientAccountNumber}
              onChangeText={setRecipientAccountNumber}
              autoCapitalize="none"
              keyboardType="numeric"
              editable={!isLoading}
            />
          </View>

          {/* Amount */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-4">
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

          {/* Optional note */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <Text className="text-gray-500 font-poppins mb-2">
              Note (optional)
            </Text>
            <TextInput
              className="border-b border-gray-200 pb-2 text-gray-800 font-poppins"
              placeholder="What's this for?"
              value={note}
              onChangeText={setNote}
              editable={!isLoading}
            />
          </View>

          {/* Transfer Button */}
          <TouchableOpacity
            onPress={handleTransfer}
            disabled={isLoading}
            className={`rounded-xl py-4 mb-6 ${isLoading ? "bg-gray-400" : "bg-blue-600"}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-poppins-semibold text-lg">
                Send Money
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
