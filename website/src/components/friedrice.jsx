import React, { useState } from 'react';

const friedRiceItems = [
    ["54. Vegetable Fried Rice", 7.75, 9.95],
    ["55. Egg Fried Rice", 7.45, 8.95],
    ["56. Roast Pork Fried Rice", 8.40, 10.45],
    ["57. Chicken Fried Rice", 8.40, 10.45],
    ["58. Beef Fried Rice", 8.45, 11.15],
    ["59. Shrimp Fried Rice", 8.45, 11.35],
    ["60. House Special Fried Rice", 8.45, 11.45, "chicken, shrimp & pork"],
];

const formattedFriedRice = friedRiceItems.map(([name, sm, lg, description]) => ({
    name,
    small: `$${sm.toFixed(2)}`,
    large: `$${lg.toFixed(2)}`,
    description: description || "Served with Jasmine Steamed White Rice or Jasmine Fried Rice.",
}));

function FriedRiceMenu() {
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
                    Fried Rice
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

                {/* Column labels */}
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
                    <span style={{ display: 'flex', gap: '20px', minWidth: '120px', justifyContent: 'flex-end' }}>
                        <span>Sm.</span>
                        <span>Lg.</span>
                    </span>
                </div>

                {formattedFriedRice.map((item, index) => {
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
                                    flexWrap: 'wrap',
                                    gap: '10px',
                                }}
                            >
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

export default FriedRiceMenu;
