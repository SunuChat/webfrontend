// MapView.jsx — SunuChat · Editorial Clean
// Logique originale 100% préservée, styling aligné sur le design system
import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  MapContainer, GeoJSON, ScaleControl, TileLayer, useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PropTypes from "prop-types";
import { Box, CircularProgress, Alert, Typography, Stack } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { LAYER_CONFIG } from "./MapLayerControls";
import {
  PRIMARY_COLOR, BG_WHITE, BG_SECTION_ALT,
  TEXT_PRIMARY, TEXT_MUTED, BORDER_COLOR, FONT_SANS,
} from "../constants";

// ── Leaflet icon fix ──────────────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl:       require("leaflet/dist/images/marker-icon.png"),
  shadowUrl:     require("leaflet/dist/images/marker-shadow.png"),
});

// ── Constants ─────────────────────────────────────────────────────────────────
const SENEGAL_CENTER = [14.4974, -14.4524];
const SENEGAL_BOUNDS = [[11, -20], [18, -11]];

const maskStyle = {
  fillColor: "#c8dff0", fillOpacity: 0.85,
  color: "transparent", weight: 0, interactive: false,
};

const adminPolygonStyle = {
  fillOpacity: 0, weight: 1.5, opacity: 1, color: "#005a9e",
};

const HEALTH_INFRA_COLORS = {
  "Poste de Santé":    "#FFD600",
  "Centre de Santé":   "#FFA500",
  "Hôpital":           "#E53935",
  "Clinique":          "#2196F3",
  "Maternité":         "#E91E63",
  "Pédiatrie":         "#9C27B0",
  "Brigade d'Hygiène": "#4CAF50",
  default:             "#757575",
};

const baseHealthPt  = { radius: 5, color: "#fff", weight: 1, opacity: 1, fillOpacity: 0.9 };
const hoverHealthPt = { ...baseHealthPt, radius: 7, weight: 2 };

const getHealthStyle = (feature) => ({
  ...baseHealthPt,
  fillColor: HEALTH_INFRA_COLORS[feature?.properties?.Type_struc] || HEALTH_INFRA_COLORS.default,
});

// ── Error fallback ────────────────────────────────────────────────────────────
const MapFallback = ({ error }) => (
  <Alert severity="error" sx={{ m: 2, borderRadius: "10px", fontFamily: FONT_SANS }}>
    Erreur sur la carte : {error.message}
  </Alert>
);

// ── Legend (Leaflet control) ──────────────────────────────────────────────────
function Legend() {
  const map = useMap();
  useEffect(() => {
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = () => {
      const div = L.DomUtil.create("div");
      div.style.cssText = [
        "background:rgba(255,255,255,0.92)",
        "padding:10px 12px",
        "border-radius:10px",
        `border:1px solid ${BORDER_COLOR}`,
        "box-shadow:0 2px 8px rgba(0,0,0,0.10)",
        `font-family:${FONT_SANS}`,
        "font-size:12px",
        "line-height:1.6",
        "max-width:200px",
      ].join(";");
      let html = `<div style="font-weight:600;color:${TEXT_PRIMARY};margin-bottom:6px;">Légende</div>`;
      Object.entries(HEALTH_INFRA_COLORS)
        .filter(([k]) => k !== "default")
        .forEach(([type, color]) => {
          html += `<div style="display:flex;align-items:center;gap:7px;margin-bottom:3px;">
            <span style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0;border:1px solid rgba(0,0,0,0.15);display:inline-block;"></span>
            <span style="color:${TEXT_PRIMARY}">${type}</span>
          </div>`;
        });
      div.innerHTML = html;
      return div;
    };
    legend.addTo(map);
    return () => legend.remove();
  }, [map]);
  return null;
}

// ── Main component ────────────────────────────────────────────────────────────
const MapView = ({ data, adminLayer, isLoading, setIsLoading, visibleLayerType }) => {
  const [error,              setError]              = useState(null);
  const [adminGeoJson,       setAdminGeoJson]       = useState(null);
  const [healthInfraGeoJson, setHealthInfraGeoJson] = useState(null);
  const [senegalMask,        setSenegalMask]        = useState(null);
  const mapRef                                       = useRef();
  const setIsLoadingRef                              = useRef(setIsLoading);

  useEffect(() => { setIsLoadingRef.current = setIsLoading; }, [setIsLoading]);

  // ── Mask ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/delimitations_sen/Sen_regions.geojson");
        const geo = await res.json();
        const world = [[[-180,-90],[-180,90],[180,90],[180,-90],[-180,-90]]];
        geo.features.forEach((f) => {
          if (f.geometry.type === "MultiPolygon") f.geometry.coordinates.forEach((p) => world.push(p[0]));
          else if (f.geometry.type === "Polygon") world.push(f.geometry.coordinates[0]);
        });
        setSenegalMask({ type: "Feature", geometry: { type: "Polygon", coordinates: world } });
      } catch {}
    })();
  }, []);

  // ── Area metrics ──
  const areaMetrics = useMemo(() => {
    const cfg = LAYER_CONFIG.admin[adminLayer];
    if (!data?.length || !cfg?.dataCol) return {};
    const m = {};
    data.forEach((d) => {
      const name = String(d[cfg.dataCol] || "").toUpperCase();
      if (!name) return;
      if (!m[name]) m[name] = { cases: 0, death: 0, temperature: [], humidity: [] };
      m[name].cases += d.Cas_confirmes || 0;
      m[name].death += d.Morts        || 0;
      if (d.Temperature_moy) m[name].temperature.push(d.Temperature_moy);
      if (d.Humidite_moy)    m[name].humidity.push(d.Humidite_moy);
    });
    Object.keys(m).forEach((k) => {
      const t = m[k].temperature, h = m[k].humidity;
      m[k].avgTemp     = t.length ? (t.reduce((a,b)=>a+b,0)/t.length).toFixed(1) : "N/A";
      m[k].avgHumidity = h.length ? (h.reduce((a,b)=>a+b,0)/h.length).toFixed(1) : "N/A";
    });
    return m;
  }, [data, adminLayer]);

  const metricsKey = useMemo(() => JSON.stringify(areaMetrics), [areaMetrics]);

  // ── Admin layer load ──
  useEffect(() => {
    const ctrl = new AbortController();
    const load = async () => {
      const cfg = LAYER_CONFIG.admin[adminLayer];
      if (!cfg?.path) { setAdminGeoJson(null); return; }
      setIsLoadingRef.current(true); setError(null); setAdminGeoJson(null);
      try {
        const res = await fetch(cfg.path, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setAdminGeoJson(await res.json());
      } catch (e) {
        if (e.name !== "AbortError") setError(`Impossible de charger la couche ${cfg.name}.`);
      } finally {
        if (!ctrl.signal.aborted) setIsLoadingRef.current(false);
      }
    };
    load();
    return () => ctrl.abort();
  }, [adminLayer]);

  // ── Health infra load (once) ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(LAYER_CONFIG.infra.health.path);
        if (!res.ok) throw new Error();
        setHealthInfraGeoJson(await res.json());
      } catch {}
    })();
  }, []);

  // ── Interactions ──
  const onEachAdmin = useCallback((feature, layer) => {
    const cfg  = LAYER_CONFIG.admin[adminLayer];
    if (!cfg?.nameProp) return;
    const name    = feature.properties[cfg.nameProp];
    const metrics = areaMetrics[String(name).toUpperCase()];
    let tip = `<b style="font-family:${FONT_SANS}">${name}</b>`;
    if (metrics) {
      tip += `<br/>Cas : ${metrics.cases.toLocaleString("fr-FR")}`
           + `<br/>Décès : ${metrics.death.toLocaleString("fr-FR")}`
           + `<br/>Temp. moy. : ${metrics.avgTemp}°C`
           + `<br/>Humidité : ${metrics.avgHumidity}%`;
    } else {
      tip += "<br/>Aucune donnée disponible.";
    }
    layer.bindTooltip(tip, { sticky: true });
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ weight: 2.5, color: "#e53935", fillOpacity: 0.15 });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) e.target.bringToFront();
      },
      mouseout: (e) => e.target.setStyle(adminPolygonStyle),
    });
  }, [adminLayer, areaMetrics]);

  const onEachHealthInfra = useCallback((feature, layer) => {
    const name = feature.properties?.[LAYER_CONFIG.infra.health.nameProp] || "N/A";
    const type = feature.properties?.Type_struc || "N/A";
    layer.bindTooltip(`<b style="font-family:${FONT_SANS}">${name}</b><br/>Type : ${type}`, { sticky: true });
    layer.on({
      mouseover: (e) => { e.target.setStyle(hoverHealthPt); e.target.bringToFront(); },
      mouseout:  (e) => e.target.setStyle(getHealthStyle(feature)),
    });
  }, []);

  const pointToLayer = useCallback((feature, latlng) =>
    L.circleMarker(latlng, getHealthStyle(feature)), []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ErrorBoundary FallbackComponent={MapFallback}>
      <Box
        sx={{
          position: "relative",
          height: { xs: 380, md: 520 },
          borderRadius: "14px",
          border: `1px solid ${BORDER_COLOR}`,
          overflow: "hidden",
          bgcolor: BG_WHITE,
        }}
      >
        {/* Loading overlay */}
        {isLoading && (
          <Box sx={{
            position: "absolute", inset: 0, zIndex: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            bgcolor: "rgba(255,255,255,0.72)", backdropFilter: "blur(2px)",
          }}>
            <Stack spacing={1.5} alignItems="center">
              <CircularProgress size={28} sx={{ color: PRIMARY_COLOR }} />
              <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.8rem", color: TEXT_MUTED }}>
                Chargement de la carte…
              </Typography>
            </Stack>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ position: "absolute", top: 10, left: 10, right: 10, zIndex: 800, borderRadius: "8px", fontFamily: FONT_SANS, fontSize: "0.84rem" }}>
            {error}
          </Alert>
        )}

        <MapContainer
          center={SENEGAL_CENTER} zoom={7}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
          maxBounds={SENEGAL_BOUNDS}
          minZoom={6}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {senegalMask && <GeoJSON data={senegalMask} style={maskStyle} />}

          {visibleLayerType === "admin" && adminGeoJson && (
            <GeoJSON
              key={`${adminLayer}-${metricsKey}`}
              data={adminGeoJson}
              style={adminPolygonStyle}
              onEachFeature={onEachAdmin}
            />
          )}

          {visibleLayerType === "infra" && healthInfraGeoJson && (
            <GeoJSON
              key="health-infra"
              data={healthInfraGeoJson}
              pointToLayer={pointToLayer}
              onEachFeature={onEachHealthInfra}
            />
          )}

          {visibleLayerType === "infra" && <Legend />}
          <ScaleControl position="bottomleft" />
        </MapContainer>
      </Box>
    </ErrorBoundary>
  );
};

MapView.propTypes = {
  data:            PropTypes.array.isRequired,
  adminLayer:      PropTypes.string.isRequired,
  isLoading:       PropTypes.bool.isRequired,
  setIsLoading:    PropTypes.func.isRequired,
  visibleLayerType: PropTypes.string.isRequired,
};

export default MapView;