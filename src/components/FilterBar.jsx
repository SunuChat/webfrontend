import React from "react";
import { Calendar, Activity, Clock } from "lucide-react";

const FilterBar = ({
  data,
  selectedYear,
  setSelectedYear,
  selectedDisease,
  setSelectedDisease,
  selectedMonth,
  setSelectedMonth,
}) => {
  const uniqueYears = Array.from(new Set(data.map((d) => d.Annee))).sort().reverse();
  const uniqueDiseases = Array.from(new Set(data.map((d) => d.Maladie)));
  const uniqueMonths = Array.from(new Set(data.map((d) => d.Mois))).sort();

  const selectStyle = {
    padding: "0.75rem 1rem",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "0.75rem",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    width: "100%",
    fontSize: "0.9rem",
    color: "#1f2937",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "1rem",
    paddingRight: "2.5rem",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.75rem",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#4b5563",
  };

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
    margin: "2rem auto",
    padding: "1.5rem",
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    maxWidth: "1400px",
    width: "95%",
  };

  const filterGroupStyle = {
    position: "relative",
  };

  const iconStyle = {
    width: "18px",
    height: "18px",
    color: "#6b7280",
  };

  return (
    <div style={containerStyle}>
      <div style={filterGroupStyle}>
        <label style={labelStyle} htmlFor="year-select">
          <Calendar style={iconStyle} />
          Année
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={selectStyle}
        >
          <option value="Toutes">Toutes les années</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div style={filterGroupStyle}>
        <label style={labelStyle} htmlFor="disease-select">
          <Activity style={iconStyle} />
          Maladie
        </label>
        <select
          id="disease-select"
          value={selectedDisease}
          onChange={(e) => setSelectedDisease(e.target.value)}
          style={selectStyle}
        >
          <option value="Toutes">Toutes les maladies</option>
          {uniqueDiseases.map((dis) => (
            <option key={dis} value={dis}>
              {dis}
            </option>
          ))}
        </select>
      </div>

      <div style={filterGroupStyle}>
        <label style={labelStyle} htmlFor="month-select">
          <Clock style={iconStyle} />
          Mois
        </label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={selectStyle}
        >
          <option value="Tous">Tous les mois</option>
          {uniqueMonths.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
