import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/NavBar.css";
import logo from "../image/ChinaExpressLogo.png";

function NavBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <div className="NavBarComp" style={{ height: "50px" }}></div>

      <div className="navbar-wrapper">
        <div className="navbar-inner">
          <button className="navbar-button" onClick={() => navigate("/home")}>
            <img className="navbar-logo" src={logo} alt="China Express Logo" />
          </button>

          {/* Toggle dropdown menu */}
          <div
            className="dropdown-container"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            {" "}
            <button className="navbar-button">Menu</button>
            {/* Dropdown items */}
            {menuOpen && (
              <div className="menu-dropdown">
                <button
                  className="navbar-button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/specials");
                  }}
                >
                  Specials
                </button>
                <button
                  className="navbar-button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/appetizers");
                  }}
                >
                  Appetizers
                </button>
                <button
                  className="navbar-button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/lunch_menu");
                  }}
                >
                  Lunch
                </button>
                <button
                  className="navbar-button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/dinner_menu");
                  }}
                >
                  Dinner
                </button>
              </div>
            )}
          </div>

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
