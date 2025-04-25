import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Order from "./pages/Order";
import Menu from "./pages/Menu";

// Components
import NavBar from "./components/navBar";

function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to="/home" />} />
          <Route
            path="/home"
            element={
              <div>
                <NavBar />
                <Home />
              </div>
            }
          />
          <Route
            path="/menu"
            element={
              <div>
                <NavBar />
                <Menu />
              </div>
            }
          />
          <Route
            path="/order"
            element={
              <div>
                <NavBar />
                <Order />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
