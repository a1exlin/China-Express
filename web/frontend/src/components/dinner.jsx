import React from 'react';

const dinnerRaw = [
  ["D1. Chicken w. Cashew Nuts", 10.70],
  ["D2. Chicken w. Pepper & Onion", 10.70],
  ["D3. Chicken w. Broccoli", 10.70],
  ["D4. Moo Goo Gai Pan", 10.70],
  ["D5. Beef w. Broccoli", 11.25],
  ["D6. Pepper Steak w. Onion", 11.25],
  ["D7. Shrimp w. Broccoli (8 pcs)", 11.50],
  ["D8. Shrimp w. Cashew Nuts (8 pcs)", 11.50],
  ["D9. Shrimp w. Vegetable (8 pcs)", 11.50],
  ["D10. Shrimp w. Lobster Sauce (8 pcs)", 11.50],
  ["D11. Sweet & Sour Chicken", 10.70],
  ["D12. Chicken or Pork Chow Mein", 10.70],
  ["D13. Shrimp Chow Mein", 11.50],
  ["D14. Chicken or Pork Lo Mein", 10.70],
  ["D15. Beef or Shrimp Lo Mein", 11.50],
  ["D16. Mongolian Beef", 11.25],
  ["D17. Roast Pork w. Broccoli", 10.70],
  ["D18. Roast Pork w. Vegetable", 10.70],
  ["D19. Sesame Chicken", 10.80],
  ["D20. Chicken w. Snow Pea Pods", 10.70],
  ["D21. Shrimp w. Snow Pea Pods (8 pcs)", 11.50],
  ["D22. Chicken w. Vegetable", 10.70],
  ["D23. Kung Po Chicken", 10.70],
  ["D24. Chicken w. Garlic Sauce", 10.70],
  ["D25. Chicken, Szechuan Style", 10.70],
  ["D26. Shrimp w. Garlic Sauce (8 pcs)", 11.50],
  ["D27. Roast Pork w. Garlic Sauce", 10.70],
  ["D28. General Tso's Chicken", 10.80],
  ["D29. Orange Chicken", 10.80],
  ["D30. Curry Chicken", 10.70],
  ["D31. Beef, Hunan Style", 11.25],
  ["D32. Shrimp, Hunan Style (8 pcs)", 11.50],
  ["D33. Chicken, Hunan Style", 10.70],
  ["D34. Kung Po Shrimp (8 pcs)", 11.50],
  ["D35. Mixed Vegetables", 9.60],
  ["D36. Tofu w. Vegetable", 10.00],
  ["D37. Broccoli w. Garlic Sauce", 9.60],
  ["D38. Tofu, Hunan Style", 10.00],
];

const dinnerItems = dinnerRaw.map(([name, price]) => ({
  name,
  price: `$${price.toFixed(2)}`
}));

function DinnerMenu() {
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
        <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>Dinner Specials</h2>
        <p style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px' }}>
          Served with Spring Roll & Jasmine Fried Rice or Jasmine Steamed Rice (Available All Day)
        </p>
        {dinnerItems.map((item, index) => (
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

export default DinnerMenu;
