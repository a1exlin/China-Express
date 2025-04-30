import type React from "react"
import { StyleSheet, View, Text } from "react-native"

type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "outline"

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  style?: any
}

export function Badge({ children, variant = "default", style }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[`badge_${variant}`], style]}>
      <Text style={[styles.text, styles[`text_${variant}`]]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badge_default: {
    backgroundColor: "#e5e7eb",
  },
  badge_primary: {
    backgroundColor: "#c34428",
  },
  badge_secondary: {
    backgroundColor: "#f59e0b",
  },
  badge_success: {
    backgroundColor: "#10b981",
  },
  badge_warning: {
    backgroundColor: "#f59e0b",
  },
  badge_danger: {
    backgroundColor: "#ef4444",
  },
  badge_outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
  text_default: {
    color: "#374151",
  },
  text_primary: {
    color: "#fff",
  },
  text_secondary: {
    color: "#fff",
  },
  text_success: {
    color: "#fff",
  },
  text_warning: {
    color: "#fff",
  },
  text_danger: {
    color: "#fff",
  },
  text_outline: {
    color: "#374151",
  },
})
