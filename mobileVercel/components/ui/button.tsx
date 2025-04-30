import type React from "react"
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View } from "react-native"

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps {
  children: React.ReactNode
  onPress?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  fullWidth?: boolean
  style?: any
}

export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  style,
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ]

  const textStyles = [styles.text, styles[`text_${variant}`], styles[`text_${size}`], disabled && styles.textDisabled]

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress} disabled={disabled || loading} activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" || variant === "link" ? "#c34428" : "#fff"}
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === "left" && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={textStyles}>{children}</Text>
          {icon && iconPosition === "right" && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  button_primary: {
    backgroundColor: "#c34428",
  },
  button_secondary: {
    backgroundColor: "#f59e0b",
  },
  button_outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#c34428",
  },
  button_ghost: {
    backgroundColor: "transparent",
  },
  button_link: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  button_destructive: {
    backgroundColor: "#ef4444",
  },
  button_sm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  button_md: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  button_lg: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  text_primary: {
    color: "#fff",
  },
  text_secondary: {
    color: "#fff",
  },
  text_outline: {
    color: "#c34428",
  },
  text_ghost: {
    color: "#c34428",
  },
  text_link: {
    color: "#c34428",
  },
  text_destructive: {
    color: "#fff",
  },
  text_sm: {
    fontSize: 14,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 18,
  },
  textDisabled: {
    color: "#999",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
})
