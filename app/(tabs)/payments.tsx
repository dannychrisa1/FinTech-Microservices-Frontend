import { useAccount } from "@/services/account";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentsTab() {
  const { data: account } = useAccount();
  const balance = account?.balance ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-5">
        <View className="mt-4 mb-6">
          <Text className="text-2xl font-poppins-bold text-gray-900">
            Payments
          </Text>
          <Text className="text-gray-500 font-poppins">Manage your money</Text>
        </View>

        <View className="bg-blue-600 rounded-2xl p-6 mb-6 shadow-md">
          <Text className="text-white/80 text-sm font-poppins mb-1">
            Available Balance
          </Text>
          <Text className="text-white text-3xl font-poppins-bold">
            ₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => router.push("/deposit")}
            className="bg-white rounded-xl p-5 flex-row items-center shadow-sm"
          >
            <View className="w-12 h-12 rounded-full items-center justify-center bg-green-100">
              <Ionicons name="add-circle-outline" size={24} color="#10b981" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="font-poppins-semibold text-gray-800 text-base">
                Deposit
              </Text>
              <Text className="text-gray-500 font-poppins text-xs">
                Add money to your wallet
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/withdraw")}
            className="bg-white rounded-xl p-5 flex-row items-center shadow-sm"
          >
            <View className="w-12 h-12 rounded-full items-center justify-center bg-red-100">
              <Ionicons
                name="remove-circle-outline"
                size={24}
                color="#ef4444"
              />
            </View>
            <View className="flex-1 ml-4">
              <Text className="font-poppins-semibold text-gray-800 text-base">
                Withdraw
              </Text>
              <Text className="text-gray-500 font-poppins text-xs">
                Withdraw to bank account
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/transfer")}
            className="bg-white rounded-xl p-5 flex-row items-center shadow-sm"
          >
            <View className="w-12 h-12 rounded-full items-center justify-center bg-blue-100">
              <Ionicons
                name="swap-horizontal-outline"
                size={24}
                color="#3b82f6"
              />
            </View>
            <View className="flex-1 ml-4">
              <Text className="font-poppins-semibold text-gray-800 text-base">
                Transfer
              </Text>
              <Text className="text-gray-500 font-poppins text-xs">
                Send to another user
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
