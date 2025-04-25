import React, { useState } from 'react';

const eggFooItems = [
    ["65. Shrimp Egg Foo Young", 12.50],
    ["66. Vegetable Egg Foo Young", 11.50],
    ["67. Chicken Egg Foo Young", 11.75],
    ["68. Beef Egg Foo Young", 12.00],
    ["69. House Egg Foo Young", 12.00],
];

const formattedEggFoo = eggFooItems.map(([name, price]) => ({
    name,
    price: `$${price.toFixed(2)}`,
    description: "Served with Jasmine Steamed White Rice or Jasmine Fried Rice (3 patties).",
}));

function EggFooYoungMenu() {
    const [hoverIndex, setHoverIndex] = useState(null);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 10px', backgroundColor: '#fff', minHeight: 'auto' }}>
            <div style={{ maxWidth: '700px', width: '100%', backgroundColor: '#fefefe', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', color: '#000' }}>
                <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '4px' }}>Egg Foo Young</h2>
                <div style={{ height: '3px', backgroundColor: '#cc0000', width: '100%', marginBottom: '12px' }} />
                <p style={{ fontSize: '0.95rem', textAlign: 'center', marginBottom: '16px' }}>
                    (w. Jasmine Steamed White Rice or Jasmine Fried Rice) <br /> All come with 3 patties.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#444', paddingBottom: '6px', fontSize: '0.95rem' }}>
                    <span></span>
                    <span style={{ minWidth: '60px', textAlign: 'right' }}>Lg.</span>
                </div>
                {formattedEggFoo.map((item, index) => {
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
                                transition: 'background-color 0.2s ease-in-out'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                <span style={{ flexGrow: 1 }}>
                                    <span style={{ color: '#cc0000', fontWeight: 600 }}>{itemCode}</span> {itemName}
                                </span>
                                <span style={{ minWidth: '60px', textAlign: 'right', whiteSpace: 'nowrap' }}>{item.price}</span>
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

export default EggFooYoungMenu;