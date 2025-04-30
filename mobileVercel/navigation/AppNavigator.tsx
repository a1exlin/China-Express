"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAuth } from "../contexts/AuthContext"

// Import from react-native-vector-icons instead of expo
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

// Screens
import HomeScreen from "../screens/HomeScreen"
import MenuScreen from "../screens/MenuScreen"
import CartScreen from "../screens/CartScreen"
import OrderTrackingScreen from "../screens/OrderTrackingScreen"
import ProfileScreen from "../screens/ProfileScreen"
import CheckoutScreen from "../screens/CheckoutScreen"
import OrderConfirmationScreen from "../screens/OrderConfirmationScreen"
import LoginScreen from "../screens/LoginScreen"
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen"
import AdminOrdersScreen from "../screens/admin/AdminOrdersScreen"
import AdminMenuScreen from "../screens/admin/AdminMenuScreen"
import AdminSettingsScreen from "../screens/admin/AdminSettingsScreen"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#c34428",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="restaurant-menu" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="shopping-cart" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Track"
        component={OrderTrackingScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="delivery-dining" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
      <Stack.Screen name="AdminMenu" component={AdminMenuScreen} />
      <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
    </Stack.Navigator>
  )
}

export default function AppNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    return null // Or a loading screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        user.isAdmin ? (
          <Stack.Screen name="Admin" component={AdminStack} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
          </>
        )
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}
