import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home';
import DinnerMenu from './components/dinner';
import LunchMenu from './components/lunch';
import NavBar from './components/NavBar';
import Order from './components/order';
import SpecialsMenu from './components/specials';
import AppetizersMenu from './components/appetizers';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
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
            path="/dinner_menu"
            element={
              <div>
                <NavBar />
                <DinnerMenu />
              </div>
            }
          />
          <Route
            path="/lunch_menu"
            element={
              <div>
                <NavBar />
                <LunchMenu />
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
          <Route
            path="/specials"
            element={
              <div>
                <NavBar />
                <SpecialsMenu />
              </div>
            }
          />
          <Route
            path="/appetizers"
            element={
              <div>
                <NavBar />
                <AppetizersMenu />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>


  );
}

export default App;
