import mongoose from "mongoose"

// Define the schema for menu categories
const categorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Please provide an ID for this category"],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, "Please provide a name for this category"],
    maxlength: [30, "Name cannot be more than 30 characters"],
  },
  order: {
    type: Number,
    default: 0,
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
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema)

export default Category
