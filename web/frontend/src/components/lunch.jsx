import React from 'react';

const lunchRaw = [
  ["L1. Chicken w. Cashew Nuts", 9.15],
  ["L2. Chicken w. Broccoli", 9.15],
  ["L3. Chicken w. Vegetable", 9.15],
  ["L4. Moo Goo Gai Pan", 9.15],
  ["L5. Sesame Chicken", 9.15],
  ["L6. Chicken w. Snow Pea Pods", 9.15],
  ["L7. Beef w. Broccoli", 9.55],
  ["L8. Beef w. Snow Pea Pods", 9.55],
  ["L9. Pepper Steak w. Onion", 9.55],
  ["L10. Roast Pork w. Broccoli", 9.15],
  ["L11. Roast Pork w. Vegetable", 9.15],
  ["L12. Shrimp w. Broccoli", 9.65],
  ["L13. Shrimp w. Snow Pea Pods", 9.65],
  ["L14. Shrimp w. Vegetable", 9.65],
  ["L15. Shrimp w. Cashew Nuts", 9.65],
  ["L16. Shrimp Lo Mein", 9.65],
  ["L17. Shrimp w. Lobster Sauce", 9.65],
  ["L18. Chicken or Pork Lo Mein", 9.15],
  ["L19. Sweet & Sour Chicken", 9.25],
  ["L20. Chicken, Pork or Shrimp Chow Mein", 9.55],
  ["L21. Mixed Vegetable", 8.25],
  ["L22. Vegetable Lo Mein", 8.25],
  ["L23. Broccoli w. Garlic Sauce", 8.25],
  ["L24. Kung Po Chicken", 9.15],
  ["L25. Chicken, Szechuan Style", 9.15],
  ["L26. Chicken w. Garlic Sauce", 9.15],
  ["L27. General Tso's Chicken", 9.15],
  ["L28. Beef, Szechuan Style", 9.55],
  ["L29. Roast Pork w. Garlic Sauce", 9.15],
  ["L30. Shrimp w. Garlic Sauce", 9.65],
  ["L31. Mongolian Beef", 9.55],
];

const lunchItems = lunchRaw.map(([name, price]) => ({
  name,
  price: `$${price.toFixed(2)}`
}));

export default function LunchMenu() {
  return (
    <div
      className="menu-wrapper"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '40px 20px',
        minHeight: '100vh',
        backgroundColor: '#fff',
      }}
    >
      <div
        className="menu-section"
        style={{
          maxWidth: '600px',
          width: '100%',
          backgroundColor: '#fefefe',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          color: 'black',
          maxHeight: '80vh',         // Limit height
          overflowY: 'auto',         // Scroll inside box
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>Lunch Specials</h2>
        <p style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px' }}>
          Served with Jasmine Fried Rice or Steamed Rice and a Spring Egg Roll (Mon–Sat 11:00am–4:30pm)
        </p>
        {lunchItems.map((item, index) => (
          <div
            className="menu-item"
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid #ddd',
            }}
          >
            <span>{item.name}</span>
            <span style={{ minWidth: '60px', textAlign: 'right' }}>{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
