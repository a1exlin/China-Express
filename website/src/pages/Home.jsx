import React from "react";
import "../css/home.css";
import banner from "../image/banner.png";
function Home() {
    return (
        <div className="home">
            <div className="banner">
                <img src={banner} alt="China Express Banner" />
                <div className="banner-text">
                    Welcome to China Express Cascade,
                    <br />
                    Let's get you Fed
                </div>
            </div>
        </div>
    );
}

export default Home;
