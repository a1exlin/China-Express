import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/NavBar.css";

function NavBar() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="NavBarComp" style={{ height: "50px" }}></div>

            <div className="navbar-wrapper">
                <div className="navbar-inner">
                    <button className="navbar-button" onClick={() => navigate("/home")}>
                        🏠
                    </button>
                    <button className="navbar-button" onClick={() => navigate("/specials")}>
                        Specials
                    </button>
                    <button className="navbar-button" onClick={() => navigate("/appetizers")}>
                        Appetizers
                    </button>
                    <button className="navbar-button" onClick={() => navigate("/soups")}>
                        Soups
                    </button>
                    <button className="navbar-button" onClick={() => navigate("/lunch_menu")}>
                        Lunch
                    </button>
                    <button className="navbar-button" onClick={() => navigate("/dinner_menu")}>
                        Dinner
                    </button>
                    <button className="navbar-button" onClick={() => navigate("/side_orders")}>
                        Side Orders
                    </button>
                    <button className="navbar-button" onClick={() => navigate("/beef_dishes")}>
                        Beef Dishes
                    </button>
                    <button className="navbar-button" onClick={() => navigate("/chicken_dishes")}>
                        Chicken Dishes
                    </button>
                    <button className="navbar-button" onClick={() => navigate("/vegetable_dishes")}>
                        Vegetable Dishes
                    </button>
                    <button className="navbar-button" onClick={() => navigate("/seafood_dishes")}>
                        Seafood Dishes
                    </button>
                    <div style={{ marginLeft: "auto" }}>
                        <button
                            className="navbar-button order-button"
                            onClick={() => navigate("/order")}
                        >
                            Order Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
