import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import "../css/navBar.css";
import logo from "../image/ChinaExpressLogo.png";

function NavBar({ setCheckoutOpen }) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="navbar-wrapper">
        <div className="navbar-inner">
          {/* Logo Button */}
          <button className="navbar-button" onClick={() => navigate("/home")}>
            <img className="navbar-logo" src={logo} alt="China Express Logo" />
          </button>

          {/* Menu Button */}
          <button className="navbar-button" onClick={() => navigate("/menu")}>
            Menu
          </button>

          {/* Cart Button */}
          <div style={{ marginLeft: "auto" }}>
            <FontAwesomeIcon
              icon={faCartShopping}
              className="navbar-button order-button"
              onClick={() => setCheckoutOpen((prev) => !prev)}
            />
          </div>
        </div>
      </div>

      {/* Spacer div */}
      <div className="NavBarComp" style={{ height: "60px" }}></div>
    </div>
  );
}

export default NavBar;
