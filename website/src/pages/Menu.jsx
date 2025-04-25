// Menu.jsx
import React, { useState } from "react";
import { SubMenuCard } from "../components/menuCards";

// Image Imports
import appetizersImage from "../image/PlaceHolderPicSquare.png";
import soupImage from "../image/PlaceHolderPicSquare.png";
import lunchImage from "../image/PlaceHolderPicSquare.png";
import dinnerImage from "../image/PlaceHolderPicSquare.png";
import specialsImage from "../image/PlaceHolderPicSquare.png";
import chefSpecialImage from "../image/PlaceHolderPicSquare.png";
import sidesImage from "../image/PlaceHolderPicSquare.png";
import meatImage from "../image/PlaceHolderPicSquare.png";
import noodlesImage from "../image/PlaceHolderPicSquare.png";
import veggieImage from "../image/PlaceHolderPicSquare.png";

// Menu Section Components
import AppetizersMenu from "../components/appetizers";
import SoupMenu from "../components/soups";
import LunchMenu from "../components/lunch";
import DinnerMenu from "../components/dinner";
import SpecialsMenu from "../components/specials";
import ChefSpecialMenu from "../components/chefspecial";
import SideOrders from "../components/sides";
import BeefMenu from "../components/beef";
import ChickenMenu from "../components/chicken";
import RoastPorkMenu from "../components/pork";
import SeafoodMenu from "../components/seafood";
import FriedRiceMenu from "../components/friedrice";
import EggFooYoungMenu from "../components/egg";
import ChowMeiFunMenu from "../components/meifun";
import VegetableMenu from "../components/vegetable";
import DietDishesMenu from "../components/diet";

function Menu() {
  const [activeSection, setActiveSection] = useState(null);

  const renderMenuContent = () => {
    switch (activeSection) {
      case "appetizers": return <AppetizersMenu />;
      case "soups": return <SoupMenu />;
      case "lunch": return <LunchMenu />;
      case "dinner": return <DinnerMenu />;
      case "specials": return <SpecialsMenu />;
      case "chefSpecials": return <ChefSpecialMenu />;
      case "sides": return <SideOrders />;
      case "beef": return <BeefMenu />;
      case "chicken": return <ChickenMenu />;
      case "pork": return <RoastPorkMenu />;
      case "seafood": return <SeafoodMenu />;
      case "friedrice": return <FriedRiceMenu />;
      case "meifun": return <ChowMeiFunMenu />;
      case "egg": return <EggFooYoungMenu />;
      case "vegetable": return <VegetableMenu />;
      case "diet": return <DietDishesMenu />;
      default: return null;
    }
  };

  return (
    <div className="menu" style={{ position: "relative" }}>
      {activeSection && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            transition: "opacity 0.3s ease",
          }}
        >
          <div
            style={{
              position: "relative",
              background: "#fff7ed",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
              maxHeight: "90vh",
              overflowY: "auto",
              width: "90%",
              maxWidth: "700px",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <button
              onClick={() => setActiveSection(null)}
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                background: "transparent",
                border: "none",
                fontSize: "24px",
                fontWeight: "bold",
                cursor: "pointer",
                color: "#a9321c"
              }}
            >
              ×
            </button>
            {renderMenuContent()}
          </div>
        </div>
      )}

      <SubMenuCard
        image={appetizersImage}
        title="Appetizers"
        description="Crispy golden starters 🍤"
        onClick={() => setActiveSection("appetizers")}
      />

      <SubMenuCard
        image={soupImage}
        title="Soups"
        description="Warm up with a savory bowl 🍲"
        onClick={() => setActiveSection("soups")}
      />

      <SubMenuCard
        image={lunchImage}
        title="Lunch Specials"
        description="Quick mid-day combos ☀️"
        onClick={() => setActiveSection("lunch")}
      />

      <SubMenuCard
        image={dinnerImage}
        title="Dinner Specials"
        description="Full-size entrees with rice 🍚"
        onClick={() => setActiveSection("dinner")}
      />

      <SubMenuCard
        image={meatImage}
        title="Meat Dishes"
        description="Beef, Chicken, Pork & Seafood 🥩🍗🐟"
        expandable
      >
        <span onClick={() => setActiveSection("beef")}>Beef Dishes</span>
        <span onClick={() => setActiveSection("chicken")}>Chicken Dishes</span>
        <span onClick={() => setActiveSection("seafood")}>Seafood Dishes</span>
        <span onClick={() => setActiveSection("pork")}>Roast Pork</span>
      </SubMenuCard>

      <SubMenuCard
        image={noodlesImage}
        title="Noodles & Rice"
        description="Fried rice, egg foo young & more 🍜"
        expandable
      >
        <span onClick={() => setActiveSection("friedrice")}>Fried Rice</span>
        <span onClick={() => setActiveSection("meifun")}>Chow Mei Fun</span>
        <span onClick={() => setActiveSection("egg")}>Egg Foo Young</span>
      </SubMenuCard>

      <SubMenuCard
        image={veggieImage}
        title="Vegetarian & Healthy"
        description="Fresh greens & steamed options 🥦"
        expandable
      >
        <span onClick={() => setActiveSection("vegetable")}>Vegetable Dishes</span>
        <span onClick={() => setActiveSection("diet")}>Diet Dishes</span>
      </SubMenuCard>

      <SubMenuCard
        image={specialsImage}
        title="House Specials"
        description="Customer favorites ⭐"
        onClick={() => setActiveSection("specials")}
      />

      <SubMenuCard
        image={chefSpecialImage}
        title="Chef's Specials"
        description="Hand-picked gourmet options 🍽️"
        onClick={() => setActiveSection("chefSpecials")}
      />

      <SubMenuCard
        image={sidesImage}
        title="Side Orders"
        description="Tasty extras & add-ons 🍘"
        onClick={() => setActiveSection("sides")}
      />
    </div>
  );
}

export default Menu;
