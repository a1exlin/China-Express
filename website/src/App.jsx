import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import CompleteCheckout from "./pages/CompleteCheckout";


// Components
import NavBar from "./components/navBar";
import CartPanel from "./components/CartPanel";

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
  const updateQuantity = (index, newQty) => {
    const updated = [...cartItems];
    if (newQty <= 0) {
      updated.splice(index, 1); // ❗ Remove item if qty goes to 0
    } else {
      updated[index].quantity = newQty;
    }
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleCheckout = () => {
    onClose();
    // Redirect to payment page, or open payment modal here later
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      <BrowserRouter>
        <NavBar setCheckoutOpen={setCheckoutOpen} />

        <Routes>
          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<Menu addToCart={addToCart} />} />
          <Route path="/completeCheckout" element={<CompleteCheckout/>} />

        </Routes>

        <CartPanel
          isOpen={isCheckoutOpen}
          onClose={() => setCheckoutOpen(false)}
          cartItems={cartItems}
          updateQuantity={updateQuantity}
          onCheckout={handleCheckout}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
