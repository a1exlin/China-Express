import React, { useState } from 'react';
import '../css/appetizers.css';

const appetizers = [
  { id: 1, name: "Chicken Egg Roll (1)", price: 1.79, description: "Classic chicken egg roll, crispy and savory." },
  { id: 2, name: "Shrimp Egg Roll (1)", price: 1.79, description: "Crispy egg roll filled with shrimp." },
  { id: 3, name: "Spring Egg Roll (2)", price: 1.79, description: "Vegetarian-style crispy spring rolls." },
  { id: 4, name: "Steamed or Fried Dumplings (8)", price: 7.25, description: "Choice of steamed or fried pork dumplings." },
  {
    id: 5,
    name: "Bar-B-Q Spare Ribs",
    sizes: [
      { label: "(4)", price: 10.75 },
      { label: "(8)", price: 17.50 },
    ],
    description: "Slow-cooked BBQ ribs glazed in sweet sauce."
  },
  {
    id: 6,
    name: "French Fries",
    sizes: [
      { label: "(S)", price: 2.39 },
      { label: "(Lg)", price: 3.59 },
    ],
    description: "Golden crispy fries."
  },
  { id: 7, name: "Crab Rangoon (8)", price: 6.50, description: "Fried wontons filled with crab and cream cheese." },
];

function AppetizersMenu() {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div className="modern-menu">
      <h2>Appetizers</h2>
      {appetizers.map((item, index) => (
        <div
          key={item.id}
          className="menu-item"
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
          style={{
            backgroundColor: hoverIndex === index ? '#f0f0f0' : 'transparent',
            transition: 'background-color 0.2s ease-in-out',
            padding: '10px 0',
            borderBottom: '1px solid #ddd',
          }}
        >
          <div className="item-name" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              <span className="item-number" style={{ color: '#cc0000', fontWeight: '600' }}>
                {item.id}.
              </span>{' '}
              {item.name}
            </span>
            <div className="item-price" style={{ textAlign: 'right' }}>
              {item.price !== undefined
                ? `$${item.price.toFixed(2)}`
                : item.sizes.map((s, i) => (
                    <span key={i} className="size-price">
                      {s.label} ${s.price.toFixed(2)}
                      {i < item.sizes.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
            </div>
          </div>

          {hoverIndex === index && (
            <p style={{ marginTop: '6px', fontSize: '0.85rem', color: '#555' }}>
              {item.description || "A delicious appetizer from our kitchen."}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default AppetizersMenu;
