import mongoose from "mongoose"

// Define the schema for menu items
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for this item"],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  itemCode: {
    type: String,
    required: [true, "Please provide an item code"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    maxlength: [200, "Description cannot be more than 200 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
    min: [0, "Price cannot be negative"],
  },
  category: {
    type: String,
    required: [true, "Please specify a category"],
    trim: true,
  },
  image: {
    type: String,
    default: "/placeholder.svg?height=200&width=300",
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Create or retrieve the model
const MenuItem = mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema)

export default MenuItem
