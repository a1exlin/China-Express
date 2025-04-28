import mongoose from "mongoose"

// Define the schema for restaurant settings
const settingsSchema = new mongoose.Schema({
  taxPercentage: {
    type: Number,
    required: [true, "Please provide a tax percentage"],
    default: 8.25,
    min: [0, "Tax percentage cannot be negative"],
  },
  deliveryFee: {
    type: Number,
    required: [true, "Please provide a delivery fee"],
    default: 3.99,
    min: [0, "Delivery fee cannot be negative"],
  },
  serviceCharge: {
    type: Number,
    default: 0,
    min: [0, "Service charge cannot be negative"],
  },
  minimumOrderAmount: {
    type: Number,
    default: 0,
    min: [0, "Minimum order amount cannot be negative"],
  },
  restaurantName: {
    type: String,
    default: "China Express",
  },
  phoneNumber: {
    type: String,
    default: "(555) 123-4567",
  },
  address: {
    type: String,
    default: "123 Main Street, Anytown",
  },
  openingHours: {
    type: String,
    default: "Mon-Sun: 11:00 AM - 10:00 PM",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Create or retrieve the model
const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema)

export default Settings
