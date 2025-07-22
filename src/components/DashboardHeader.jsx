import React from "react";
import { MapPin, Activity } from "lucide-react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo-container">
            <Activity className="header-icon" />
            <MapPin className="header-icon map-icon" />
          </div>
          <div className="title-container">
            <h1 className="header-title">Dashboard SunuChat</h1>
            <span className="header-subtitle">Surveillance Épidémiologique</span>
          </div>
        </div>
        <div className="header-right">
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-label">Régions</span>
              <span className="stat-value">14</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Maladies</span>
              <span className="stat-value">2</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
