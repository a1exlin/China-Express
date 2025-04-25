import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema({
  code: String,
  name: String,
  price: Number,
  description: String
});

// MenuSection Schema (Menu categories, e.g., "Appetizers", "Meat Dishes")
const MenuSectionSchema = new mongoose.Schema({
  slug: String,  // e.g. "fried-rice", "chicken-dishes"
  title: String, // e.g. "Fried Rice", "Chicken Dishes"
  description: String, // optional subtitle
  imageUrl: String,
  items: [MenuItemSchema], // List of items in this section
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuSection" }], // Children sections (subsections)
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "MenuSection", default: null } // Parent section (if this is a subsection or sub-subsection)
});

export const MenuSection = mongoose.model("MenuSection", MenuSectionSchema);
