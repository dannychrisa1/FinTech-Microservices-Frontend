import { Text, View } from "react-native";

interface DividerProps {
  text?: string;
  className?: string;
}

export default function Divider({
  text = "Or continue with",
  className = "",
}: DividerProps) {
  return (
    <View className={`flex-row items-center my-8 ${className}`}>
      <View className="flex-1 h-px bg-gray-300" />
      <Text className="mx-4 text-gray-500 font-poppins font-medium">
        {text}
      </Text>
      <View className="flex-1 h-px bg-gray-300" />
    </View>
  );
}
