import React, { useState } from 'react';

const sideItems = [
    ["Fortune Cookies (Each)", null, 0.25, "Crisp vanilla-flavored cookies with a paper fortune inside."],
    ["White Rice", 2.25, 3.50, "Steamed plain white rice."],
    ["Fried Noodles", 0.50, 0.75, "Crunchy fried noodle strips for soup or snacking."],
    ["Fried Rice", 3.00, 4.75, "Classic egg fried rice with vegetables."],
    ["Steamed Broccoli", null, 1.50, "Lightly steamed broccoli florets."],
    ["Cup of Sauce", null, 1.50, "Extra dipping or pouring sauce of your choice.", false], // showSizeLabel: false
];

function SideOrders() {
    const [hoverIndex, setHoverIndex] = useState(null);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                minHeight: 'auto',
                padding: '12px',
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: '700px',
                    padding: '18px 20px',
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
                        Side Orders
                    </h2>
                    <div
                        style={{
                            height: '3px',
                            width: '100%',
                            backgroundColor: '#cc0000',
                            margin: '0 auto 10px',
                        }}
                    />
                </div>

                {sideItems.map(([name, small, large, description, showSizeLabel = true], index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '5px 0',
                            borderBottom: '1px solid #eee',
                            fontSize: '0.95rem',
                            color: '#000',
                            backgroundColor: hoverIndex === index ? '#f0f0f0' : 'transparent',
                            transition: 'background-color 0.2s ease-in-out',
                            cursor: 'default',
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
                                        {showSizeLabel && <span>(Sm) </span>}${small.toFixed(2)}
                                    </span>
                                )}
                                {typeof large === 'number' && (
                                    <span>
                                        {showSizeLabel && small !== null && <span>(Lg) </span>}
                                        ${large.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {hoverIndex === index && (
                            <p
                                style={{
                                    marginTop: '3px',
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

export default SideOrders;