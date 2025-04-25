import React, { useState } from 'react';

const soupRaw = [
    ["Egg Drop Soup", 2.10, 3.85, "A light chicken broth with egg ribbons."],
    ["Wonton Soup", 2.10, 3.85, "Clear broth with pork wontons and scallions."],
    ["Chicken Noodle Soup", 2.20, 4.30, "Classic noodles in chicken broth with shredded chicken."],
    ["Chicken Rice Soup", 2.20, 4.30, "Savory chicken broth with rice and chicken."],
    ["Vegetable Bean Curd Soup", 2.50, 5.00, "Mixed vegetables with soft tofu in light broth."],
    ["House Special Soup", null, 7.25, "Seafood, meat, and veggies in a rich, flavorful broth."],
    ["Seafood Soup", null, 9.45, "A deluxe seafood blend in a hearty broth."],
    ["Hot & Sour Soup", 2.85, 4.25, "Spicy and tangy broth with tofu and vegetables."],
];

export default function SoupMenu() {
    const [hoverIndex, setHoverIndex] = useState(null);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                minHeight: '100vh',
                padding: '20px',
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: '700px',
                    padding: '20px 24px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <h2
                        style={{
                            fontSize: '1.6rem',
                            fontWeight: 'bold',
                            color: '#111',
                            marginBottom: '6px',
                        }}
                    >
                        Soup
                    </h2>
                    <div
                        style={{
                            height: '3px',
                            width: '100%',
                            maxWidth: '100%',
                            backgroundColor: '#cc0000',
                            margin: '0 auto 12px',
                        }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '12px' }}>
                        (with Fried Noodles)
                    </p>
                </div>

                {soupRaw.map(([name, small, large, description], index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '6px 0',
                            borderBottom: '1px solid #eee',
                            fontSize: '0.95rem',
                            color: '#000',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                            }}
                        >
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <span style={{ fontWeight: '600', color: '#a00' }}>{index + 1}.</span>
                                <span>{name}</span>
                            </div>
                            <div style={{ textAlign: 'right', minWidth: '160px' }}>
                                {typeof small === 'number' && (
                                    <span style={{ marginRight: large ? '8px' : 0 }}>
                                        <span>(Sm)</span> ${small.toFixed(2)}
                                    </span>
                                )}
                                {typeof large === 'number' && (
                                    <span>
                                        <span>(Lg)</span> ${large.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {hoverIndex === index && (
                            <p
                                style={{
                                    marginTop: '4px',
                                    marginLeft: '28px',
                                    fontSize: '0.8rem',
                                    color: '#666',
                                    fontStyle: 'italic',
                                }}
                            >
                                {description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
