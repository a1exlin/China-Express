import React, { useState } from 'react';

const dietDishes = [
  { id: 'DD1', name: 'Steamed Mixed Vegetables', price: 10.75 },
  { id: 'DD2', name: 'Steamed Chicken w. Mixed Vegetables', price: 11.95 },
  { id: 'DD3', name: 'Steamed Shrimp w. Mixed Vegetables', price: 12.75 },
];

function DietDishesMenu() {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '16px 10px',
        backgroundColor: '#fff',
        minHeight: 'auto',
        height: '100%',
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
          Diet Dishes
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
          (w. Jasmine Steamed White Rice or Jasmine Fried Rice) <br />
          Cooked without Oil, sauce on the side
        </p>

        {dietDishes.map((item, index) => (
          <div
            key={item.id}
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
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <span style={{ flexGrow: 1 }}>
                <span style={{ color: '#cc0000', fontWeight: 600 }}>{item.id}</span> {item.name}
              </span>
              <span style={{ textAlign: 'right', minWidth: '60px' }}>${item.price.toFixed(2)}</span>
            </div>

            {hoverIndex === index && (
              <p style={{ marginTop: '6px', fontSize: '0.85rem', color: '#555' }}>
                Healthy and oil-free option with sauce on the side.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DietDishesMenu;
