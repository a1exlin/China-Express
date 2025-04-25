import express from 'express';
import { MenuSection } from '../models/MenuSection.js';

const router = express.Router();

// Get all menu sections, populated recursively
// Fetch only top-level sections (parent: null)
router.get("/", async (req, res) => {
  try {
    const sections = await MenuSection.find({ parent: null }) // Only top-level sections
      .populate({
        path: "children", // Get child sections
        populate: {
          path: "children", // Get children of children (sub-subsections)
        },
      })
      .lean();

    res.json(sections); // Return only the top-level sections
  } catch (err) {
    console.error("❌ Error fetching menu:", err);
    res.status(500).json({ error: "Failed to fetch menu." });
  }
});


export default router;
