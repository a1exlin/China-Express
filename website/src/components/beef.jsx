import React, { useState } from 'react';

const beefItems = [
    ["16. Beef w. Broccoli", 14.70],
    ["17. Mongolian Beef", 14.70],
    ["18. Beef w. Snow Peas", 14.70],
    ["19. Kung Po Beef", 14.70],
    ["20. Beef w. Garlic Sauce", 14.70],
    ["21. Beef, Szechuan Style", 14.70],
    ["22. Beef, Hunan Style", 14.70],
    ["23. Curry Beef", 14.70],
    ["24. Beef w. Mixed Vegetables", 14.70],
    ["25. Pepper Steak w. Onion", 14.70],
];

const formattedBeef = beefItems.map(([name, price]) => ({
    name,
    price: `$${price.toFixed(2)}`,
    description: "A savory beef entrée served with rice.",
}));

function BeefMenu() {
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
                    Beef Dishes
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

                {/* Price label */}
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

                {formattedBeef.map((item, index) => {
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

export default BeefMenu;
