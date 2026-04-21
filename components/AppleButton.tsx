import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

interface AppleButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  title?: string;
  className?: string;
}

export default function AppleButton({
  onPress,
  isLoading = false,
  title = "Sign in with Apple",
  className = "",
}: AppleButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      className={`flex-row items-center justify-center bg-black border border-gray-900 rounded-xl py-4 ${className} ${
        isLoading ? "opacity-50" : "opacity-100"
      }`}
    >
      <Ionicons name="logo-apple" size={24} color="white" className="mr-3" />
      <Text className="text-white font-poppins text-center">
        {isLoading ? "Please wait..." : title}
      </Text>
    </TouchableOpacity>
  );
}
