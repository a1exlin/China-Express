import React, { useState } from 'react';

const chefSpecials = [
  ['S1', 'Seafood Delight', 21.95, 'Lobster, jumbo shrimp, scallop, sautéed in snow mushrooms, broccoli, snow peas in a distinctive white sauce.'],
  ['S2', 'Happy Family', 16.75, 'Shrimp, jumbo shrimp, scallop, chicken, roast pork, beef & mixed vegetables in brown sauce.'],
  ['S3', 'Double Delicacy Delight', 16.75, 'Shrimp, jumbo shrimp, scallop & chicken sautéed in snow mushrooms, broccoli, baby corn & snow peas.'],
  ['S4', 'Triple Delight', 16.75, 'Shrimp, chicken & beef sautéed in mixed veg.'],
  ['S5', 'Four Season', 16.75, 'Tender shrimp, chicken, scallop, beef in mixed vegetables in Chef’s special sauce.'],
  ['S6', 'Sesame Chicken', 13.70, 'Chunks of chicken sautéed in special brown sauce w. sesame seeds on top & broccoli on the side.'],
  ['S7', 'Chicken & Shrimp Combo', 15.60, 'Chicken & shrimp w. vegetables sautéed in Chef’s sauce.'],
  ['S8', "General Tso’s Chicken", 13.60, 'This plate was designed by a master chef of general Tso, who was a famous general in Szechuan army.'],
  ['S9', 'Orange Chicken', 13.60, 'Chunks of chicken sautéed in special brown sauce w. imported orange peels.'],
  ['S10', 'Chicken, Shrimp & Pork w. Garlic Sauce', 16.95, 'Sautéed w. Chinese veg. in hot garlic sauce.'],
];

function ChefSpecialMenu() {
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
          Chef's Special
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
          (w. Jasmine Steamed White Rice or Jasmine Fried Rice)
        </p>

        {chefSpecials.map(([code, name, price, description], index) => (
          <div
            key={code}
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
                <span style={{ color: '#cc0000', fontWeight: 600 }}>{code}</span> {name}
              </span>
              <span style={{ textAlign: 'right', minWidth: '60px' }}>${price.toFixed(2)}</span>
            </div>

            {hoverIndex === index && (
              <p style={{ marginTop: '6px', fontSize: '0.85rem', color: '#555' }}>{description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChefSpecialMenu;
