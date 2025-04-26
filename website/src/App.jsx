import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";

// Components
import NavBar from "./components/navBar";
import CheckoutPanel from "./pages/Order"; // Still using your Order.jsx as CheckoutPanel component

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

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.06;
  const total = subtotal + tax;

  return (
    <div style={{ display: "flex" }}>
      {/* Left side: Page content */}
      <div style={{ flex: 1, paddingRight: isCheckoutOpen ? "400px" : "0", backgroundColor: "white", minHeight: "100vh" }}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Navigate to="/home" />} />
            <Route
              path="/home"
              element={
                <>
                  <NavBar isCheckoutOpen={isCheckoutOpen} setCheckoutOpen={setCheckoutOpen} />
                  <Home />
                </>
              }
            />
            <Route
              path="/menu"
              element={
                <>
                  <NavBar isCheckoutOpen={isCheckoutOpen} setCheckoutOpen={setCheckoutOpen} />
                  <Menu addToCart={addToCart} />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>

      {/* Right side: Floating Checkout Panel */}
      {isCheckoutOpen && (
        <CheckoutPanel
          cartItems={cartItems}
          onRemoveItem={removeFromCart}
          onDuplicateItem={duplicateItem}
          subtotal={subtotal}
          tax={tax}
          total={total}
          onAddItem={addToCart}
          onCheckout={() => alert("Order placed!")}
        />
      )}
    </div>
  );
}

export default App;
