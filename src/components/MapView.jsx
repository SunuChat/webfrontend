import React, { useState, useMemo, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import PropTypes from "prop-types";
import { CircularProgress, Alert, Snackbar } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";

const MapView = ({ data, selectedYear, selectedDisease, selectedMonth }) => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [adminLevel, setAdminLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [theme, setTheme] = useState("light");

  // Validation des données
  useEffect(() => {
    try {
      if (!Array.isArray(data)) {
        throw new Error("Les données doivent être un tableau");
      }

      const requiredFields = [
        "Region",
        "Cas_confirmes",
        "Morts",
        "Temperature_moy",
        "Humidite_moy",
        "Densite",
      ];
      data.forEach((item, index) => {
        requiredFields.forEach((field) => {
          if (!(field in item)) {
            throw new Error(`Champ manquant: ${field} à l'index ${index}`);
          }
        });
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [data]);

  // Calcul des métriques par région
  const regionMetrics = useMemo(() => {
    if (!data || data.length === 0) return {};

    const metrics = {};

    data.forEach((d) => {
      const region = d.Region;
      if (!metrics[region]) {
        metrics[region] = {
          cases: 0,
          death: 0,
          temperature: [],
          humidity: [],
          density: 0,
        };
      }

      metrics[region].cases += d.Cas_confirmes;
      metrics[region].death += d.Morts;
      metrics[region].temperature.push(d.Temperature_moy);
      metrics[region].humidity.push(d.Humidite_moy);
      metrics[region].density = d.Densite;
    });

    Object.keys(metrics).forEach((region) => {
      const tempSum = metrics[region].temperature.reduce((a, b) => a + b, 0);
      const humiditySum = metrics[region].humidity.reduce((a, b) => a + b, 0);

      metrics[region].avgTemperature = (
        tempSum / metrics[region].temperature.length
      ).toFixed(1);
      metrics[region].avgHumidity = (
        humiditySum / metrics[region].humidity.length
      ).toFixed(1);
    });

    return metrics;
  }, [data]);

  // Échelle de couleurs basée sur le nombre maximum de cas
  const maxCases = Math.max(
    ...Object.values(regionMetrics).map((m) => m.cases)
  );
  const colorScale = scaleQuantize()
    .domain([0, maxCases])
    .range(
      theme === "dark"
        ? [
            "#1a365d",
            "#2c5282",
            "#2b6cb0",
            "#3182ce",
            "#4299e1",
            "#63b3ed",
            "#90cdf4",
            "#bee3f8",
            "#ebf8ff",
          ]
        : [
            "#e6f3ff",
            "#b3d9ff",
            "#80bfff",
            "#4da6ff",
            "#1a8cff",
            "#0073e6",
            "#0059b3",
            "#004080",
            "#00264d",
          ]
    );

  const handleMouseEnter = (geo, event) => {
    const region = getRegionName(geo);
    const metrics = regionMetrics[region];

    if (metrics) {
      setTooltipContent({
        region,
        cases: metrics.cases,
        death: metrics.death,
        temperature: metrics.avgTemperature,
        humidity: metrics.avgHumidity,
        density: metrics.density,
      });
      setTooltipPosition({ x: event.clientX, y: event.clientY });
      setIsTooltipVisible(true);
      setHoveredRegion(region);
    }
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
    setHoveredRegion(null);
  };

  const handleRegionClick = (region) => {
    if (comparisonMode) {
      setSelectedRegions((prev) => {
        if (prev.includes(region)) {
          return prev.filter((r) => r !== region);
        }
        if (prev.length < 3) {
          return [...prev, region];
        }
        return prev;
      });
    }
  };

  const getRegionName = (geo) => {
    switch (adminLevel) {
      case 1:
        return geo.properties.NAME_1;
      case 2:
        return geo.properties.NAME_2;
      case 3:
        return geo.properties.NAME_3;
      default:
        return geo.properties.NAME_1;
    }
  };

  const containerStyle = {
    margin: "2rem auto",
    position: "relative",
    backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
    borderRadius: "1.5rem",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    padding: "2rem",
    display: "flex",
    gap: "2rem",
    height: "800px",
    color: theme === "dark" ? "#ffffff" : "#000000",
    transition: "all 0.3s ease",
  };

  const mapContainerStyle = {
    flex: "1",
    minWidth: "0",
    position: "relative",
    height: "100%",
    backgroundColor: theme === "dark" ? "#2d2d2d" : "#f8fafc",
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.05)",
  };

  const mapStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: theme === "dark" ? "#2d2d2d" : "#f8fafc",
  };

  const legendStyle = {
    position: "absolute",
    right: "30px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor:
      theme === "dark" ? "rgba(45, 45, 45, 0.95)" : "rgba(255, 255, 255, 0.95)",
    padding: "1rem",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    maxWidth: "180px",
    backdropFilter: "blur(8px)",
    border: `1px solid ${
      theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    }`,
  };

  const legendItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "0.85rem",
    color: theme === "dark" ? "#e5e7eb" : "#4b5563",
    transition: "all 0.2s ease",
  };

  const legendColorBoxStyle = {
    width: "16px",
    height: "16px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: theme === "dark" ? "#ffffff" : "#1f2937",
    fontSize: "1.5rem",
    fontWeight: "600",
    letterSpacing: "0.5px",
  };

  const tooltipStyle = {
    position: "fixed",
    backgroundColor:
      theme === "dark" ? "rgba(45, 45, 45, 0.95)" : "rgba(255, 255, 255, 0.95)",
    padding: "1.25rem",
    borderRadius: "0.75rem",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    pointerEvents: "none",
    minWidth: "280px",
    border: `1px solid ${
      theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    }`,
    color: theme === "dark" ? "#ffffff" : "#000000",
    backdropFilter: "blur(8px)",
    transition: "all 0.2s ease",
  };

  const tooltipTitleStyle = {
    fontWeight: "600",
    marginBottom: "1rem",
    color: theme === "dark" ? "#ffffff" : "#1f2937",
    fontSize: "1.2rem",
    borderBottom: `2px solid ${
      theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    }`,
    paddingBottom: "0.75rem",
    letterSpacing: "0.5px",
  };

  const tooltipItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.75rem",
    fontSize: "0.9rem",
    color: theme === "dark" ? "#e5e7eb" : "#4b5563",
    transition: "all 0.2s ease",
  };

  if (loading) {
    return (
      <div
        style={{
          ...containerStyle,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          ...containerStyle,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Alert severity="error" sx={{ width: "100%", maxWidth: 500 }}>
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <div
          style={{
            ...containerStyle,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Alert severity="error" sx={{ width: "100%", maxWidth: 500 }}>
            Une erreur est survenue: {error.message}
          </Alert>
        </div>
      )}
    >
      <div style={containerStyle}>
        <div style={mapContainerStyle}>
          <h2 style={titleStyle}>Carte des cas par région</h2>
          <div
            style={{
              marginBottom: "1.5rem",
              textAlign: "center",
              color: theme === "dark" ? "#e5e7eb" : "#6b7280",
              fontSize: "0.9rem",
              letterSpacing: "0.5px",
            }}
          >
            <span>
              Niveau:{" "}
              {adminLevel === 1
                ? "Région"
                : adminLevel === 2
                ? "Département"
                : "Arrondissement"}
            </span>
          </div>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: [-14.5, 14.5],
              scale: 5000,
            }}
            style={mapStyle}
          >
            <Geographies geography="/senegal-regions.geojson">
              {({ geographies }) =>
                geographies.map((geo) => {
                  const region = geo.properties.NAME_1;
                  const metrics = regionMetrics[region];
                  const fill = metrics ? colorScale(metrics.cases) : "#F5F4F6";
                  const isSelected = selectedRegions.includes(region);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke={theme === "dark" ? "#404040" : "#FFFFFF"}
                      strokeWidth={isSelected ? 2 : 0.5}
                      style={{
                        default: {
                          outline: "none",
                          transition: "all 0.3s ease-in-out",
                        },
                        hover: {
                          outline: "none",
                          fill: "#1a8cff",
                          stroke: theme === "dark" ? "#404040" : "#FFFFFF",
                          strokeWidth: 1.5,
                          cursor: "pointer",
                          filter: "brightness(1.1)",
                        },
                        pressed: {
                          outline: "none",
                          filter: "brightness(0.95)",
                        },
                      }}
                      onMouseEnter={(event) => handleMouseEnter(geo, event)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleRegionClick(region)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Région ${region}`}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        <div style={legendStyle}>
          <div style={legendItemStyle}>
            <div
              style={{
                ...legendColorBoxStyle,
                backgroundColor: colorScale.range()[0],
              }}
            />
            <span>0-100 cas</span>
          </div>
          <div style={legendItemStyle}>
            <div
              style={{
                ...legendColorBoxStyle,
                backgroundColor: colorScale.range()[2],
              }}
            />
            <span>101-500 cas</span>
          </div>
          <div style={legendItemStyle}>
            <div
              style={{
                ...legendColorBoxStyle,
                backgroundColor: colorScale.range()[4],
              }}
            />
            <span>501-1000 cas</span>
          </div>
          <div style={legendItemStyle}>
            <div
              style={{
                ...legendColorBoxStyle,
                backgroundColor: colorScale.range()[6],
              }}
            />
            <span>1001-2000 cas</span>
          </div>
          <div style={legendItemStyle}>
            <div
              style={{
                ...legendColorBoxStyle,
                backgroundColor: colorScale.range()[8],
              }}
            />
            <span>2000+ cas</span>
          </div>
        </div>

        {isTooltipVisible && tooltipContent && (
          <div
            style={{
              ...tooltipStyle,
              left: tooltipPosition.x + 15,
              top: tooltipPosition.y - 15,
            }}
            role="tooltip"
            aria-label={`Informations sur ${tooltipContent.region}`}
          >
            <div style={tooltipTitleStyle}>{tooltipContent.region}</div>
            <div style={tooltipItemStyle}>
              <span>Cas confirmés:</span>
              <span style={{ fontWeight: "500" }}>
                {tooltipContent.cases.toLocaleString()}
              </span>
            </div>
            <div style={tooltipItemStyle}>
              <span>Morts:</span>
              <span style={{ fontWeight: "500" }}>
                {tooltipContent.death.toLocaleString()}
              </span>
            </div>
            <div style={tooltipItemStyle}>
              <span>Température moyenne:</span>
              <span style={{ fontWeight: "500" }}>
                {tooltipContent.temperature}°C
              </span>
            </div>
            <div style={tooltipItemStyle}>
              <span>Humidité moyenne:</span>
              <span style={{ fontWeight: "500" }}>
                {tooltipContent.humidity}%
              </span>
            </div>
            <div style={tooltipItemStyle}>
              <span>Densité:</span>
              <span style={{ fontWeight: "500" }}>
                {tooltipContent.density.toLocaleString()} hab/km²
              </span>
            </div>
          </div>
        )}

        <Snackbar
          open={selectedRegions.length > 0}
          message={`${selectedRegions.length} région(s) sélectionnée(s) pour la comparaison`}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          sx={{
            "& .MuiSnackbarContent-root": {
              backgroundColor: theme === "dark" ? "#2d2d2d" : "#1a8cff",
              color: "#ffffff",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
};

MapView.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Region: PropTypes.string.isRequired,
      Cas_confirmes: PropTypes.number.isRequired,
      Morts: PropTypes.number.isRequired,
      Temperature_moy: PropTypes.number.isRequired,
      Humidite_moy: PropTypes.number.isRequired,
      Densite: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedYear: PropTypes.string.isRequired,
  selectedDisease: PropTypes.string.isRequired,
  selectedMonth: PropTypes.string,
};

export default React.memo(MapView);
