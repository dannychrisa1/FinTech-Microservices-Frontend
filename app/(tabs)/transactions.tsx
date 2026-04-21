import { useTransactions } from "@/services/transaction";
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

export default function TransactionHistoryScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "DEPOSIT" | "WITHDRAW" | "TRANSFER"
  >("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Convert frontend filter to backend type
  const backendType = filter === "all" ? undefined : filter;

  const { data, isLoading, refetch } = useTransactions({
    page,
    limit,
    type: backendType,
  });

  const transactions = data?.transactions ?? [];
  const meta = data?.meta;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

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

  const getAmountPrefix = (type: string) =>
    type?.toLowerCase() === "deposit" ? "+" : "-";

  // Filter by search term on the frontend (since backend search isn't implemented yet)
  const filteredTransactions = transactions.filter((tx: any) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      tx.counterparty?.toLowerCase().includes(searchLower) ||
      tx.description?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading && page === 1) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5">
        {/* Header */}
        <View className="flex-row items-center mt-2 mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-2xl font-poppins-bold text-gray-900">
            Transaction History
          </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-xl px-4 py-2 mb-4 shadow-sm">
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 font-poppins text-gray-800"
            placeholder="Search by counterparty or description"
            value={search}
            onChangeText={setSearch}
          />
          {search !== "" && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className=""
        >
          <View className="flex-row items-start space-x-2">
            {(["all", "DEPOSIT", "WITHDRAW", "TRANSFER"] as const).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full ${
                  filter === f ? "bg-blue-600" : "bg-white"
                }`}
              >
                <Text
                  className={`font-poppins capitalize ${
                    filter === f ? "text-white" : "text-gray-700"
                  }`}
                >
                  {f === "all" ? "All" : f.toLowerCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Transactions List */}
        <ScrollView className="mt-10" showsVerticalScrollIndicator={false}>
          {filteredTransactions.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center justify-center">
              <Ionicons name="receipt-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-400 font-poppins mt-2">
                No transactions found
              </Text>
            </View>
          ) : (
            filteredTransactions.map((tx: any) => (
              <View
                key={tx.id}
                className="bg-white rounded-xl p-4 mb-3 flex-row justify-between items-center shadow-sm"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                    <Ionicons
                      name={getTransactionIcon(tx.type)}
                      size={22}
                      color={getTransactionColor(tx.type).replace("text-", "")}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-poppins-semibold text-gray-800 capitalize">
                      {tx.type.toLowerCase()}
                    </Text>
                    <Text className="text-xs text-gray-400 font-poppins">
                      {formatDate(tx.createdAt)}
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
                  {getAmountPrefix(tx.type)}
                  {formatCurrency(tx.amount)}
                </Text>
              </View>
            ))
          )}

          {/* Pagination controls (simple) */}
          {meta && meta.totalPages > 1 && (
            <View className="flex-row justify-center items-center py-4 gap-4">
              <TouchableOpacity
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg ${page === 1 ? "bg-gray-200" : "bg-blue-600"}`}
              >
                <Text className={page === 1 ? "text-gray-500" : "text-white"}>
                  Previous
                </Text>
              </TouchableOpacity>
              <Text className="font-poppins text-gray-700">
                Page {page} of {meta.totalPages}
              </Text>
              <TouchableOpacity
                onPress={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className={`px-4 py-2 rounded-lg ${page === meta.totalPages ? "bg-gray-200" : "bg-blue-600"}`}
              >
                <Text
                  className={
                    page === meta.totalPages ? "text-gray-500" : "text-white"
                  }
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View className="h-8" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
