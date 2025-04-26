import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/checkoutPanel.css";

export default function CompleteCheckout() {
  const [cartItems, setCartItems] = useState([]);
  const [pickupTimes, setPickupTimes] = useState([]);
  const [pickupTime, setPickupTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (!storedCart.length) {
      navigate("/menu");
      return;
    }

    setCartItems(storedCart);

    const calculatedSubtotal = storedCart.reduce((sum, item) => sum + (item.Price || 0), 0);
    const calculatedTax = calculatedSubtotal * 0.08;
    const calculatedTotal = calculatedSubtotal + calculatedTax;

    setSubtotal(calculatedSubtotal);
    setTax(calculatedTax);
    setTotal(calculatedTotal);

    generatePickupTimes();
  }, [navigate]);

  const generatePickupTimes = () => {
    const times = ["ASAP"];
    const now = new Date();

    now.setMinutes(now.getMinutes() + (30 - (now.getMinutes() % 30)) % 30);
    now.setSeconds(0);
    now.setMilliseconds(0);

    for (let i = 0; i < 5; i++) {
      const timeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      times.push(timeString);
      now.setMinutes(now.getMinutes() + 30);
    }

    setPickupTimes(times);
  };

  const handlePlaceOrder = () => {
    if (!pickupTime) {
      alert("Please select a pickup time.");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (paymentMethod === "PayOnline") {
      // Redirect to online payment page or handle online payment
      alert("Redirecting to secure payment page...");
      // Example: Redirect to a payment URL
      window.location.href = "/payment";
      return;
    }

    console.log({
      cartItems,
      pickupTime,
      paymentMethod,
      total,
    });

    alert("Order placed successfully!");
    localStorage.removeItem("cart");
    navigate("/home");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Review Your Order</h1>

      <div style={styles.itemList}>
        {cartItems.map((item, index) => (
          <div key={index} style={styles.itemCard}>
            <div style={styles.itemName}>{item.Name}</div>
            <div style={styles.itemPrice}>${item.Price.toFixed(2)}</div>
            {item.priceModified && (
              <div style={styles.priceModifiedWarning}>
                * Price Updated
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={styles.summary}>
        <div style={styles.summaryRow}>
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div style={{ ...styles.summaryRow, fontWeight: "bold" }}>
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Pickup Time Selection */}
      <div style={styles.section}>
        <label style={styles.label}>Pickup Time:</label>
        <select
          style={styles.select}
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
        >
          <option value="">Select a pickup time</option>
          {pickupTimes.map((time, index) => (
            <option key={index} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      {/* Payment Method Selection */}
      <div style={styles.section}>
        <label style={styles.label}>Payment Method:</label>
        <select
          style={styles.select}
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">Select payment method</option>
          <option value="Cash">Cash at Pickup</option>
          <option value="CreditCard">Credit/Debit Card at Pickup</option>
          <option value="PayOnline">Pay Online (Credit/Debit)</option>
        </select>
      </div>

      <button style={styles.checkoutButton} onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "24px",
    backgroundColor: "white",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    borderRadius: "12px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  itemList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "20px",
  },
  itemCard: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  itemName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
  },
  itemPrice: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#555",
  },
  priceModifiedWarning: {
    position: "absolute",
    bottom: "4px",
    right: "12px",
    fontSize: "10px",
    color: "#c34428",
    fontStyle: "italic",
  },
  summary: {
    marginTop: "20px",
    borderTop: "1px solid #ddd",
    paddingTop: "12px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "16px",
    color: "#333",
  },
  section: {
    marginTop: "20px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#333",
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  checkoutButton: {
    marginTop: "24px",
    width: "100%",
    padding: "14px",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "#c34428",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};
