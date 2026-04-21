import { useAccount } from "@/services/account";
import { useTransactions } from "@/services/transaction";
import { useAuthStore } from "@/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const [filter, setFilter] = useState<
    "all" | "DEPOSIT" | "WITHDRAW" | "TRANSFER"
  >("all");
  const backendType = filter === "all" ? undefined : filter;
  const logout = useAuthStore((state) => state.logout);
  const {
    data: account,
    isLoading: accountLoading,
    refetch: refetchAccount,
  } = useAccount();
  const {
    data: transactions,
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
  } = useTransactions({
    page: 1,
    limit: 10,
    type: backendType,
  });

  // Refresh data when screen comes into focus (after returning from deposit)
  useFocusEffect(
    useCallback(() => {
      refetchAccount();
      refetchTransactions();
    }, [refetchAccount, refetchTransactions]),
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Helper to format date from backend's createdAt (ISO string)
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTransactionIcon = (type: string) => {
    const t = type?.toLowerCase();
    switch (t) {
      case "deposit":
        return "arrow-down-circle";
      case "withdraw":
        return "arrow-up-circle";
      case "transfer":
        return "swap-horizontal";
      default:
        return "receipt";
    }
  };

  const getTransactionColor = (type: string) => {
    const t = type?.toLowerCase();
    switch (t) {
      case "deposit":
        return "text-green-600";
      case "withdraw":
        return "text-red-600";
      default:
        return "text-gray-700";
    }
  };

  const getAmountPrefix = (type: string) => {
    return type?.toLowerCase() === "deposit" ? "+" : "-";
  };

  // Placeholder actions (replace with navigation later)
  const handleDeposit = () => router.push("/deposit");
  const handleWithdraw = () => router.push("/withdraw");
  const handleTransfer = () => router.push("/transfer");
  const handleSeeAll = () => router.push("/transactions");

  const handleLogout = async () => {
    await logout();
    router.replace("/(routes)/login");
  };

  if (accountLoading || transactionsLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  const balance = account?.balance ?? 0;
  const accountNumber =
    user?.accountNumber ?? account?.data?.accountNumber ?? "••••••••";
  const userName = user?.name ?? account?.data?.name ?? "User";

  const transactionList = transactions?.transactions ?? [];
  const hasTransactions = transactionList.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={accountLoading || transactionsLoading}
            onRefresh={() => {
              refetchAccount();
              refetchTransactions();
            }}
          />
        }
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center pt-4 pb-2">
          <View>
            <Text className="text-2xl font-poppins-bold text-gray-900">
              Welcome back,
            </Text>
            <Text className="text-xl font-poppins-semibold text-gray-700">
              {userName} 👋
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View className="bg-blue-600 rounded-2xl p-6 mt-2 shadow-md">
          <Text className="text-white/80 text-sm font-poppins mb-1">
            Total Balance
          </Text>
          <Text className="text-white text-4xl font-poppins-bold">
            {formatCurrency(balance)}
          </Text>
          <Text className="text-white/70 text-xs font-poppins mt-2">
            Account: {accountNumber}
          </Text>
        </View>

        {/* Quick Actions Grid */}
        <View className="flex-row flex-wrap justify-between mt-6">
          <ActionButton
            icon="add-circle-outline"
            label="Deposit"
            onPress={handleDeposit}
            color="#10b981"
          />
          <ActionButton
            icon="remove-circle-outline"
            label="Withdraw"
            onPress={handleWithdraw}
            color="#ef4444"
          />
          <ActionButton
            icon="swap-horizontal-outline"
            label="Transfer"
            onPress={handleTransfer}
            color="#3b82f6"
          />
          <ActionButton
            icon="time-outline"
            label="History"
            onPress={handleSeeAll}
            color="#6b7280"
          />
        </View>

        {/* Recent Transactions */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-poppins-semibold text-gray-800">
              Recent Transactions
            </Text>
            <TouchableOpacity onPress={handleSeeAll}>
              <Text className="text-blue-600 font-poppins text-sm">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          {hasTransactions ? (
            transactionList.slice(0, 5).map((tx: any) => (
              <View
                key={tx?.id}
                className="bg-white rounded-xl p-4 mb-3 flex-row justify-between items-center shadow-sm"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                    <Ionicons
                      name={getTransactionIcon(tx?.type)}
                      size={22}
                      color={getTransactionColor(tx?.type).replace("text-", "")}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-poppins-semibold text-gray-800 capitalize">
                      {tx.type?.toLowerCase()}
                    </Text>
                    <Text className="text-xs text-gray-400 font-poppins">
                      {formatDate(tx?.createdAt)}
                    </Text>
                    {tx.counterparty && (
                      <Text className="text-xs text-gray-500 mt-0.5">
                        {tx.counterparty}
                      </Text>
                    )}
                    {tx.description && (
                      <Text className="text-xs text-gray-400 mt-0.5 italic">
                        {tx.description}
                      </Text>
                    )}
                  </View>
                </View>
                <Text
                  className={`font-poppins-semibold ${getTransactionColor(tx.type)}`}
                >
                  {getAmountPrefix(tx?.type)}
                  {formatCurrency(tx?.amount)}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-center text-gray-500 font-poppins mt-4">
              No transactions yet
            </Text>
          )}
        </View>

        {/* Extra spacing at bottom */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable Quick Action Button Component
interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color: string;
}

const ActionButton = ({ icon, label, onPress, color }: ActionButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="w-[22%] bg-white rounded-xl py-3 items-center shadow-sm"
    activeOpacity={0.7}
  >
    <Ionicons name={icon} size={28} color={color} />
    <Text className="text-xs font-poppins text-gray-600 mt-1">{label}</Text>
  </TouchableOpacity>
);
