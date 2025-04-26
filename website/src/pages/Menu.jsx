import React from "react";
import MenuItems from "../components/menu/MenuItems";

export default function Menu({ addToCart }) {
  return (
    <div className="menu">
      <MenuItems addToCart={addToCart} />
    </div>
  );
}
