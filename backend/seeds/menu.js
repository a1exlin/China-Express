// backend/seedMenu.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MenuSection } from '../models/MenuSection.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://alexjphillipson:gPCfzXrVyniq3NcN@cluster0.hbjkwse.mongodb.net/China_Express?retryWrites=true&w=majority&appName=Cluster0s';

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[’'&]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

async function seedMenu() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("✅ Connected to MongoDB");

  // Clear out existing
  await MenuSection.deleteMany({});
  console.log("🗑️  Cleared existing menu data");

  // ▶️ 1. Appetizers
  const rawApp = [
    { id: 1, name: "Chicken Egg Roll (1)", price: 1.79, description: "Classic chicken egg roll, crispy and savory." },
    { id: 2, name: "Shrimp Egg Roll (1)", price: 1.79, description: "Crispy egg roll filled with shrimp." },
    { id: 3, name: "Spring Egg Roll (2)", price: 1.79, description: "Vegetarian-style crispy spring rolls." },
    { id: 4, name: "Steamed or Fried Dumplings (8)", price: 7.25, description: "Choice of steamed or fried pork dumplings." },
    {
      id: 5,
      name: "Bar-B-Q Spare Ribs",
      sizes: [
        { label: "(4)", price: 10.75 },
        { label: "(8)", price: 17.50 }
      ],
      description: "Slow-cooked BBQ ribs glazed in sweet sauce."
    },
    {
      id: 6,
      name: "French Fries",
      sizes: [
        { label: "(S)", price: 2.39 },
        { label: "(Lg)", price: 3.59 }
      ],
      description: "Golden crispy fries."
    },
    { id: 7, name: "Crab Rangoon (8)", price: 6.50, description: "Fried wontons filled with crab and cream cheese." }
  ];

  const appetizersItems = [];
  rawApp.forEach(item => {
    if (item.sizes) {
      item.sizes.forEach((s, i) => {
        appetizersItems.push({
          code: `A${item.id}-${i+1}`,
          name: `${item.name} ${s.label}`,
          price: s.price,
          description: item.description
        });
      });
    } else {
      appetizersItems.push({
        code: `A${item.id}`,
        name: item.name,
        price: item.price,
        description: item.description
      });
    }
  });

  const appetizers = await MenuSection.create({
    slug: slugify("Appetizers"),
    title: "Appetizers",
    description: "Start your meal right",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: appetizersItems,
    children: [],
    parent: null
  });
  console.log("✅ Seeded Appetizers");

  // ▶️ 2. Meat Dishes → Chicken & Beef subsections
  const beefItems = [
    ["Beef w. Broccoli", 14.70],
    ["Mongolian Beef", 14.70],
    ["Beef w. Snow Peas", 14.70],
    ["Kung Po Beef", 14.70],
    ["Beef w. Garlic Sauce", 14.70],
    ["Beef, Szechuan Style", 14.70],
    ["Beef, Hunan Style", 14.70],
    ["Curry Beef", 14.70],
    ["Beef w. Mixed Vegetables", 14.70],
    ["Pepper Steak w. Onion", 14.70],
  ].map((arr, i) => ({
    code: `B${i+1}`,
    name: arr[0],
    price: arr[1],
    description: ""
  }));

  const chickenItems = [
    ["Sesame Chicken", 13.60],
    ["General Tso’s Chicken", 13.60],
    ["Orange Chicken", 13.60],
    ["Mongolian Chicken", 12.85],
    ["Moo Goo Gai Pan", 12.85],
    ["Chicken w. Snow Peas", 12.85],
    ["Chicken w. Cashew Nuts", 12.85],
    ["Chicken w. Broccoli", 12.85],
    ["Chicken, Hunan Style", 12.85],
    ["Kung Po Chicken", 12.85],
    ["Chicken, Szechuan Style", 12.85],
    ["Chicken w. Garlic Sauce", 12.85],
    ["Curry Chicken", 12.85],
    ["Chicken w. Mixed Vegetables", 12.85],
    ["Sweet & Sour Chicken", 12.00]
  ].map((arr, i) => ({
    code: `C${i+1}`,
    name: arr[0],
    price: arr[1],
    description: ""
  }));

  const beefSection = await MenuSection.create({
    slug: slugify("Beef Dishes"),
    title: "Beef Dishes",
    description: "Delicious beef options",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: beefItems,
    children: [],
    parent: null // will set below
  });

  const chickenSection = await MenuSection.create({
    slug: slugify("Chicken Dishes"),
    title: "Chicken Dishes",
    description: "Tasty chicken options",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: chickenItems,
    children: [],
    parent: null
  });

  // Meat Dishes parent
  const meatSection = await MenuSection.create({
    slug: slugify("Meat Dishes"),
    title: "Meat Dishes",
    description: "Meat lovers' favorites",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: [],
    children: [chickenSection._id, beefSection._id],
    parent: null
  });

  // Update children parents
  await MenuSection.updateMany(
    { _id: { $in: [chickenSection._id, beefSection._id] } },
    { parent: meatSection._id }
  );
  console.log("✅ Seeded Meat Dishes + Chicken & Beef subsections");

  // ▶️ 3. Chef Specials (top-level)
  const chefSpecialsRaw = [
    ['Seafood Delight', 21.95, 'Lobster, jumbo shrimp, scallop, sautéed in snow mushrooms, broccoli, snow peas in a distinctive white sauce.'],
    ['Happy Family', 16.75, 'Shrimp, jumbo shrimp, scallop, chicken, roast pork, beef & mixed vegetables in brown sauce.'],
    ['Double Delicacy Delight', 16.75, 'Shrimp, jumbo shrimp, scallop & chicken sautéed in snow mushrooms, broccoli, baby corn & snow peas.'],
    ['Triple Delight', 16.75, 'Shrimp, chicken & beef sautéed in mixed veg.'],
    ['Four Season', 16.75, 'Tender shrimp, chicken, scallop, beef in mixed vegetables in Chef’s special sauce.'],
    ['Sesame Chicken', 13.70, 'Chunks of chicken sautéed in special brown sauce w. sesame seeds on top & broccoli on the side.'],
    ['Chicken & Shrimp Combo', 15.60, 'Chicken & shrimp w. vegetables sautéed in Chef’s sauce.'],
    ['General Tso’s Chicken', 13.60, 'This plate was designed by a master chef of general Tso, who was a famous general in Szechuan army.'],
    ['Orange Chicken', 13.60, 'Chunks of chicken sautéed in special brown sauce w. imported orange peels.'],
    ['Chicken, Shrimp & Pork w. Garlic Sauce', 16.95, 'Sautéed w. Chinese veg. in hot garlic sauce.']
  ];

  const chefItems = chefSpecialsRaw.map((arr, i) => ({
    code: `S${i+1}`,
    name: arr[0],
    price: arr[1],
    description: arr[2] || ""
  }));

  await MenuSection.create({
    slug: slugify("Chef Specials"),
    title: "Chef Specials",
    description: "Our signature house specialties",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: chefItems,
    children: [],
    parent: null
  });
  console.log("✅ Seeded Chef Specials");

  // ▶️ 4. Vegetarian & Healthy
  const dietRaw = [
    { id: 'DD1', name: 'Steamed Mixed Vegetables', price: 10.75 },
    { id: 'DD2', name: 'Steamed Chicken w. Mixed Vegetables', price: 11.95 },
    { id: 'DD3', name: 'Steamed Shrimp w. Mixed Vegetables', price: 12.75 }
  ];
  const dietItems = dietRaw.map(d => ({
    code: d.id,
    name: d.name,
    price: d.price,
    description: ""
  }));

  const dinnerRaw = [
    ["Chicken w. Cashew Nuts", 10.70, "Chicken, cashew, and veggies in brown sauce."],
    ["Chicken w. Pepper & Onion", 10.70, "Sautéed chicken with bell pepper and onions."],
    ["Chicken w. Broccoli", 10.70],
    ["Moo Goo Gai Pan", 10.70],
    ["Beef w. Broccoli", 11.25],
    // ... (include all of your dinnerRaw rows here) ...
  ].map((arr,i) => ({
    code: `D${i+1}`,
    name: arr[0],
    price: arr[1],
    description: arr[2] || ""
  }));

  const vegSection = await MenuSection.create({
    slug: slugify("Vegetarian & Healthy"),
    title: "Vegetarian & Healthy",
    description: "Light & healthy steamed dishes",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: [],
    children: [],
    parent: null
  });

  const dietSection = await MenuSection.create({
    slug: slugify("Diet Dishes"),
    title: "Diet Dishes",
    description: "",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: dietItems,
    children: [],
    parent: vegSection._id
  });

  const dinnerSection = await MenuSection.create({
    slug: slugify("Dinner Entrees"),
    title: "Dinner Entrees",
    description: "",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: dinnerRaw,
    children: [],
    parent: vegSection._id
  });

  // attach to vegetarian & healthy
  await MenuSection.updateOne(
    { _id: vegSection._id },
    { $push: { children: [dietSection._id, dinnerSection._id] } }
  );
  console.log("✅ Seeded Vegetarian & Healthy");

  // ▶️ 5. Noodles & Rice
  const eggFooItems = [
    ["Shrimp Egg Foo Young", 12.50],
    ["Vegetable Egg Foo Young", 11.50],
    ["Chicken Egg Foo Young", 11.75],
    ["Beef Egg Foo Young", 12.00],
    ["House Egg Foo Young", 12.00]
  ].map((arr,i)=>({
    code:`E${i+1}`,
    name:arr[0],
    price:arr[1],
    description:""
  }));

  const friedRiceRaw = [
    ["Vegetable Fried Rice", 7.75, 9.95],
    ["Egg Fried Rice", 7.45, 8.95],
    ["Roast Pork Fried Rice", 8.40, 10.45],
    ["Chicken Fried Rice", 8.40, 10.45],
    ["Beef Fried Rice", 8.45, 11.15],
    ["Shrimp Fried Rice", 8.45, 11.35],
    ["House Special Fried Rice", 8.45, 11.45, "chicken, shrimp & pork"]
  ].map((arr,i)=>({
    code:`FR${i+1}`,
    name:arr[0],
    price:arr[2]||arr[1],
    description:arr[3]||""
  }));

  const loMeinRaw = [
    ["Vegetable Lo Mein", 8.45, 10.25],
    ["Pork or Chicken Lo Mein", 8.95, 11.35],
    ["Shrimp or Beef Lo Mein", 9.15, 12.00],
    ["House Special Lo Mein", 9.15, 12.00, "chicken, shrimp & pork"]
  ].map((arr,i)=>({
    code:`LM${i+1}`,
    name:arr[0],
    price:arr[2]||arr[1],
    description:arr[3]||""
  }));

  const chowFunRaw = [
    ["Beef Mei Fun", 12.20],
    ["Chicken or Pork Mei Fun", 12.20],
    ["Shrimp Mei Fun", 12.20],
    ["House Special Mei Fun", 12.20, "Chicken, shrimp & pork"],
    ["Singapore Style Mei Fun", 12.20, "Chicken, shrimp & pork, curry spicy"]
  ].map((arr,i)=>({
    code:`CF${i+1}`,
    name:arr[0],
    price:arr[1],
    description:arr[2]||""
  }));

  const lunchRaw = [
    ["Chicken w. Cashew Nuts", 9.15],
    ["Chicken w. Broccoli", 9.15],
    // ... include all lunchRaw rows ...
  ].map((arr,i)=>({
    code:`L${i+1}`,
    name:arr[0],
    price:arr[1],
    description:arr[2]||""
  }));

  const noodlesSection = await MenuSection.create({
    slug: slugify("Noodles & Rice"),
    title: "Noodles & Rice",
    description: "",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: [],
    children: [],
    parent: null
  });

  const eggFooSection = await MenuSection.create({
    slug: slugify("Egg Foo Young"),
    title: "Egg Foo Young",
    description: "",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: eggFooItems,
    children: [],
    parent: noodlesSection._id
  });
  const friedRiceSection = await MenuSection.create({
    slug: slugify("Fried Rice"),
    title: "Fried Rice",
    description: "",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: friedRiceRaw,
    children: [],
    parent: noodlesSection._id
  });
  const loMeinSection = await MenuSection.create({
    slug: slugify("Lo Mein"),
    title: "Lo Mein",
    description: "",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: loMeinRaw,
    children: [],
    parent: noodlesSection._id
  });
  const chowFunSection = await MenuSection.create({
    slug: slugify("Chow Mei Fun"),
    title: "Chow Mei Fun",
    description: "",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: chowFunRaw,
    children: [],
    parent: noodlesSection._id
  });
  const lunchSection = await MenuSection.create({
    slug: slugify("Lunch Specials"),
    title: "Lunch Specials",
    description: "",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: lunchRaw,
    children: [],
    parent: noodlesSection._id
  });

  // attach all noodle children
  await noodlesSection.updateOne({
    children: [eggFooSection._id, friedRiceSection._id, loMeinSection._id, chowFunSection._id, lunchSection._id]
  });
  console.log("✅ Seeded Noodles & Rice");

  // ▶️ 6. Sides
  const sideRaw = [
    ["Fortune Cookies (Each)", 0.25, "Crisp vanilla-flavored cookies with a paper fortune inside."],
    ["White Rice", null, "2.25 / 3.50", "Steamed plain white rice."],
    ["Fried Noodles", null, "0.50 / 0.75", "Crunchy fried noodle strips for soup or snacking."],
    ["Fried Rice", null, "3.00 / 4.75", "Classic egg fried rice with vegetables."],
    ["Steamed Broccoli", null, "1.50", "Lightly steamed broccoli florets."],
    ["Cup of Sauce", null, "1.50", "Extra dipping or pouring sauce of your choice."]
  ].map((arr,i)=>({
    code:`SD${i+1}`,
    name:arr[0],
    price:arr[1]!==null ? arr[1] : parseFloat(arr[2].split('/')[0]),
    description:arr[3]||""
  }));

  await MenuSection.create({
    slug: slugify("Sides"),
    title: "Sides",
    description: "",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: sideRaw,
    children: [],
    parent: null
  });
  console.log("✅ Seeded Sides");

  // ▶️ 7. Soups
  const soupRaw = [
    ["Egg Drop Soup", 2.10, 3.85, "A light chicken broth with egg ribbons."],
    ["Wonton Soup", 2.10, 3.85, "Clear broth with pork wontons and scallions."],
    ["Chicken Noodle Soup", 2.20, 4.30, "Classic noodles in chicken broth with shredded chicken."],
    ["Chicken Rice Soup", 2.20, 4.30, "Savory chicken broth with rice and chicken."],
    ["Vegetable Bean Curd Soup", 2.50, 5.00, "Mixed vegetables with soft tofu in light broth."],
    ["House Special Soup", null, 7.25, "Seafood, meat, and veggies in a rich, flavorful broth."],
    ["Seafood Soup", null, 9.45, "A deluxe seafood blend in a hearty broth."],
    ["Hot & Sour Soup", 2.85, 4.25, "Spicy and tangy broth with tofu and vegetables."]
  ].map((arr,i)=>({
    code:`SP${i+1}`,
    name:arr[0],
    price:arr[2]||arr[1],
    description:arr[3]||""
  }));

  await MenuSection.create({
    slug: slugify("Soups"),
    title: "Soups",
    description: "",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: soupRaw,
    children: [],
    parent: null
  });
  console.log("✅ Seeded Soups");

  // ▶️ 8. Specials (wings & ribs)
  const specialsRaw = [
    { id: "A1", name: "Braised Wings (8 pcs)", notes:"with red brown sauce smell", solo:9.00, friedRice:11.50, porkOrChicken:12.15, shrimp:12.45 },
    // … etc for A2–A9 ...
  ];
  const specialsItems = specialsRaw.map(s=>({
    code: s.id,
    name: s.name,
    price: s.solo,
    description: s.notes
  }));
  await MenuSection.create({
    slug: slugify("Party Specials"),
    title: "Party Specials",
    description: "Wings, ribs & more",
    imageUrl: "/images/PlaceHolderPicSquare.png",
    items: specialsItems,
    children: [],
    parent: null
  });
  console.log("✅ Seeded Party Specials");

  console.log("🎉 All menu data seeded!");
  mongoose.disconnect();
}

seedMenu().catch(err=>{
  console.error(err);
  process.exit(1);
});
