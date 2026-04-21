import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

interface FacebookButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  title?: string;
  className?: string;
}

export default function FacebookButton({
  onPress,
  isLoading = false,
  title = "",
  className = "",
}: FacebookButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      className={`flex-row mb-4 items-center justify-center bg-white border border-gray-200 rounded-xl py-4 ${className} ${
        isLoading ? "opacity-50" : "opacity-100"
      }`}
    >
      <Ionicons
        name="logo-facebook"
        size={24}
        color="#1877f2"
        className="mr-3"
      />
      <Text className="text-gray-700 font-poppins text-center">
        {isLoading ? "Please wait..." : title}
      </Text>
    </TouchableOpacity>
  );
}
