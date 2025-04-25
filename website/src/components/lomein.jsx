import React, { useState } from 'react';

const loMeinItems = [
    ["61. Vegetable Lo Mein", 8.45, 10.25],
    ["62. Pork or Chicken Lo Mein", 8.95, 11.35],
    ["63. Shrimp or Beef Lo Mein", 9.15, 12.00],
    ["64. House Special Lo Mein", 9.15, 12.00, "chicken, shrimp & pork"],
];

const formattedLoMein = loMeinItems.map(([name, sm, lg, description]) => ({
    name,
    small: `$${sm.toFixed(2)}`,
    large: `$${lg.toFixed(2)}`,
    description: description || "Stir-fried soft noodles with vegetables and protein.",
}));

export default function LoMeinMenu() {
    const [hoverIndex, setHoverIndex] = useState(null);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 10px', backgroundColor: '#fff', minHeight: 'auto' }}>
            <div style={{ maxWidth: '700px', width: '100%', backgroundColor: '#fefefe', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', color: '#000' }}>
                <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Lo Mein</h2>
                <div style={{ height: '3px', backgroundColor: '#cc0000', width: '100%', marginBottom: '12px' }} />
                <p style={{ fontSize: '0.95rem', textAlign: 'center', marginBottom: '16px' }}>(Soft Noodles)</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#444', paddingBottom: '6px', fontSize: '0.95rem' }}>
                    <span></span>
                    <span style={{ display: 'flex', gap: '20px', minWidth: '120px', justifyContent: 'flex-end' }}>
                        <span>Sm.</span>
                        <span>Lg.</span>
                    </span>
                </div>
                {formattedLoMein.map((item, index) => {
                    const [itemCode, ...rest] = item.name.split(' ');
                    const itemName = rest.join(' ');
                    return (
                        <div
                            key={index}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                            style={{ padding: '10px 0', borderBottom: '1px solid #ddd', backgroundColor: hoverIndex === index ? '#f0f0f0' : 'transparent', transition: 'background-color 0.2s ease-in-out' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                                <span style={{ flexGrow: 1 }}>
                                    <span style={{ color: '#cc0000', fontWeight: 600 }}>{itemCode}</span> {itemName}
                                </span>
                                <span style={{ display: 'flex', gap: '20px', minWidth: '120px', justifyContent: 'flex-end' }}>
                                    <span>{item.small}</span>
                                    <span>{item.large}</span>
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
