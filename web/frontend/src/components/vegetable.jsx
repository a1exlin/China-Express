import React, { useState } from 'react';

const vegetableItems = [
    ["40. Mixed Vegetables", 9.70],
    ["41. Tofu w. Vegetable", 11.25],
    ["42. Broccoli w. Garlic Sauce", 9.70],
    ["43. Tofu, Hunan Style", 11.25],
];

const formattedVegetables = vegetableItems.map(([name, price]) => ({
    name,
    price: `$${price.toFixed(2)}`,
    description: "Served with Jasmine Steamed White Rice or Jasmine Fried Rice.",
}));

function VegetableMenu() {
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
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
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
                    Vegetables
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

                {/* Price column label */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: 'bold',
                        color: '#444',
                        paddingBottom: '6px',
                        fontSize: '0.95rem',
                    }}
                >
                    <span></span>
                    <span style={{ minWidth: '60px', textAlign: 'right' }}>Lg.</span>
                </div>

                {formattedVegetables.map((item, index) => {
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
                                backgroundColor: hoverIndex === index ? '#f9f9f9' : 'transparent',
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
                                <span style={{ flexGrow: 1, fontSize: '1rem' }}>
                                    <span style={{ color: '#cc0000', fontWeight: '600' }}>{itemCode}</span>{' '}
                                    {itemName}
                                </span>
                                <span style={{ minWidth: '60px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    {item.price}
                                </span>
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

export default VegetableMenu;
