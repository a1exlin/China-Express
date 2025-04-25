import React from 'react';
import '../css/specials.css'
const specials = [
    { id: "A1", name: "Braised Wings (8 pcs)", notes: "with red brown sauce smell", solo: 9.00, friedRice: 11.50, porkOrChicken: 12.15, shrimp: 12.45 },
    { id: "A2", name: "Fried Chicken Wings (8 pcs)", solo: 9.00, friedRice: 11.50, porkOrChicken: 12.15, shrimp: 12.45 },
    { id: "A3", name: "Buffalo Chicken Wings (8 pcs)", solo: 9.00, friedRice: 11.50, porkOrChicken: 12.15, shrimp: 12.45 },
    { id: "A4", name: "Honey B.B.Q Chicken Wings (8 pcs)", solo: 9.00, friedRice: 11.50, porkOrChicken: 12.15, shrimp: 12.45 },
    { id: "A5", name: "Lemon Pepper Wings (8 pcs)", solo: 9.00, friedRice: 11.50, porkOrChicken: 12.15, shrimp: 12.45 },
    { id: "A6", name: "Bar-B-Q Spare Ribs (4 pcs)", solo: 10.75, friedRice: 12.00, porkOrChicken: 12.45, shrimp: 12.45 },
    { id: "A7", name: "Butterfly Shrimp (10 pcs)", solo: 8.40, friedRice: 10.40, porkOrChicken: 11.25, shrimp: 11.45 },
    { id: "A8", name: "Fried Scallops (12 pcs)", solo: 7.80, friedRice: 9.40, porkOrChicken: 10.30, shrimp: 10.55 },
    { id: "A9", name: "BBQ Spare Rib Tips", solo: 9.00, friedRice: 10.00, porkOrChicken: 11.40, shrimp: 11.65 },
];

function SpecialsMenu() {
    return (
        <div className="menu-section">
            <h2>Specials</h2>
            <table className="menu-table">
                <thead>
                    <tr>
                        <th>Special Items</th>
                        <th>Wing Only</th>
                        <th>Fried Rice, White Rice or French Fries</th>
                        <th>Pork/Chicken/Egg or Beef Fried Rice</th>
                        <th>Shrimp or House Fried Rice</th>
                    </tr>
                </thead>
                <tbody>
                    {specials.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <strong>{item.id}</strong> {item.name}
                                {item.notes && <em style={{ fontSize: '0.85em', display: 'block' }}>{item.notes}</em>}
                            </td>
                            <td>${item.solo.toFixed(2)}</td>
                            <td>${item.friedRice.toFixed(2)}</td>
                            <td>${item.porkOrChicken.toFixed(2)}</td>
                            <td>${item.shrimp.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: "1em", fontSize: "0.85em" }}>
                <strong>Wings Flavors:</strong> Fried Wings w. Seasoned Salt, Buffalo, Lemon Pepper, Hot Lemon Pepper, Honey Lemon Pepper, Honey BBQ, Hot Honey BBQ, Hot Honey, Garlic Pepper, Honey Garlic Pepper, Hot Braised, Braised.
            </div>
        </div>
    );
}

export default SpecialsMenu;