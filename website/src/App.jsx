import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";

// Components
import NavBar from "./components/navBar";
import CheckoutPanel from "./pages/Order"; // Your CheckoutPanel component

function App() {
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => setCartItems((prev) => [...prev, item]);

  const removeFromCart = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };

  const duplicateItem = (index) => {
    const duplicated = { ...cartItems[index] };
    setCartItems((prev) => [...prev, duplicated]);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.06;
  const total = subtotal + tax;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      <BrowserRouter>
        <NavBar
          isCheckoutOpen={isCheckoutOpen}
          setCheckoutOpen={setCheckoutOpen}
        />
        <Routes>
          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<Menu addToCart={addToCart} />} />
        </Routes>
      </BrowserRouter>

      {/* Floating Checkout Panel */}
      <CheckoutPanel
        isOpen={isCheckoutOpen}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onDuplicateItem={duplicateItem}
        subtotal={subtotal}
        tax={tax}
        total={total}
        onAddItem={addToCart}
        onCheckout={() => alert("Order placed!")}
      />
    </div>
  );
}

export default App;
