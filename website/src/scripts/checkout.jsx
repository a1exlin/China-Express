import React from "react";
import { useNavigate } from "react-router-dom";

export function useCheckoutHandler() {
  const navigate = useNavigate();

  async function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (!cart.length) {
      console.error("Cart is empty!");
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER_URI + "/api/checkout/verifyCart",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error(
          "Server rejected the cart:",
          result.message || "Unknown error."
        );
        return;
      }

      console.log("Cart verified successfully:", result);

      if (result.verifiedCart && Array.isArray(result.verifiedCart)) {
        localStorage.setItem("cart", JSON.stringify(result.verifiedCart));
        navigate("/completeCheckout");
      } else {
        console.error("Invalid server response: missing verifiedCart.");
      }
    } catch (error) {
      console.error("Checkout error:", error.message || error);
    }
  }

  return { handleCheckout };
}
