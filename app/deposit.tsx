import CustomModal from "@/components/CustomModal";
import { useModal } from "@/hooks/useModal";
import { useVerifyPayment } from "@/services/payment";
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
import { usePaystack } from "react-native-paystack-webview";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DepositScreen() {
  const [amount, setAmount] = useState("");
  const { modal, showSuccess, showError, hideModal } = useModal();
  const user = useAuthStore((state) => state.user);
  const verifyPayment = useVerifyPayment();
  const { popup } = usePaystack();

  const generateReference = () => {
    return `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  };

  const handleDeposit = () => {
    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      showError("Invalid Amount", "Please enter a valid amount");
      return;
    }

    if (!user?.email) {
      showError("Error", "User email not found. Please log in again.");
      return;
    }

    const reference = generateReference();

    popup.checkout({
      reference,
      email: user.email,
      amount: amountNum,
      onSuccess: async (response: any) => {
        try {
          const { amountPaid, depositDetails } =
            await verifyPayment.mutateAsync(reference);
          showSuccess(
            "Deposit Successful! 🎉",
            `₦${amountPaid.toLocaleString()} has been added to your wallet.\n\nNew balance: ₦${depositDetails.balance.toLocaleString()}`,
          );
          setAmount("");
        } catch (error: any) {
          showError(
            "Verification Failed",
            error.message || "Could not verify payment",
          );
        }
      },
      onCancel: () => {
        showError("Payment Cancelled", "You cancelled the payment");
      },
      onError: (error: any) => {
        showError("Payment Error", error.message || "Something went wrong");
      },
    });
  };

  const isLoading = verifyPayment.isPending;

  return (
    <>
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView className="flex-1 px-5">
          {/* Header with back button */}
          <View className="flex-row items-center mt-2 mb-6">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text className="text-2xl font-poppins-bold text-gray-900">
              Deposit Funds
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
                autoFocus
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Payment Methods Info */}
          <Text className="text-gray-700 font-poppins-semibold mb-3">
            Payment Methods
          </Text>
          <View className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
            <View className="flex-row items-center mb-2">
              <Ionicons name="card-outline" size={20} color="#3b82f6" />
              <Text className="ml-3 font-poppins text-gray-700">
                Card (Visa, Mastercard, Verve)
              </Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="business-outline" size={20} color="#3b82f6" />
              <Text className="ml-3 font-poppins text-gray-700">
                Bank Transfer
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name="phone-portrait-outline"
                size={20}
                color="#3b82f6"
              />
              <Text className="ml-3 font-poppins text-gray-700">
                USSD / Mobile Money
              </Text>
            </View>
          </View>

          {/* Deposit Button */}
          <TouchableOpacity
            onPress={handleDeposit}
            disabled={isLoading}
            className={`rounded-xl py-4 mb-6 ${isLoading ? "bg-gray-400" : "bg-blue-600"}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-poppins-semibold text-lg">
                Continue to Paystack
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* Custom Modal for success/error messages */}
      <CustomModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => {
          hideModal();
          if (modal.type === "success") {
            router.back();
          }
        }}
      />
    </>
  );
}
