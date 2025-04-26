import React from "react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();

  const handlePaymentSuccess = () => {
    alert("Payment successful! Thank you!");
    localStorage.removeItem("cart");
    navigate("/home");
  };

  const handleCancel = () => {
    navigate("/completeCheckout");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Secure Payment</h1>

      <p style={styles.description}>
        Please proceed to pay for your order.
      </p>

      {/* FAKE Payment simulation box */}
      <div style={styles.paymentBox}>
        <p style={{ marginBottom: "10px" }}>🔒 Secure Payment Gateway</p>
        <button style={styles.payButton} onClick={handlePaymentSuccess}>
          Pay Now ($ Total)
        </button>
      </div>

      <button style={styles.cancelButton} onClick={handleCancel}>
        Cancel and Return to Checkout
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "24px",
    backgroundColor: "white",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  description: {
    fontSize: "16px",
    marginBottom: "24px",
    color: "#666",
  },
  paymentBox: {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "20px",
    backgroundColor: "#fafafa",
  },
  payButton: {
    padding: "14px 20px",
    fontSize: "18px",
    backgroundColor: "#c34428",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: "10px",
    padding: "10px 16px",
    backgroundColor: "#777",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
