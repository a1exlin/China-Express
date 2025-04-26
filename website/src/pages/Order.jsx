import React from 'react';
import { motion } from 'framer-motion'; // Add framer-motion

export default function CheckoutPanel({
  cartItems,
  onRemoveItem,
  onDuplicateItem,
  subtotal,
  tax,
  total,
  onCheckout
}) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={styles.panel}
    >
      <h2 style={styles.heading}>Your Order</h2>

      <div style={styles.itemList}>
        {cartItems.length === 0 ? (
          <div style={styles.emptyText}>No items yet.</div>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} style={styles.itemCard}>
              <div style={styles.itemHeader}>
                <div style={styles.itemName}>{item.name}</div>
                <div style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
              <div style={styles.itemOptions}>
                <button onClick={() => onRemoveItem(index)} style={styles.optionButton}>Remove</button>
                <button onClick={() => onDuplicateItem(index)} style={styles.optionButton}>Duplicate</button>
              </div>
              {item.description && (
                <div style={styles.itemDescription}>{item.description}</div>
              )}
            </div>
          ))
        )}
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
        <div style={{ ...styles.summaryRow, fontWeight: 'bold' }}>
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button style={styles.checkoutButton} onClick={onCheckout}>
        Checkout
      </button>
    </motion.div>
  );
}

const styles = {
  panel: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '400px',
    height: 'auto',
    backgroundColor: '#fff',
    boxShadow: '-4px 0 10px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    overflowY: 'auto',
    zIndex: 1001,
    borderLeft: '1px solid #ddd',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '22px',
  },
  itemList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '10px',
  },
  itemCard: {
    borderBottom: '1px solid #ddd',
    paddingBottom: '10px',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  itemName: {
    fontWeight: '600',
    fontSize: '16px',
  },
  itemPrice: {
    color: '#555',
    fontWeight: '500',
    fontSize: '16px',
  },
  itemOptions: {
    display: 'flex',
    gap: '10px',
    marginTop: '5px',
  },
  optionButton: {
    fontSize: '12px',
    color: '#f3631a',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  itemDescription: {
    fontSize: '12px',
    color: '#777',
    marginTop: '4px',
  },
  summary: {
    borderTop: '1px solid #ddd',
    paddingTop: '12px',
    marginBottom: '12px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '16px',
  },
  checkoutButton: {
    marginTop: '10px',
    marginBottom: '8px',
    padding: '12px',
    backgroundColor: '#f3631a',
    color: 'white',
    fontSize: '18px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: '16px',
    marginTop: '30px',
  },
};
