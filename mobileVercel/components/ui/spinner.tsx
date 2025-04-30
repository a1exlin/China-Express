import { StyleSheet, View, ActivityIndicator } from "react-native"

type SpinnerSize = "small" | "large"
type SpinnerColor = "primary" | "white" | "gray"

interface SpinnerProps {
  size?: SpinnerSize
  color?: SpinnerColor
  style?: any
}

export function Spinner({ size = "small", color = "primary", style }: SpinnerProps) {
  const getColor = () => {
    switch (color) {
      case "primary":
        return "#c34428"
      case "white":
        return "#ffffff"
      case "gray":
        return "#9ca3af"
      default:
        return "#c34428"
    }
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={getColor()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
})
