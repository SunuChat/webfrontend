import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  GeoJSON,
  ScaleControl,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PropTypes from "prop-types";
import { CircularProgress, Alert, Box, Paper, Typography } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { LAYER_CONFIG } from "./MapLayerControls";

// --- CONFIGURATION & STYLES ---

/**
 * Correction pour un bug courant avec Webpack et Leaflet où les icônes par défaut
 * ne se chargent pas correctement.
 */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Style pour le masque qui va "cacher" le reste du monde en dehors du Sénégal.
const maskStyle = {
  fillColor: "#aadaff",
  fillOpacity: 1,
  color: "transparent",
  weight: 0,
  interactive: false,
};

// Constantes de la carte
const SENEGAL_CENTER = [14.4974, -14.4524];
const SENEGAL_BOUNDS = [
  [11, -20], // Limite Sud-Ouest
  [18, -11], // Limite Nord-Est
];

// Style de base pour les polygones des couches administratives.
const adminPolygonStyle = {
  fillOpacity: 0,
  weight: 2,
  opacity: 1,
  color: "#005a9e",
};

// --- NOUVELLE CONFIGURATION DES COULEURS POUR LES INFRASTRUCTURES ---
const HEALTH_INFRA_COLORS = {
  "Poste de Santé": "#FFD600", // Jaune vif
  "Centre de Santé": "#FFA500", // Orange
  "Hôpital": "#E53935", // Rouge
  "Clinique": "#2196F3", // Bleu
  "Maternité": "#E91E63", // Rose
  "Pédiatrie": "#9C27B0", // Violet
  "Brigade d'Hygiène": "#4CAF50", // Vert
  default: "#757575", // Gris pour les autres types
};

// Style de base pour les points d'infrastructure.
const baseHealthPointOptions = {
  radius: 5,
  color: "#fff",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.9,
};

// Style pour les points mis en surbrillance au survol.
const highlightedHealthPointOptions = {
  ...baseHealthPointOptions,
  radius: 7,
  weight: 2,
};

/**
 * NOUVELLE FONCTION : Retourne le style du point en fonction du type de structure.
 * @param {object} feature - L'objet GeoJSON de l'infrastructure.
 * @returns {object} Les options de style pour le marqueur Leaflet.
 */
const getHealthPointStyle = (feature) => {
  const type = feature?.properties?.Type_struc;
  const color = HEALTH_INFRA_COLORS[type] || HEALTH_INFRA_COLORS.default;
  return {
    ...baseHealthPointOptions,
    fillColor: color,
  };
};

/**
 * Composant de secours affiché par ErrorBoundary si une erreur critique se produit.
 */
const FallbackComponent = ({ error }) => (
  <Alert severity="error" sx={{ m: 2 }}>
    Une erreur est survenue sur la carte: {error.message}
  </Alert>
);
// --- COMPOSANTS INTERNES ---

/**
 * NOUVEAU : Composant interne pour afficher une légende dynamique sur la carte.
 * Il utilise le hook `useMap` pour accéder à l'instance de la carte Leaflet
 * et y ajouter un contrôle personnalisé.
 */
const Legend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      div.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      div.style.padding = "10px";
      div.style.borderRadius = "5px";
      div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";

      let content =
        '<h4 style="margin: 0 0 5px 0; font-weight: bold;">Légende</h4>';

      // Itération sur les couleurs pour construire la légende
      for (const type in HEALTH_INFRA_COLORS) {
        if (type !== "default") {
          const color = HEALTH_INFRA_COLORS[type];
          content += `<div style="display: flex; align-items: center; margin-bottom: 3px;">
               <i style="background: ${color}; width: 18px; height: 18px; border-radius: 50%; margin-right: 8px; border: 1px solid #555;"></i>
               <span>${type}</span>
             </div>`;
        }
      }

      div.innerHTML = content;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

// --- COMPOSANT PRINCIPAL ---

/**
 * Affiche une carte Leaflet interactive avec différentes couches de données.
 *
 * @param {Array} data - Les données épidémiologiques filtrées.
 * @param {string} adminLayer - La clé de la couche administrative à afficher.
 * @param {boolean} isLoading - Indique si une couche est en cours de chargement.
 * @param {function} setIsLoading - Fonction pour mettre à jour l'état de chargement.
 * @param {string} visibleLayerType - Le type de couche à afficher ('admin' ou 'infra').
 */
const MapView = ({
  data,
  adminLayer,
  isLoading,
  setIsLoading,
  visibleLayerType,
}) => {
  // --- GESTION DES ÉTATS ---
  const [error, setError] = useState(null);
  const [adminGeoJson, setAdminGeoJson] = useState(null);
  const [healthInfraGeoJson, setHealthInfraGeoJson] = useState(null);
  const [senegalMask, setSenegalMask] = useState(null);
  const mapRef = useRef();

  const setIsLoadingRef = useRef(setIsLoading);
  useEffect(() => {
    setIsLoadingRef.current = setIsLoading;
  }, [setIsLoading]);

  // Effet pour créer le masque GeoJSON du Sénégal (ne s'exécute qu'une fois).
  useEffect(() => {
    const createSenegalMask = async () => {
      try {
        const response = await fetch(
          "/delimitations_sen/Sen_regions.geojson"
        );
        const senegalRegions = await response.json();
        const worldCoords = [
          [
            [-180, -90],
            [-180, 90],
            [180, 90],
            [180, -90],
            [-180, -90],
          ],
        ];
        senegalRegions.features.forEach((feature) => {
          if (feature.geometry.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach((polygon) =>
              worldCoords.push(polygon[0])
            );
          } else if (feature.geometry.type === "Polygon") {
            worldCoords.push(feature.geometry.coordinates[0]);
          }
        });
        const maskGeoJson = {
          type: "Feature",
          geometry: { type: "Polygon", coordinates: worldCoords },
        };
        setSenegalMask(maskGeoJson);
      } catch (err) {
        console.error("Erreur lors de la création du masque du Sénégal:", err);
      }
    };
    createSenegalMask();
  }, []);

  // Calcule et agrège les données pour chaque zone administrative.
  const areaMetrics = useMemo(() => {
    const adminConfig = LAYER_CONFIG.admin[adminLayer];
    if (!data || data.length === 0 || !adminConfig || !adminConfig.dataCol) {
      return {};
    }
    if (data.length > 0 && !data[0].hasOwnProperty(adminConfig.dataCol)) {
      console.warn(
        `La colonne "${adminConfig.dataCol}" n'existe pas dans les données CSV.`
      );
      return {};
    }
    const metrics = {};
    data.forEach((d) => {
      const areaNameFromCsv = d[adminConfig.dataCol];
      if (!areaNameFromCsv) return;
      const normalizedAreaName = String(areaNameFromCsv).toUpperCase();
      if (!metrics[normalizedAreaName]) {
        metrics[normalizedAreaName] = {
          cases: 0,
          death: 0,
          temperature: [],
          humidity: [],
        };
      }
      metrics[normalizedAreaName].cases += d.Cas_confirmes || 0;
      metrics[normalizedAreaName].death += d.Morts || 0;
      if (d.Temperature_moy)
        metrics[normalizedAreaName].temperature.push(d.Temperature_moy);
      if (d.Humidite_moy)
        metrics[normalizedAreaName].humidity.push(d.Humidite_moy);
    });
    Object.keys(metrics).forEach((areaName) => {
      const tempSum = metrics[areaName].temperature.reduce((a, b) => a + b, 0);
      const humiditySum = metrics[areaName].humidity.reduce((a, b) => a + b, 0);
      metrics[areaName].avgTemperature =
        metrics[areaName].temperature.length > 0
          ? (tempSum / metrics[areaName].temperature.length).toFixed(1)
          : "N/A";
      metrics[areaName].avgHumidity =
        metrics[areaName].humidity.length > 0
          ? (humiditySum / metrics[areaName].humidity.length).toFixed(1)
          : "N/A";
    });
    return metrics;
  }, [data, adminLayer]);

  // Crée une clé unique pour forcer le re-rendu de GeoJSON.
  const metricsKey = useMemo(() => JSON.stringify(areaMetrics), [areaMetrics]);

  // --- CHARGEMENT ASYNCHRONE DES COUCHES GEOJSON ---

  // Effet pour charger la couche administrative sélectionnée.
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const loadAdminLayer = async () => {
      const adminConfig = LAYER_CONFIG.admin[adminLayer];
      if (!adminConfig || !adminConfig.path) {
        setAdminGeoJson(null);
        return;
      }
      setIsLoadingRef.current(true);
      setError(null);
      setAdminGeoJson(null);
      try {
        const response = await fetch(adminConfig.path, { signal });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        setAdminGeoJson(json);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(
            `Erreur de chargement pour ${adminConfig.name}:`,
            err
          );
          setError(`Impossible de charger la couche ${adminConfig.name}.`);
        }
      } finally {
        if (!signal.aborted) {
          setIsLoadingRef.current(false);
        }
      }
    };
    loadAdminLayer();
    return () => {
      controller.abort();
    };
  }, [adminLayer]);

  // Effet pour charger la couche des infrastructures (ne s'exécute qu'une fois).
  useEffect(() => {
    const loadHealthInfra = async () => {
      try {
        const healthConfig = LAYER_CONFIG.infra.health;
        const response = await fetch(healthConfig.path);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        setHealthInfraGeoJson(json);
      } catch (err) {
        console.error(
          "Erreur de chargement des infrastructures sanitaires:",
          err
        );
      }
    };
    loadHealthInfra();
  }, []);

  // --- GESTION DES INTERACTIONS SUR LA CARTE ---

  // Interactions pour chaque polygone administratif.
  const onEachAdminFeature = useCallback(
    (feature, layer) => {
      const adminConfig = LAYER_CONFIG.admin[adminLayer];
      if (!adminConfig || !adminConfig.nameProp) return;
      const areaNameFromGeoJson = feature.properties[adminConfig.nameProp];
      const normalizedAreaName = String(areaNameFromGeoJson).toUpperCase();
      const metrics = areaMetrics[normalizedAreaName];
      let popupContent = `<b>${areaNameFromGeoJson}</b>`;
      if (metrics) {
        popupContent += `<br/>Cas confirmés: ${metrics.cases.toLocaleString()}`;
        popupContent += `<br/>Morts: ${metrics.death.toLocaleString()}`;
        popupContent += `<br/>Temp. moyenne: ${metrics.avgTemperature}°C`;
        popupContent += `<br/>Humidité moyenne: ${metrics.avgHumidity}%`;
      } else {
        popupContent += `<br/>Aucune donnée disponible pour cette zone.`;
      }
      layer.bindTooltip(popupContent, { sticky: true });
      layer.on({
        mouseover: (e) => {
          const l = e.target;
          l.setStyle({ weight: 3, color: "#e53935", fillOpacity: 0.2 });
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            l.bringToFront();
          }
        },
        mouseout: (e) => {
          e.target.setStyle(adminPolygonStyle);
        },
      });
    },
    [adminLayer, areaMetrics]
  );

  /**
   * MODIFIÉ : Interactions pour chaque point d'infrastructure.
   * Réinitialise le style au survol en utilisant la couleur dynamique.
   */
  const onEachHealthInfraFeature = useCallback((feature, layer) => {
    const healthConfig = LAYER_CONFIG.infra.health;
    const name =
      feature.properties?.[healthConfig.nameProp] ||
      "Information non disponible";
    const type = feature.properties?.Type_struc || "N/A";
    const tooltipContent = `<b>${name}</b><br/>Type: ${type}`;
    layer.bindTooltip(tooltipContent, { sticky: true });
    layer.on({
      mouseover: (e) => {
        e.target.setStyle(highlightedHealthPointOptions);
        e.target.bringToFront();
      },
      mouseout: (e) => {
        // Réinitialise le style en utilisant la fonction qui détermine la bonne couleur.
        e.target.setStyle(getHealthPointStyle(feature));
      },
    });
  }, []);

  /**
   * MODIFIÉ : Convertit un point GeoJSON en marqueur circulaire avec la bonne couleur.
   */
  const pointToLayer = useCallback((feature, latlng) => {
    return L.circleMarker(latlng, getHealthPointStyle(feature));
  }, []);
  // --- RENDU DU COMPOSANT ---

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <Paper
        elevation={3}
        sx={{
          height: "600px",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        {/* Affiche un indicateur de chargement */}
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 1000,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {/* Affiche une alerte en cas d'erreur */}
        {error && (
          <Alert severity="error" sx={{ m: 2, position: "absolute", zIndex: 1000 }}>
            {error}
          </Alert>
        )}

        <MapContainer
          center={SENEGAL_CENTER}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
          maxBounds={SENEGAL_BOUNDS}
          minZoom={6}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Masque pour le reste du monde */}
          {senegalMask && <GeoJSON data={senegalMask} style={maskStyle} />}

          {/* Couche administrative (si visible) */}
          {visibleLayerType === "admin" && adminGeoJson && (
            <GeoJSON
              key={`${adminLayer}-${metricsKey}`}
              data={adminGeoJson}
              style={adminPolygonStyle}
              onEachFeature={onEachAdminFeature}
            />
          )}

          {/* Couche des infrastructures (si visible) */}
          {visibleLayerType === "infra" && healthInfraGeoJson && (
            <GeoJSON
              key="health-infra"
              data={healthInfraGeoJson}
              pointToLayer={pointToLayer}
              onEachFeature={onEachHealthInfraFeature}
            />
          )}

          {/* Légende (si la couche infra est visible) */}
          {visibleLayerType === "infra" && <Legend />}

          <ScaleControl position="bottomleft" />
        </MapContainer>
      </Paper>
    </ErrorBoundary>
  );
};

MapView.propTypes = {
  data: PropTypes.array.isRequired,
  adminLayer: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  visibleLayerType: PropTypes.string.isRequired,
};

export default MapView;
