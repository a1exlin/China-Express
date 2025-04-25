import React, { useState } from 'react';

const dinnerRaw = [
  ["D1. Chicken w. Cashew Nuts", 10.70, "Chicken, cashew, and veggies in brown sauce."],
  ["D2. Chicken w. Pepper & Onion", 10.70, "Sautéed chicken with bell pepper and onions."],
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

const dinnerItems = dinnerRaw.map(([name, price, description]) => ({
  name,
  price: `$${price.toFixed(2)}`,
  description: description || "A delicious dinner special from our chef.",
}));

function DinnerMenu() {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: '#fff',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          width: '100%',
          backgroundColor: '#fefefe',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          color: '#000',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '4px' }}>
          Dinner Specials
        </h2>
        <div
          style={{
            height: '3px',
            backgroundColor: '#cc0000',
            width: '100%',
            marginBottom: '16px',
          }}
        />
        <p style={{ fontSize: '0.95rem', textAlign: 'center', marginBottom: '20px' }}>
          Served with Spring Roll & Jasmine Fried Rice or Jasmine Steamed Rice (Available All Day)
        </p>

        {dinnerItems.map((item, index) => {
          const [itemCode, ...rest] = item.name.split(' ');
          const itemName = rest.join(' ');
          return (
            <div
              key={index}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{
                padding: '10px 0',
                borderBottom: '1px solid #ddd',
                backgroundColor: hoverIndex === index ? '#f0f0f0' : 'transparent',
                transition: 'background-color 0.2s ease-in-out',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ flexGrow: 1 }}>
                  <span style={{ color: '#cc0000', fontWeight: '600' }}>{itemCode}</span>{' '}
                  {itemName}
                </span>
                <span style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{item.price}</span>
              </div>

              {hoverIndex === index && (
                <p
                  style={{
                    marginTop: '6px',
                    fontSize: '0.85rem',
                    color: '#555',
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DinnerMenu;
