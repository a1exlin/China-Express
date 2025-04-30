import type React from "react"
import { StyleSheet, View, Text } from "react-native"

interface CardProps {
  children: React.ReactNode
  style?: any
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>
}

interface CardHeaderProps {
  children: React.ReactNode
  style?: any
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return <View style={[styles.header, style]}>{children}</View>
}

interface CardTitleProps {
  children: React.ReactNode
  style?: any
}

export function CardTitle({ children, style }: CardTitleProps) {
  return <Text style={[styles.title, style]}>{children}</Text>
}

interface CardDescriptionProps {
  children: React.ReactNode
  style?: any
}

export function CardDescription({ children, style }: CardDescriptionProps) {
  return <Text style={[styles.description, style]}>{children}</Text>
}

interface CardContentProps {
  children: React.ReactNode
  style?: any
}

export function CardContent({ children, style }: CardContentProps) {
  return <View style={[styles.content, style]}>{children}</View>
}

interface CardFooterProps {
  children: React.ReactNode
  style?: any
}

export function CardFooter({ children, style }: CardFooterProps) {
  return <View style={[styles.footer, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
})
