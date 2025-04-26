import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";

// Components
import NavBar from "./components/navBar";
import CartPanel from "./pages/CartPanel";

function App() {
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };

  const duplicateItem = (index) => {
    const duplicated = { ...cartItems[index] };
    setCartItems((prev) => [...prev, duplicated]);
  };

  const handleCheckout = () => {
    console.log("Proceed to checkout:", cartItems);
    // Redirect to payment page, or open payment modal here later
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white", position: "relative" }}>
      <BrowserRouter>
        <NavBar setCheckoutOpen={setCheckoutOpen} />

        <Routes>
          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<Menu addToCart={addToCart} />} />
        </Routes>
      </BrowserRouter>

      <CartPanel
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        duplicateItem={duplicateItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default App;
