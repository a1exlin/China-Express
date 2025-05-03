"use client"

import type React from "react"
import { useState } from "react"
import { StyleSheet, TextInput, View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface InputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  label?: string
  error?: string
  secureTextEntry?: boolean
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad" | "decimal-pad"
  autoCapitalize?: "none" | "sentences" | "words" | "characters"
  multiline?: boolean
  numberOfLines?: number
  style?: any
  disabled?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  onIconPress?: () => void
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
  multiline = false,
  numberOfLines = 1,
  style,
  disabled = false,
  icon,
  iconPosition = "left",
  onIconPress,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible)

  const inputStyles = [
    styles.input,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    disabled && styles.inputDisabled,
    multiline && styles.inputMultiline,
    icon && iconPosition === "left" && { paddingLeft: 40 },
    icon && iconPosition === "right" && { paddingRight: 40 },
    style,
  ]

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {icon && iconPosition === "left" && (
          <TouchableOpacity style={styles.iconLeft} onPress={onIconPress} disabled={!onIconPress}>
            {icon}
          </TouchableOpacity>
        )}

        <TextInput
          style={inputStyles}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
        />

        {secureTextEntry && (
          <TouchableOpacity style={styles.iconRight} onPress={togglePasswordVisibility}>
            <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#666" />
          </TouchableOpacity>
        )}

        {icon && iconPosition === "right" && !secureTextEntry && (
          <TouchableOpacity style={styles.iconRight} onPress={onIconPress} disabled={!onIconPress}>
            {icon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  inputFocused: {
    borderColor: "#c34428",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  iconLeft: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  iconRight: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
})
