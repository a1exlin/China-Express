import { StyleSheet, View } from "react-native"

type SeparatorOrientation = "horizontal" | "vertical"

interface SeparatorProps {
  orientation?: SeparatorOrientation
  style?: any
}

export function Separator({ orientation = "horizontal", style }: SeparatorProps) {
  return <View style={[styles.separator, orientation === "horizontal" ? styles.horizontal : styles.vertical, style]} />
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "#e5e7eb",
  },
  horizontal: {
    height: 1,
    width: "100%",
    marginVertical: 8,
  },
  vertical: {
    width: 1,
    height: "100%",
    marginHorizontal: 8,
  },
})
