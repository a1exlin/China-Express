import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
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
              onClick={() => setCheckoutOpen((prev) => !prev)}
            >
            <FontAwesomeIcon icon={faCartShopping} />
            </button>
          </div>
        </div>
      </div>
      <div className="NavBarComp" style={{ height: "60px" }}></div>
    </div>
  );
}

export default NavBar;
