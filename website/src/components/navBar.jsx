import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/navBar.css";
import logo from "../image/ChinaExpressLogo.png";

function NavBar({ isCheckoutOpen, setCheckoutOpen }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <div className="navbar-wrapper">
        <div className="navbar-inner">
          <button className="navbar-button" onClick={() => navigate("/home")}>
            <img className="navbar-logo" src={logo} alt="China Express Logo" />
          </button>
          <button className="navbar-button" onClick={() => navigate("/menu")}>
            Menu
          </button>

          <div style={{ marginLeft: "auto" }}>
            <button
              className="navbar-button order-button"
              onClick={() => setCheckoutOpen(prev => !prev)}
            >
              {isCheckoutOpen ? "Close Order" : "Order Now"}
            </button>

          </div>
        </div>
      </div>
      <div className="NavBarComp" style={{ height: "60px" }}></div>
    </div>
  );
}

export default NavBar;
