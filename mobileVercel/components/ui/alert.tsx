import { StyleSheet, View, Text } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'

type AlertVariant = "default" | "success" | "warning" | "error" | "info"

interface AlertProps {
  title?: string
  description: string
  variant?: AlertVariant
  style?: any
}

export function Alert({ title, description, variant = "default", style }: AlertProps) {
  const getIconName = () => {
    switch (variant) {
      case "success":
        return "checkmark-circle"
      case "warning":
        return "warning"
      case "error":
        return "alert-circle"
      case "info":
        return "information-circle"
      default:
        return "information-circle"
    }
  }

  const getIconColor = () => {
    switch (variant) {
      case "success":
        return "#10b981"
      case "warning":
        return "#f59e0b"
      case "error":
        return "#ef4444"
      case "info":
        return "#3b82f6"
      default:
        return "#6b7280"
    }
  }

  return (
    <View style={[styles.alert, styles[`alert_${variant}`], style]}>
      <View style={styles.iconContainer}>
        <Ionicons name={getIconName()} size={24} color={getIconColor()} />
      </View>
      <View style={styles.content}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  alert: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  alert_default: {
    backgroundColor: "#f9fafb",
    borderLeftWidth: 4,
    borderLeftColor: "#6b7280",
  },
  alert_success: {
    backgroundColor: "#ecfdf5",
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  alert_warning: {
    backgroundColor: "#fffbeb",
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  alert_error: {
    backgroundColor: "#fef2f2",
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  alert_info: {
    backgroundColor: "#eff6ff",
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#4b5563",
  },
})
