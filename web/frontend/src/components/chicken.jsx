import React, { useState } from 'react';

const chickenItems = [
    ["26. Sesame Chicken", 13.60],
    ["27. General Tso’s Chicken", 13.60],
    ["28. Orange Chicken", 13.60],
    ["29. Mongolian Chicken", 12.85],
    ["30. Moo Goo Gai Pan", 12.85],
    ["31. Chicken w. Snow Peas", 12.85],
    ["32. Chicken w. Cashew Nuts", 12.85],
    ["33. Chicken w. Broccoli", 12.85],
    ["34. Chicken, Hunan Style", 12.85],
    ["35. Kung Po Chicken", 12.85],
    ["36. Chicken, Szechuan Style", 12.85],
    ["37. Chicken w. Garlic Sauce", 12.85],
    ["38. Curry Chicken", 12.85],
    ["39. Chicken w. Mixed Vegetables", 12.85],
    ["53. Sweet & Sour Chicken", 12.00],
];

const formattedChicken = chickenItems.map(([name, price]) => ({
    name,
    price: `$${price.toFixed(2)}`,
    description: "A flavorful chicken entrée served with rice.",
}));

function ChickenMenu() {
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
                    Chicken
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
                    (w. Jasmine Steamed White Rice or Jasmine Fried Rice)
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

                {formattedChicken.map((item, index) => {
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

export default ChickenMenu;
