import ConfirmationModal from "@/components/ConfirmationModal";
import { useAccount } from "@/services/account";
import { useAuthStore } from "@/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileTab() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { data: account } = useAccount();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace("/(routes)/login");
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 px-5">
          <View className="mt-4 mb-6">
            <Text className="text-2xl font-poppins-bold text-gray-900">
              Profile
            </Text>
            <Text className="text-gray-500 font-poppins">
              Manage your account
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center">
              <Text className="text-2xl font-poppins-bold text-blue-600">
                {user?.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-poppins-semibold text-gray-900">
                {user?.name}
              </Text>
              <Text className="text-gray-500 font-poppins text-sm">
                {user?.email}
              </Text>
              <Text className="text-gray-400 font-poppins text-xs mt-1">
                Account: {user?.accountNumber}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setShowLogoutModal(true)}
            className="bg-red-50 rounded-xl py-4 mt-6 flex-row items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text className="text-red-600 font-poppins-semibold ml-2">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        confirmButtonStyle="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}
