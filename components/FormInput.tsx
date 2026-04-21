import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  icon: string;
  iconLibrary?: "material" | "ion";
  secureTextEntry?: boolean;
  rules?: object;
}

export default function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  icon,
  iconLibrary = "material",
  secureTextEntry,
  rules,
}: FormInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = secureTextEntry;
  const IconComponent =
    iconLibrary === "material" ? MaterialCommunityIcons : Ionicons;

  return (
    <View className="">
      <Text className="text-gray-800 text-base font-poppins-medium mb-3">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <View
              className={`flex-row items-center bg-gray-50 rounded-xl px-4 py-4
                    border ${error ? "border-red-500" : "border-gray-200"} `}
            >
              <IconComponent name={icon as any} size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-gray-800 font-poppins"
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={isPassword && !showPassword}
                autoCapitalize="none"
              />
              {isPassword && (
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              )}
            </View>
            {error && (
              <Text className="text-red-500 text-sm font-poppins mt-1">
                {error.message}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
}
