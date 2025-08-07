import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  GeoJSON,
  ScaleControl,
  TileLayer,
  LayersControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PropTypes from "prop-types";
import { CircularProgress, Alert, Box, Paper } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { LAYER_CONFIG } from "./MapLayerControls";

// --- CONFIGURATION & STYLES (définis en dehors du composant pour éviter leur recréation à chaque rendu) ---

/**
 * Correction pour un bug courant avec Webpack et Leaflet où les icônes par défaut
 * ne se chargent pas correctement. Ce code réinitialise les chemins des images
 * pour les marqueurs.
 */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Style pour le masque qui va "cacher" le reste du monde en dehors du Sénégal.
const maskStyle = {
  fillColor: "#aadaff", // Une couleur bleu océan
  fillOpacity: 1,
  color: "transparent", // Pas de bordure
  weight: 0,
  interactive: false, // Le masque ne réagit pas aux clics
};

// Style de base pour les polygones des couches administratives (régions, départements, etc.).
const adminPolygonStyle = {
  fillOpacity: 0, // Fond transparent pour voir la carte en dessous
  weight: 2,
  opacity: 1,
  color: "#005a9e", // Un bleu foncé pour les contours
};

// Style pour les points représentant les infrastructures sanitaires.
const healthPointOptions = {
  radius: 5,
  fillColor: "#E53935", // Rouge pour une bonne visibilité
  color: "#fff", // Bordure blanche
  weight: 1,
  opacity: 1,
  fillOpacity: 0.9,
};

/**
 * Composant de secours affiché par ErrorBoundary si une erreur critique
 * se produit dans le composant MapView ou ses enfants.
 */
const FallbackComponent = ({ error }) => (
  <Alert severity="error" sx={{ m: 2 }}>
    Une erreur est survenue sur la carte: {error.message}
  </Alert>
);

/**
 * Composant interne pour afficher une légende sur la carte.
 * Il utilise le hook `useMap` pour accéder à l'instance de la carte Leaflet
 * et y ajouter un contrôle personnalisé.
 */
const Legend = () => {
  const map = useMap();

  // useEffect est utilisé pour interagir avec l'instance de la carte Leaflet (qui n'est pas un composant React).
  useEffect(() => {
    // Crée un nouveau contrôle Leaflet positionné en bas à droite.
    const legend = L.control({ position: "bottomright" });

    // `onAdd` est une méthode Leaflet qui est appelée lorsque le contrôle est ajouté à la carte.
    // Elle doit retourner l'élément DOM à afficher.
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend"); // Crée un div avec des classes CSS
      // Style en ligne pour la légende
      div.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      div.style.padding = "10px";
      div.style.borderRadius = "5px";
      // Contenu HTML de la légende
      div.innerHTML = `
        <h4 style="margin: 0 0 5px 0;">Légende</h4>
        <div style="display: flex; align-items: center;">
          <i style="background: ${healthPointOptions.fillColor}; width: 18px; height: 18px; border-radius: 50%; margin-right: 8px; border: 1px solid #333;"></i>
          <span>Infrastructures sanitaires</span>
        </div>
      `;
      return div;
    };

    // Ajoute la légende à la carte.
    legend.addTo(map);

    // Fonction de nettoyage : retire la légende lorsque le composant est démonté.
    return () => {
      legend.remove();
    };
  }, [map]); // L'effet ne se redéclenche que si l'instance de la carte change.

  return null; // Ce composant n'affiche rien directement dans le DOM React.
};
// --- COMPOSANT PRINCIPAL ---

/**
 * Affiche une carte Leaflet interactive avec différentes couches de données.
 *
 * @param {Array} data - Les données épidémiologiques filtrées provenant du fichier CSV.
 * @param {string} adminLayer - La clé de la couche administrative à afficher (ex: 'regions').
 * @param {boolean} isLoading - Un booléen (géré par ce composant) indiquant si une couche est en cours de chargement.
 * @param {function} setIsLoading - La fonction pour mettre à jour l'état de chargement dans le composant parent.
 */
const MapView = ({ data, adminLayer, isLoading, setIsLoading }) => {
  // --- GESTION DES ÉTATS ---
  const [error, setError] = useState(null);
  const [adminGeoJson, setAdminGeoJson] = useState(null); // Données GeoJSON pour la couche admin (régions, etc.)
  const [healthInfraGeoJson, setHealthInfraGeoJson] = useState(null); // Données GeoJSON pour les infrastructures
  const [senegalMask, setSenegalMask] = useState(null); // Données GeoJSON pour le masque inversé du Sénégal
  const mapRef = useRef(); // Référence à l'instance de la carte Leaflet

  /**
   * Effet pour créer un "masque" GeoJSON.
   * Ce masque est un polygone qui couvre le monde entier, sauf le Sénégal.
   * En l'affichant avec une couleur opaque, on donne l'impression que seul le Sénégal est visible.
   * Cet effet ne s'exécute qu'une seule fois au montage du composant.
   */
  useEffect(() => {
    const createSenegalMask = async () => {
      try {
        const response = await fetch("/delimitations_sen/Sen_regions.geojson");
        const senegalRegions = await response.json();

        // Coordonnées qui couvrent le monde entier
        const worldCoords = [
          [
            [-180, -90],
            [-180, 90],
            [180, 90],
            [180, -90],
            [-180, -90],
          ],
        ];

        // Pour chaque région du Sénégal, on ajoute ses coordonnées comme un "trou" dans le polygone mondial.
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
        console.error(
          "Erreur lors de la création du masque du Sénégal:",
          err
        );
      }
    };

    createSenegalMask();
  }, []); // Le tableau de dépendances vide signifie que cet effet ne s'exécute qu'une fois.

  /**
   * Calcule et agrège les données (cas, morts, etc.) pour chaque zone administrative.
   * `useMemo` est utilisé pour ne recalculer ces métriques que si les données (data)
   * ou la couche administrative (adminLayer) changent. C'est une optimisation cruciale.
   */
  const areaMetrics = useMemo(() => {
    const adminConfig = LAYER_CONFIG.admin[adminLayer];
    if (!data || data.length === 0 || !adminConfig || !adminConfig.dataCol) {
      return {};
    }

    // Vérification de la présence de la colonne de jointure dans les données CSV.
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

      // Normalisation des noms pour la jointure (ex: "DAKAR" et "Dakar" doivent correspondre).
      const normalizedAreaName = String(areaNameFromCsv).toUpperCase();

      if (!metrics[normalizedAreaName]) {
        metrics[normalizedAreaName] = {
          cases: 0,
          death: 0,
          temperature: [],
          humidity: [],
        };
      }

      // Agrégation des données
      metrics[normalizedAreaName].cases += d.Cas_confirmes || 0;
      metrics[normalizedAreaName].death += d.Morts || 0;
      if (d.Temperature_moy)
        metrics[normalizedAreaName].temperature.push(d.Temperature_moy);
      if (d.Humidite_moy)
        metrics[normalizedAreaName].humidity.push(d.Humidite_moy);
    });

    // Calcul des moyennes de température et d'humidité
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

  /**
   * Crée une chaîne de caractères unique basée sur les métriques.
   * Cette clé sera utilisée sur le composant GeoJSON pour forcer son re-rendu
   * lorsque les données filtrées changent, même si le fichier GeoJSON lui-même ne change pas.
   */
  const metricsKey = useMemo(() => JSON.stringify(areaMetrics), [areaMetrics]);

  // --- CHARGEMENT ASYNCHRONE DES COUCHES GEOJSON ---

  /**
   * Effet pour charger le fichier GeoJSON de la couche administrative sélectionnée.
   * Il se déclenche chaque fois que `adminLayer` change.
   * Utilise un `AbortController` pour annuler la requête si le composant est démonté
   * ou si la couche change avant la fin du chargement.
   */
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const loadAdminLayer = async () => {
      const adminConfig = LAYER_CONFIG.admin[adminLayer];
      if (!adminConfig || !adminConfig.path) {
        setAdminGeoJson(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      // Vider la couche précédente est crucial pour éviter d'afficher des données
      // périmées pendant le chargement de la nouvelle couche.
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
        // S'assure que l'indicateur de chargement est désactivé même en cas d'erreur.
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadAdminLayer();

    // Fonction de nettoyage : annule la requête fetch si nécessaire.
    return () => {
      controller.abort();
    };
  }, [adminLayer, setIsLoading]); // Se redéclenche si la couche ou la fonction setIsLoading changent.

  /**
   * Effet pour charger la couche statique des infrastructures sanitaires.
   * Ne s'exécute qu'une seule fois au montage du composant.
   */
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
  }, []); // Le tableau de dépendances vide assure une exécution unique.
  // --- GESTION DES INTERACTIONS SUR LA CARTE ---

  /**
   * Fonction de rappel pour définir les interactions sur chaque polygone administratif.
   * `useCallback` est utilisé pour mémoriser la fonction et éviter sa recréation à chaque rendu,
   * sauf si `adminLayer` ou `areaMetrics` changent. C'est une optimisation de performance.
   * @param {object} feature - L'objet GeoJSON de la zone.
   * @param {object} layer - La couche Leaflet correspondante (le polygone).
   */
  const onEachAdminFeature = useCallback(
    (feature, layer) => {
      const adminConfig = LAYER_CONFIG.admin[adminLayer];
      if (!adminConfig || !adminConfig.nameProp) return;

      const areaNameFromGeoJson = feature.properties[adminConfig.nameProp];
      // Normalisation du nom pour faire la jointure avec les métriques calculées.
      const normalizedAreaName = String(areaNameFromGeoJson).toUpperCase();
      const metrics = areaMetrics[normalizedAreaName];

      // Construction du contenu de l'infobulle (tooltip).
      let popupContent = `<b>${areaNameFromGeoJson}</b>`;
      if (metrics) {
        popupContent += `<br/>Cas confirmés: ${metrics.cases.toLocaleString()}`;
        popupContent += `<br/>Morts: ${metrics.death.toLocaleString()}`;
        popupContent += `<br/>Temp. moyenne: ${metrics.avgTemperature}°C`;
        popupContent += `<br/>Humidité moyenne: ${metrics.avgHumidity}%`;
      } else {
        popupContent += `<br/>Aucune donnée disponible pour cette zone.`;
      }

      // Lie l'infobulle à la couche, avec l'option `sticky` pour qu'elle suive la souris.
      layer.bindTooltip(popupContent, { sticky: true });

      // Ajoute des gestionnaires d'événements pour le survol de la souris.
      layer.on({
        mouseover: (e) => {
          const l = e.target;
          // Change le style pour mettre la zone en surbrillance.
          l.setStyle({ weight: 3, color: "#e53935", fillOpacity: 0.2 });
          // Amène la couche au premier plan pour qu'elle soit au-dessus des autres.
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            l.bringToFront();
          }
        },
        mouseout: (e) => {
          // Réinitialise le style de la couche lorsque la souris quitte la zone.
          e.target.setStyle(adminPolygonStyle);
        },
      });
    },
    [adminLayer, areaMetrics] // Dépendances du useCallback.
  );

  /**
   * Fonction de rappel pour les interactions sur chaque point d'infrastructure sanitaire.
   * @param {object} feature - L'objet GeoJSON du point.
   * @param {object} layer - La couche Leaflet correspondante (le marqueur).
   */
  const onEachHealthInfraFeature = useCallback((feature, layer) => {
    const healthConfig = LAYER_CONFIG.infra.health;
    // Utilisation de l'optional chaining (?.) pour accéder aux propriétés en toute sécurité.
    const name =
      feature.properties?.[healthConfig.nameProp] ||
      "Information non disponible";
    const type = feature.properties?.Type_struc || "N/A";

    const popupContent = `<b>${name}</b><br/>Type: ${type}`;
    // Lie une popup qui s'ouvre au clic sur le point.
    layer.bindPopup(popupContent);
  }, []); // Aucune dépendance, la fonction n'est créée qu'une seule fois.

  /**
   * Fonction pour convertir un point GeoJSON en une couche Leaflet (un marqueur circulaire).
   * @param {object} feature - L'objet GeoJSON du point.
   * @param {L.LatLng} latlng - Les coordonnées du point.
   * @returns {L.CircleMarker}
   */
  const pointToLayer = useCallback((feature, latlng) => {
    return L.circleMarker(latlng, healthPointOptions);
  }, []); // Aucune dépendance, créée une seule fois.

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
        {/* Affiche un indicateur de chargement au-dessus de la carte */}
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
              zIndex: 1000, // Pour être sûr qu'il est au-dessus de la carte
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {/* Affiche une alerte en cas d'erreur de chargement */}
        {error && (
          <Alert severity="error" sx={{ m: 2, position: 'absolute', zIndex: 1000 }}>
            {error}
          </Alert>
        )}

        <MapContainer
          center={[14.4974, -14.4524]} // Centre sur le Sénégal
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
          maxBounds={[
            [11, -20], // Limite Sud-Ouest
            [18, -11], // Limite Nord-Est
          ]}
          minZoom={6}
        >
          {/* Couche de base de la carte (fond de carte OpenStreetMap) */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Affiche le masque du Sénégal s'il est chargé */}
          {senegalMask && <GeoJSON data={senegalMask} style={maskStyle} />}

          {/* Contrôle permettant d'activer/désactiver les couches superposées */}
          <LayersControl position="topright">
            {/* Superposition pour la couche administrative */}
            {adminGeoJson && (
              <LayersControl.Overlay checked name="Couche administrative">
                <GeoJSON
                  // La clé est cruciale. Elle force React à recréer ce composant
                  // lorsque la couche ou les métriques changent, assurant une mise à jour visuelle.
                  key={`${adminLayer}-${metricsKey}`}
                  data={adminGeoJson}
                  style={adminPolygonStyle}
                  onEachFeature={onEachAdminFeature}
                />
              </LayersControl.Overlay>
            )}

            {/* Superposition pour les infrastructures sanitaires */}
            {healthInfraGeoJson && (
              <LayersControl.Overlay checked name="Infrastructures sanitaires">
                <GeoJSON
                  key="health-infra"
                  data={healthInfraGeoJson}
                  pointToLayer={pointToLayer}
                  onEachFeature={onEachHealthInfraFeature}
                />
              </LayersControl.Overlay>
            )}
          </LayersControl>

          {/* Ajout des composants personnalisés à la carte */}
          <Legend />
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
};

export default MapView;
