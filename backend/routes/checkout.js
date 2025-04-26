import express from 'express';
import { MenuSection } from "../models/MenuSection.js"; // adjust path if needed

const router = express.Router();

router.post("/verifyCart", async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty or invalid." });
    }

    // Build a list of all item IDs to search for
    const itemIDs = cart.map(item => item.ID);

    // Find all MenuSections that contain any of these item IDs
    const sections = await MenuSection.find({ "items._id": { $in: itemIDs } });

    if (!sections.length) {
      return res.status(400).json({ message: "No matching items found in database." });
    }

    // Flatten all items from all sections
    const allItems = sections.flatMap(section => section.items);

    // Create a Map for quick lookup by item ID
    const itemMap = new Map();
    for (const item of allItems) {
      itemMap.set(item._id.toString(), item);
    }

    // Now verify each item
    const verifiedCart = cart.map(cartItem => {
      const dbItem = itemMap.get(cartItem.ID);

      if (!dbItem) {
        // Optional: you can decide what to do if an item isn't found
        throw new Error(`Item with ID ${cartItem.ID} not found.`);
      }

      const isPriceDifferent = dbItem.price !== cartItem.Price;

      return {
        ...cartItem,
        Price: dbItem.price, // Update to database price always
        priceModified: isPriceDifferent,
      };
    });

    res.status(200).json({
      message: "Cart verified.",
      verifiedCart,
    });
  } catch (error) {
    console.error("verifyCart error:", error.message);
    res.status(400).json({ message: error.message || "Cart verification failed." });
  }
});

export default router;