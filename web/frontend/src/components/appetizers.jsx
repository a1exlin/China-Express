import React from 'react';
import '../css/appetizers.css';

const appetizers = [
  { id: 1, name: "Chicken Egg Roll (1)", price: 1.79 },
  { id: 2, name: "Shrimp Egg Roll (1)", price: 1.79 },
  { id: 3, name: "Spring Egg Roll (2)", price: 1.79 },
  { id: 4, name: "Steamed or Fried Dumplings (8)", price: 7.25 },
  { id: 5, name: "Bar-B-Q Spare Ribs", sizes: [{ label: "(4)", price: 10.75 }, { label: "(8)", price: 17.50 }] },
  { id: 6, name: "French Fries", sizes: [{ label: "(S)", price: 2.39 }, { label: "(Lg)", price: 3.59 }] },
  { id: 7, name: "Crab Rangoon (8)", price: 6.50 },
];
 function AppetizersMenu() {
  return (
    <div className="modern-menu">
      <h2>Appetizers</h2>
      {appetizers.map((item) => (
        <div key={item.id} className="menu-item">
          <div className="item-name">
            <span className="item-number">{item.id}.</span> {item.name}
          </div>
          <div className="item-price">
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
      ))}
    </div>
  );
}

export default AppetizersMenu;