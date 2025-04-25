import React, { useState } from 'react';

const seafoodItems = [
  ["44. Shrimp w. Snow Peas", 14.50],
  ["45. Shrimp w. Lobster Sauce", 14.50],
  ["46. Shrimp w. Cashew Nuts", 14.50],
  ["47. Shrimp w. Broccoli", 14.50],
  ["48. Shrimp w. Vegetable", 14.50],
  ["49. Shrimp, Szechuan Style", 14.50],
  ["50. Shrimp w. Garlic Sauce", 14.50],
  ["51. Kung Po Shrimp", 14.50],
  ["52. Shrimp w. Mixed Vegetables", 14.50],
];

const formattedSeafood = seafoodItems.map(([name, price]) => ({
  name,
  price: `$${price.toFixed(2)}`,
  description: "Fresh shrimp dishes served with Jasmine Rice.",
}));

function SeafoodMenu() {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '16px 10px',
        backgroundColor: '#fff',
        height: '100%',
        minHeight: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          width: '100%',
          backgroundColor: '#fefefe',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          color: '#000',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '4px',
          }}
        >
          Seafood
        </h2>
        <div
          style={{
            height: '3px',
            backgroundColor: '#cc0000',
            width: '100%',
            marginBottom: '12px',
          }}
        />
        <p style={{ fontSize: '0.95rem', textAlign: 'center', marginBottom: '16px' }}>
          (w. Jasmine Steamed White Rice or Jasmine Fried Rice) — Per Order (13 PCS)
        </p>

        {/* Price column label */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingBottom: '6px',
            fontWeight: 'bold',
            color: '#444',
          }}
        >
          <span></span>
          <span style={{ minWidth: '60px', textAlign: 'right' }}>Lg.</span>
        </div>

        {formattedSeafood.map((item, index) => {
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
                  flexWrap: 'wrap',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                <span style={{ flexGrow: 1 }}>
                  <span style={{ color: '#cc0000', fontWeight: '600' }}>{itemCode}</span>{' '}
                  {itemName}
                </span>
                <span style={{ minWidth: '60px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {item.price}
                </span>
              </div>

              {hoverIndex === index && (
                <p style={{ marginTop: '6px', fontSize: '0.85rem', color: '#555' }}>
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

export default SeafoodMenu;
