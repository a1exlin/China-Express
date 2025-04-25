import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MenuSection } from '../models/MenuSection.js'; // Adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://alexjphillipson:gPCfzXrVyniq3NcN@cluster0.hbjkwse.mongodb.net/China_Express?retryWrites=true&w=majority&appName=Cluster0s";

const seedMenu = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB for seeding');

    // Clean existing data before seeding
    await MenuSection.deleteMany();

    // Create Appetizers section with items
    const appetizers = await MenuSection.create({
      slug: "appetizers",
      title: "Appetizers",
      description: "Start your meal right",
      imageUrl: "/images/appetizers.jpg",
      items: [
        { code: "A1", name: "Egg Roll", price: 1.79, description: "Classic chicken egg roll, crispy and savory." },
        { code: "A2", name: "Shrimp Egg Roll", price: 1.79, description: "Crispy egg roll filled with shrimp." },
        { code: "A3", name: "Spring Egg Roll", price: 1.79, description: "Vegetarian-style crispy spring rolls." },
        { code: "A4", name: "Steamed Dumplings", price: 7.25, description: "Steamed pork dumplings." }
      ],
      children: [],
    });

    // Create Chicken Dishes with items
    const chickenDishes = await MenuSection.create({
      slug: "chicken-dishes",
      title: "Chicken Dishes",
      description: "Tasty chicken options",
      imageUrl: "/images/chicken.jpg",
      items: [
        { code: "C1", name: "General Tso's Chicken", price: 10.95, description: "Sweet, spicy & crispy." },
        { code: "C2", name: "Sesame Chicken", price: 10.75, description: "Tender chicken with sesame seeds." }
      ],
      children: [],
    });

    // Create Beef Dishes with items
    const beefDishes = await MenuSection.create({
      slug: "beef-dishes",
      title: "Beef Dishes",
      description: "Delicious beef options",
      imageUrl: "/images/beef.jpg",
      items: [
        { code: "B1", name: "Beef with Broccoli", price: 11.25, description: "Tender beef with fresh broccoli." },
        { code: "B2", name: "Pepper Steak", price: 12.00, description: "Beef with peppers in savory sauce." }
      ],
      children: [],
    });

    // Create Meat Dishes section that references Chicken and Beef dishes
    await MenuSection.create({
      slug: "meat-dishes",
      title: "Meat Dishes",
      description: "Meat lovers' favorites",
      imageUrl: "/images/meat.jpg",
      items: [],
      children: [chickenDishes._id, beefDishes._id] // Reference the Chicken and Beef sections
    });

    console.log("✅ Seeded Menu Data Successfully!");
  } catch (err) {
    console.error("❌ Error during seeding:", err);
  } finally {
    mongoose.disconnect();
  }
};

seedMenu();
