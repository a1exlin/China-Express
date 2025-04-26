import React from "react";
import { motion } from "framer-motion";
import "../css/checkoutPanel.css";
import { useCheckoutHandler } from "../scripts/checkout";

export default function CartPanel({
  isOpen,
  onClose,
  cartItems,
  updateQuantity,
}) {
  const { handleCheckout } = useCheckoutHandler(onClose);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.Price || 0) * (item.quantity || 1),
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <motion.div
      initial={false}
      animate={{
        x: isOpen ? 0 : "100%",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 50 }}
      className="checkoutPanel"
    >
      <div className="panelInner">
        {/* Close Button */}
        <button className="closeButton" onClick={onClose}>
          ×
        </button>

        {/* Title */}
        <h2 className="title">Your Order</h2>

        {/* Cart Items */}
        <div className="itemListContainer">
          <div className="itemList">
            {cartItems.length === 0 ? (
              <div className="emptyText">Your cart is empty.</div>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="itemCard">
                  <div className="itemHeader">
                    <span className="itemName">{item.Name}</span>
                    <span className="itemPrice">
                      ${(item.Price * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                  <div className="itemActions">
                    <button
                      className="quantityBtn"
                      onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
                    >
                      -
                    </button>
                    <span className="quantityNumber">
                      {item.quantity || 1}
                    </span>
                    <button
                      className="quantityBtn"
                      onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="summary">
          <div className="summaryRow">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summaryRow">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summaryRow" style={{ fontWeight: "bold" }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          <button className="checkoutBtn" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </motion.div>
  );
}
