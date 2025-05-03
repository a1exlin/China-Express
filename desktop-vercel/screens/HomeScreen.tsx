import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons"
import { useSettings } from "../contexts/SettingsContext"
import FeaturedDishes from "../components/FeaturedDishes"

const { width } = Dimensions.get("window")

export default function HomeScreen() {
  const navigation = useNavigation()
  const { settings, loading } = useSettings()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <ImageBackground
          source={{ uri: "https://placehold.co/600x400/000000/FFFFFF/png" }}
          style={styles.heroBackground}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{settings.restaurantName}</Text>
              <Text style={styles.heroSubtitle}>Authentic Chinese Cuisine</Text>
              <View style={styles.divider} />
              <Text style={styles.heroText}>
                Experience the rich flavors of traditional Chinese cooking with our carefully crafted dishes, available
                for dine-in, takeout, or delivery.
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Menu" as never)}>
                  <Text style={styles.primaryButtonText}>View Our Menu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Cart" as never)}>
                  <Text style={styles.secondaryButtonText}>Order Online</Text>
                  <MaterialIcons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* Quick Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="time-outline" size={24} color="#c34428" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Opening Hours</Text>
              <Text style={styles.infoText}>{settings.openingHours}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="call-outline" size={24} color="#c34428" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Call For Order</Text>
              <Text style={styles.infoText}>{settings.phoneNumber}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="location-outline" size={24} color="#c34428" />
            </View>
            <View>
              <Text style={styles.infoTitle}>Our Location</Text>
              <Text style={styles.infoText}>{settings.address}</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <View style={styles.aboutContent}>
            <Text style={styles.aboutTitle}>{settings.restaurantName}</Text>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <FontAwesome key={i} name="star" size={16} color="#f1bc38" />
              ))}
            </View>
            <Text style={styles.aboutText}>
              Welcome to {settings.restaurantName}, where authentic Chinese cuisine meets modern dining experience. For
              over 20 years, we've been serving the community with traditional recipes passed down through generations,
              using only the freshest ingredients and traditional cooking techniques.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Menu" as never)}>
                <Text style={styles.primaryButtonText}>View Our Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Image source={{ uri: "https://placehold.co/600x400/FFFFFF/CCCCCC/png" }} style={styles.aboutImage} />
        </View>

        {/* Featured Dishes */}
        <FeaturedDishes />

        {/* Order Online CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Order?</Text>
          <Text style={styles.ctaText}>
            Enjoy our delicious meals from the comfort of your home. We offer quick delivery and easy online ordering.
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate("Menu" as never)}>
            <Text style={styles.ctaButtonText}>Order Online Now</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heroBackground: {
    height: 400,
    width: "100%",
  },
  heroOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heroContent: {
    alignItems: "center",
    maxWidth: 600,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: "#f1bc38",
    marginBottom: 16,
  },
  heroText: {
    fontSize: 16,
    color: "#e0e0e0",
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#c34428",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    borderColor: "#fff",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  infoSection: {
    padding: 16,
    flexDirection: "column",
    gap: 16,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1bc38",
    justifyContent: "center",
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  aboutSection: {
    padding: 24,
    backgroundColor: "#f5f5f5",
  },
  aboutContent: {
    marginBottom: 24,
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 24,
    lineHeight: 24,
  },
  aboutImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  ctaSection: {
    padding: 24,
    backgroundColor: "#c34428",
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  ctaText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
    maxWidth: 500,
  },
  ctaButton: {
    backgroundColor: "#f1bc38",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ctaButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
})
