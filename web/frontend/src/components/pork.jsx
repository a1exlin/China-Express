import React, { useState } from 'react';

const roastPorkItems = [
    ["73. Roast Pork w. Mixed Vegs.", 11.75],
    ["74. Roast Pork w. Broccoli", 11.75],
    ["75. Roast Pork, Hunan Style", 11.75],
    ["76. Roast Pork, Szechuan Style", 11.75],
    ["77. Roast Pork w. Garlic Sauce", 11.75],
];

const formattedItems = roastPorkItems.map(([name, price, description]) => ({
    name,
    price: `$${price.toFixed(2)}`,
    description: description || "Served with Jasmine Rice. Classic pork dishes packed with flavor.",
}));

function RoastPorkMenu() {
    const [hoverIndex, setHoverIndex] = useState(null);

    return (
        <div style={wrapperStyle}>
            <div style={boxStyle}>
                <h2 style={headerStyle}>Roast Pork</h2>
                <div style={redLineStyle} />
                <p style={subtitleStyle}>(w. Jasmine Steamed White Rice or Jasmine Fried Rice)</p>

                {formattedItems.map((item, index) => {
                    const [code, ...rest] = item.name.split(' ');
                    const itemName = rest.join(' ');
                    return (
                        <div
                            key={index}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                            style={{
                                ...itemStyle,
                                backgroundColor: hoverIndex === index ? '#f0f0f0' : 'transparent',
                            }}
                        >
                            <div style={itemRowStyle}>
                                <span style={{ flexGrow: 1 }}>
                                    <span style={{ color: '#cc0000', fontWeight: 600 }}>{code}</span> {itemName}
                                </span>
                                <span style={{ minWidth: '60px', textAlign: 'right' }}>{item.price}</span>
                            </div>
                            {hoverIndex === index && (
                                <p style={descriptionStyle}>{item.description}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RoastPorkMenu;

const wrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 10px',
    backgroundColor: '#fff',
    minHeight: 'auto',
};

const boxStyle = {
    maxWidth: '700px',
    width: '100%',
    backgroundColor: '#fefefe',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    color: '#000',
};

const headerStyle = {
    textAlign: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '4px',
};

const redLineStyle = {
    height: '3px',
    backgroundColor: '#cc0000',
    width: '100%',
    marginBottom: '12px',
};

const subtitleStyle = {
    fontSize: '0.95rem',
    textAlign: 'center',
    marginBottom: '16px',
};

const itemStyle = {
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
    transition: 'background-color 0.2s ease-in-out',
};

const itemRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
};

const descriptionStyle = {
    marginTop: '6px',
    fontSize: '0.85rem',
    color: '#555',
};

