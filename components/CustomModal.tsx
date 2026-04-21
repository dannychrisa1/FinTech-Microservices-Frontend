import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomModalProps {
  visible: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export default function CustomModal({
  visible,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Ok",
  cancelText = "Cancel",
  showCancel = false,
}: CustomModalProps) {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleValue.setValue(0);
      opacityValue.setValue(0);
    }
  }, [visible]);

  const getIconConfig = () => {
    switch (type) {
      case "success":
        return {
          name: "checkmark-circle",
          color: "#10b981",
          bgColor: "#d1fae5",
        };
      case "error":
        return {
          name: "close-circle",
          color: "#ef4444",
          bgColor: "#fee2e2",
        };
      default:
        return {
          name: "information-circle",
          color: "#3b82f6",
          bgColor: "#dbeafe",
        };
    }
  };

  const iconConfig = getIconConfig();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 justify-center items-center bg-black/50"
        onPress={onClose}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          }}
          className="w-[85%] bg-white rounded-2xl p-6 shadow-xl"
        >
          {/* Icon */}
          <View className="items-center mb-4">
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: iconConfig.bgColor }}
            >
              <Ionicons
                name={iconConfig.name as any}
                size={40}
                color={iconConfig.color}
              />
            </View>
          </View>

          {/* Title */}
          <Text className="text-xl font-poppins-bold text-gray-900 text-center mb-2">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-gray-600 font-poppins text-center mb-6">
            {message}
          </Text>

          {/* Buttons */}
          <View className="flex-row gap-3">
            {showCancel && (
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 py-3 rounded-xl bg-gray-100"
              >
                <Text className="text-gray-700 font-poppins-semibold text-center">
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleConfirm}
              className={`flex-1 py-3 rounded-xl ${
                type === "success"
                  ? "bg-green-500"
                  : type === "error"
                    ? "bg-red-500"
                    : "bg-blue-500"
              }`}
            >
              <Text className="text-white font-poppins-semibold text-center">
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
