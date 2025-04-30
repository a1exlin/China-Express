"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useAuth } from "../contexts/AuthContext"

export default function ProfileScreen() {
  const navigation = useNavigation()
  const { user, logout, loading } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          setIsLoggingOut(true)
          await logout()
          setIsLoggingOut(false)
        },
      },
    ])
  }

  const navigateToLogin = () => {
    navigation.navigate("Login" as never)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c34428" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        {user ? (
          <>
            <View style={styles.userInfoContainer}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="person-outline" size={24} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Edit Profile</Text>
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="key-outline" size={24} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Change Password</Text>
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="notifications-outline" size={24} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Notifications</Text>
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Orders</Text>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Track" as never)}>
                <Ionicons name="time-outline" size={24} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Order History</Text>
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="heart-outline" size={24} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Favorite Orders</Text>
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="location-outline" size={24} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Saved Addresses</Text>
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="language-outline" size={24} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Language</Text>
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="moon-outline" size={24} color="#333" style={styles.menuIcon} />
                <Text style={styles.menuText}>Dark Mode</Text>
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={20} color="#fff" />
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.notLoggedInContainer}>
            <Ionicons name="person-circle-outline" size={80} color="#ccc" />
            <Text style={styles.notLoggedInText}>You are not logged in</Text>
            <Text style={styles.notLoggedInSubtext}>Login to view your profile, track orders, and more.</Text>
            <TouchableOpacity style={styles.loginButton} onPress={navigateToLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#c34428",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginVertical: 12,
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#c34428",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 12,
    borderRadius: 4,
    gap: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  notLoggedInContainer: {
    padding: 24,
    alignItems: "center",
  },
  notLoggedInText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  notLoggedInSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: "#c34428",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})
