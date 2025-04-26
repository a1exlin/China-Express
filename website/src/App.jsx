import React, {useState} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";

import Menu from "./pages/Menu";
import CheckoutPanel from "./pages/Order";
// Components
import NavBar from "./components/navBar";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => setCartItems(prev => [...prev, item]);
  const removeFromCart = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };
  const duplicateItem = (index) => {
    const duplicated = { ...cartItems[index] };
    setCartItems(prev => [...prev, duplicated]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.06;
  const total = subtotal + tax;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to="/home" />} />
          <Route
            path="/home"
            element={
              <div>
                <NavBar />
                <Home />
              </div>
            }
          />
          <Route
            path="/menu"
            element={
              <div>
                <NavBar />
                <Menu addToCart={addToCart} />
              </div>
            }
          />
          <Route
            path="/order"
            element={
              <div>
                <NavBar />
                <Menu addToCart={addToCart} />
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
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
