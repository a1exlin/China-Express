import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/CartContext"
import { SettingsProvider } from "./contexts/SettingsContext"
import AppNavigator from "./navigation/AppNavigator"
import Toast from "react-native-toast-message"

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <AuthProvider>
          <SettingsProvider>
            <CartProvider>
              <AppNavigator />
              <Toast />
            </CartProvider>
          </SettingsProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
