import { Image, Text, TouchableOpacity, View } from "react-native";

interface GoogleButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  title?: string;
  className?: string;
}

export default function GoogleButton({
  onPress,
  isLoading = false,
  title = "",
  className = "",
}: GoogleButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      className={`flex-row mb-4 items-center justify-center bg-white border border-gray-200 rounded-xl
                py-4 ${className} ${isLoading ? "opacity-50" : "opacity-100"}`}
    >
      <View className="w-6 h-6 mr-3">
        <Image
          source={{
            uri: "https://developers.google.com/identity/images/g-logo.png",
          }}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>
      <Text className="text-gray-700 font-poppins text-center">
        {isLoading ? "Please wait.." : title}
      </Text>
    </TouchableOpacity>
  );
}
