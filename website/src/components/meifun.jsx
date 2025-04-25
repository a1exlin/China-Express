import React, { useState } from 'react';

const chowMeiFunItems = [
    ["68. Beef Mei Fun", 12.20],
    ["69. Chicken or Pork Mei Fun", 12.20],
    ["70. Shrimp Mei Fun", 12.20],
    ["71. House Special Mei Fun", 12.20, "Chicken, shrimp & pork"],
    ["72. Singapore Style Mei Fun", 12.20, "Chicken, shrimp & pork, curry spicy"],
];

const formattedItems = chowMeiFunItems.map(([name, price, description]) => ({
    name,
    price: `$${price.toFixed(2)}`,
    description: description || "Thin rice noodles stir-fried with vegetables and meat.",
}));

function ChowMeiFunMenu() {
    const [hoverIndex, setHoverIndex] = useState(null);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 10px', backgroundColor: '#fff', minHeight: 'auto' }}>
            <div style={{ maxWidth: '700px', width: '100%', backgroundColor: '#fefefe', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', color: '#000' }}>
                <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Chow Mei Fun</h2>
                <div style={{ height: '3px', backgroundColor: '#cc0000', width: '100%', marginBottom: '12px' }} />
                <p style={{ fontSize: '0.95rem', textAlign: 'center', marginBottom: '16px' }}>
                    (Thin Rice Noodles) — Per Order
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#444', paddingBottom: '6px', fontSize: '0.95rem' }}>
                    <span></span>
                    <span style={{ minWidth: '60px', textAlign: 'right' }}>Price</span>
                </div>

                {formattedItems.map((item, index) => {
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                <span style={{ flexGrow: 1 }}>
                                    <span style={{ color: '#cc0000', fontWeight: 600 }}>{itemCode}</span> {itemName}
                                </span>
                                <span style={{ minWidth: '60px', textAlign: 'right' }}>{item.price}</span>
                            </div>
                            {hoverIndex === index && (
                                <p style={{ marginTop: '6px', fontSize: '0.85rem', color: '#555' }}>{item.description}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ChowMeiFunMenu;