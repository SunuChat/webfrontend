// Dashboard.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Papa from "papaparse";
import KPICards from "../components/KPICards";
import MapView from "../components/MapView";
import TrendCharts from "../components/TrendCharts";
import MapLayerControls from "../components/MapLayerControls";
import FilterBar from "../components/FilterBar";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Alert,
  Chip,
  Stack,
  Button,
  Tooltip,
  Divider,
} from "@mui/material";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
const FORECAST_ROUTES = {
  dengue: "/api/predict/dengue",
  paludisme: "/api/predict/paludisme",
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtres
  const [year, setYear] = useState("Toutes");
  const [disease, setDisease] = useState("Toutes");
  const [month, setMonth] = useState("Tous");

  // Carte
  const [adminLayer, setAdminLayer] = useState("regions");
  const [isMapLoading, setIsMapLoading] = useState(false);

  // Export states
  const [isExporting, setIsExporting] = useState(false);

  /* ----- Forecast states ----- */
  const [forecasts, setForecasts] = useState({
    dengue: null,
    paludisme: null,
  });
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState("");
  const [lastForecastAt, setLastForecastAt] = useState(null);

  /* ------------------- CSV / data load ------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data_epi_final.csv", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();

        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (result) => {
            try {
              const enrichedData = result.data
                .map((row) => {
                  let date, annee, mois;
                  if (
                    row &&
                    typeof row.Date === "string" &&
                    row.Date.includes("/")
                  ) {
                    const parts = row.Date.split("/");
                    if (parts.length === 3) {
                      const [day, monthStr, yearStr] = parts;
                      if (day && monthStr && yearStr) {
                        date = new Date(`${yearStr}-${monthStr}-${day}`);
                        if (!isNaN(date.getTime())) {
                          annee = date.getFullYear().toString();
                          mois = (date.getMonth() + 1)
                            .toString()
                            .padStart(2, "0");
                        }
                      }
                    }
                  }
                  return {
                    ...row,
                    Annee: annee || null,
                    Mois: mois || null,
                    Cas_confirmes: parseInt(row.Cas_confirmes) || 0,
                    Morts: parseInt(row.Morts) || 0,
                    Temperature_moy: parseFloat(row.Temperature_moy) || 0,
                    Humidite_moy: parseFloat(row.Humidite_moy) || 0,
                    Vent_vit_moy: parseFloat(row.Vent_vit_moy) || 0,
                    Densite: parseFloat(row.Densite) || 0,
                  };
                })
                .filter((d) => d.Annee !== null);

              setData(enrichedData);
              setLoading(false);
            } catch (e) {
              setError("Erreur pendant l'enrichissement des données.");
              setLoading(false);
            }
          },
          error: (err) => {
            setError("Erreur lors du parsing CSV.");
            setLoading(false);
          },
        });
      } catch (e) {
        setError("Erreur de chargement des données.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const yearMatch = year === "Toutes" || d.Annee === year;
      const diseaseMatch = disease === "Toutes" || d.Maladie === disease;
      const monthMatch = month === "Tous" || d.Mois === month;
      return yearMatch && diseaseMatch && monthMatch;
    });
  }, [data, year, disease, month]);

  /* ------------------- Forecast logic (simulated fallback) ------------------- */

  // Simulate a forecast payload for UI while backend not ready
  const makeSimulatedForecast = useCallback((type) => {
    // risk: low/medium/high/very high, probability: 0-1, regionalScores: array per region
    const riskLevels = ["Bas", "Modéré", "Élevé", "Très élevé"];
    const prob = +(Math.random() * 0.9 + 0.05).toFixed(2); // 0.05 - 0.95
    const idx = Math.min(
      riskLevels.length - 1,
      Math.floor(prob * riskLevels.length)
    );
    const regions = [
      "Dakar",
      "Thiès",
      "Saint-Louis",
      "Kaolack",
      "Ziguinchor",
      "Kolda",
    ];
    const regionalScores = regions.map((r) => ({
      region: r,
      score: +Math.min(
        1,
        Math.max(0, prob + (Math.random() - 0.5) * 0.4)
      ).toFixed(2),
    }));
    return {
      model: "simulé",
      type,
      riskLevel: riskLevels[idx],
      probability: prob,
      regionalScores,
      generatedAt: new Date().toISOString(),
      note: "Données simulées — remplacer par route backend réelle.",
    };
  }, []);

  // Try to fetch forecast from backend; if fails, return simulated
  const fetchForecastFor = useCallback(
    async (type) => {
      const route = FORECAST_ROUTES[type];
      try {
        const res = await fetch(route, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // Expecting: { riskLevel, probability (0-1), regionalScores: [{region, score}], generatedAt }
        return {
          ...json,
          model: json.model || "backend",
          type,
        };
      } catch (err) {
        // fallback simulated
        return makeSimulatedForecast(type);
      }
    },
    [makeSimulatedForecast]
  );

  const updateForecasts = useCallback(async () => {
    setForecastLoading(true);
    setForecastError("");
    try {
      const [dengueForecast, paluForecast] = await Promise.all([
        fetchForecastFor("dengue"),
        fetchForecastFor("paludisme"),
      ]);
      setForecasts({
        dengue: dengueForecast,
        paludisme: paluForecast,
      });
      setLastForecastAt(new Date());
    } catch (err) {
      console.error("Erreur updateForecasts:", err);
      setForecastError("Impossible de récupérer les prévisions.");
    } finally {
      setForecastLoading(false);
    }
  }, [fetchForecastFor]);

  // Fetch forecasts on mount and schedule every 3 hours
  useEffect(() => {
    updateForecasts();
    const id = setInterval(() => {
      updateForecasts();
    }, THREE_HOURS_MS);
    return () => clearInterval(id);
  }, [updateForecasts]);

  /* -------------------- Helpers pour export -------------------- */

  // Essaie de rasteriser la carte (dom-to-image -> html2canvas fallback)
  async function rasterizeMapThenCapture(containerEl) {
    const mapEl =
      containerEl.querySelector(".leaflet-container") ||
      containerEl.querySelector(".mapboxgl-canvas") ||
      containerEl.querySelector(".map") ||
      containerEl.querySelector("canvas") ||
      containerEl.querySelector(".react-leaflet");

    if (!mapEl) return null;

    const originalHTML = mapEl.innerHTML;
    let mapDataUrl = null;

    try {
      if (document && document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    } catch (e) {}

    try {
      const domtoimage = await import(
        /* webpackChunkName: "dom-to-image-more" */ "dom-to-image-more"
      ).then((m) => m.default || m);
      try {
        mapDataUrl = await domtoimage.toPng(mapEl, { bgcolor: "#ffffff" });
      } catch (err) {
        console.warn("dom-to-image-more a échoué, fallback html2canvas", err);
        mapDataUrl = null;
      }
    } catch (e) {
      mapDataUrl = null;
    }

    if (!mapDataUrl) {
      try {
        const canvas = await html2canvas(mapEl, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          scrollY: -window.scrollY,
        });
        mapDataUrl = canvas.toDataURL("image/png");
      } catch (err) {
        console.warn("html2canvas sur la map a échoué:", err);
        mapDataUrl = null;
      }
    }

    if (mapDataUrl) {
      try {
        mapEl.innerHTML = `<img alt="map-static" src="${mapDataUrl}" style="width:100%;height:100%;object-fit:cover;display:block;" />`;
        return () => {
          mapEl.innerHTML = originalHTML;
        };
      } catch (err) {
        console.warn(
          "Impossible de remplacer temporairement le DOM de la map :",
          err
        );
        mapEl.innerHTML = originalHTML;
        return null;
      }
    }

    try {
      mapEl.innerHTML = originalHTML;
    } catch (e) {}
    return null;
  }

  // Export PDF multi-pages
  const exportToPDF = async () => {
    const input = document.getElementById("dashboard-root");
    if (!input) {
      console.warn("Element #dashboard-root introuvable pour l'export PDF.");
      return;
    }

    try {
      setIsExporting(true);

      const restoreMap = await rasterizeMapThenCapture(input);
      document.body.classList.add("pdf-export");

      try {
        if (document && document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch (e) {}

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scrollY: -window.scrollY,
      });

      if (restoreMap) restoreMap();
      document.body.classList.remove("pdf-export");

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = { width: canvas.width, height: canvas.height };
      const renderedImgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = renderedImgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, renderedImgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > -0.1) {
        position = heightLeft - renderedImgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, renderedImgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("dashboard-epidemiologie.pdf");
    } catch (err) {
      console.error("Erreur lors de l'export PDF :", err);
      setError(
        "Impossible d'exporter le PDF. Voir la console pour plus de détails."
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Export CSV des filteredData
  const exportCSV = () => {
    try {
      const csv = Papa.unparse(filteredData, { header: true, quotes: true });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-");
      a.download = `dashboard-epidemiologie-${timestamp}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur export CSV:", err);
      setError("Impossible d'exporter le CSV.");
    }
  };

  /* ------------------------------------------------------------ */

  if (loading) {
    return <LoadingState />;
  }

  /* Small UI helpers for forecast */
  function RiskPill({ risk, prob }) {
    const color =
      risk === "Très élevé"
        ? "#b71c1c"
        : risk === "Élevé"
        ? "#ef6c00"
        : risk === "Modéré"
        ? "#fbc02d"
        : "#2e7d32";
    return (
      <Chip
        label={`${risk} (${Math.round(prob * 100)}%)`}
        sx={{
          bgcolor: color,
          color: "#fff",
          fontWeight: 700,
          px: 1.5,
        }}
      />
    );
  }

  function SmallBar({ value }) {
    // value: 0..1
    return (
      <Box sx={{ width: "100%", height: 8, bgcolor: "#eee", borderRadius: 1 }}>
        <Box
          sx={{
            width: `${Math.round(value * 100)}%`,
            height: "100%",
            bgcolor: PRIMARY_COLOR,
            borderRadius: 1,
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f6f9fc", minHeight: "100vh" }}>
      {/* Bandeau titre */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          color: "#fff",
          background: `linear-gradient(120deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
        }}
      >
        <Container sx={{ py: { xs: 8, md: 12 } }}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 2, opacity: 0.9 }}
          >
            Dashboard
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.02em",
              textShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            Tableau de bord
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ maxWidth: 820, mt: 1.5, opacity: 0.95 }}
          >
            Ce tableau de bord permet d'avoir un suivi de l'évolution du
            paludisme et de la dengue au Sénégal
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" spacing={1}>
              <Chip
                icon={<StackedLineChartIcon />}
                label="Statistiques"
                sx={heroChip}
              />
              <Chip icon={<BarChartIcon />} label="Diagrammes" sx={heroChip} />
              <Chip icon={<AddLocationAltIcon />} label="Carte" sx={heroChip} />
            </Stack>

            {/* Boutons export */}
            <Stack direction="row" spacing={1}>
              <Tooltip title="Exporter le dashboard en PDF">
                <span>
                  <Button
                    variant="contained"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={exportToPDF}
                    disabled={isExporting}
                    sx={{
                      backgroundColor: "#fff",
                      color: PRIMARY_COLOR,
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                      "&:hover": { backgroundColor: "#fff", opacity: 0.95 },
                    }}
                  >
                    {isExporting ? "Génération PDF…" : "Exporter en PDF"}
                  </Button>
                </span>
              </Tooltip>

              <Tooltip title="Télécharger les données filtrées en CSV">
                <span>
                  <Button
                    variant="outlined"
                    onClick={exportCSV}
                    sx={{
                      backgroundColor: "transparent",
                      color: "#fff",
                      borderColor: "rgba(255,255,255,0.25)",
                      fontWeight: 700,
                      borderRadius: 2,
                    }}
                  >
                    Export CSV
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Wrapper capturé par le PDF */}
      <Container
        id="dashboard-root"
        sx={{ py: { xs: 2, md: 3 }, maxWidth: "unset !important" }}
      >
        {/* Filters */}
        <Card
          elevation={0}
          sx={{
            position: "sticky",
            top: 56,
            zIndex: (t) => t.zIndex.appBar - 1,
            borderRadius: 3,
            mb: 2,
            border: "1px solid rgba(0,0,0,0.06)",
            background: "linear-gradient(180deg, #fff, #ffffffcc)",
          }}
        >
          <CardContent sx={{ py: 1.5 }}>
            <FilterBar
              data={data}
              year={year}
              setYear={setYear}
              disease={disease}
              setDisease={setDisease}
              month={month}
              setMonth={setMonth}
            />
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Forecasts Section */}
        <SectionCard
          title="Prévisions épidémiologiques (prochaines 72h)"
          icon={<InsightsRoundedIcon />}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Card sx={{ flex: 1, borderRadius: 2 }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Dengue
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {forecastLoading
                      ? "Mise à jour…"
                      : lastForecastAt
                      ? `Dernière maj: ${new Date(
                          lastForecastAt
                        ).toLocaleString()}`
                      : "Non disponible"}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 1 }} />

                {forecastError && (
                  <Alert severity="warning" sx={{ mb: 1 }}>
                    {forecastError}
                  </Alert>
                )}

                {!forecasts.dengue && !forecastLoading ? (
                  <Typography variant="body2" color="text.secondary">
                    Aucune prévision disponible.
                  </Typography>
                ) : (
                  <>
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="subtitle2">
                          Niveau de risque
                        </Typography>
                        {forecasts.dengue ? (
                          <RiskPill
                            risk={forecasts.dengue.riskLevel}
                            prob={forecasts.dengue.probability}
                          />
                        ) : (
                          <Chip label="—" />
                        )}
                      </Stack>

                      <Stack direction="column" spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Probabilité globale
                        </Typography>
                        <SmallBar
                          value={
                            forecasts.dengue ? forecasts.dengue.probability : 0
                          }
                        />
                      </Stack>

                      <Typography variant="caption" color="text.secondary">
                        Détails régionaux
                      </Typography>
                      <Box>
                        {(forecasts.dengue?.regionalScores || [])
                          .slice(0, 4)
                          .map((r) => (
                            <Stack
                              key={r.region}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ py: 0.5 }}
                            >
                              <Typography variant="body2">
                                {r.region}
                              </Typography>
                              <Box sx={{ width: "50%", ml: 1 }}>
                                <SmallBar value={r.score} />
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{ ml: 1, minWidth: 48, textAlign: "right" }}
                              >
                                {Math.round(r.score * 100)}%
                              </Typography>
                            </Stack>
                          ))}
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        Source: {forecasts.dengue?.model || "—"} • Généré:{" "}
                        {forecasts.dengue?.generatedAt
                          ? new Date(
                              forecasts.dengue.generatedAt
                            ).toLocaleString()
                          : "—"}
                      </Typography>
                    </Stack>
                  </>
                )}
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, borderRadius: 2 }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Paludisme
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {forecastLoading
                      ? "Mise à jour…"
                      : lastForecastAt
                      ? `Dernière maj: ${new Date(
                          lastForecastAt
                        ).toLocaleString()}`
                      : "Non disponible"}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 1 }} />

                {!forecasts.paludisme && !forecastLoading ? (
                  <Typography variant="body2" color="text.secondary">
                    Aucune prévision disponible.
                  </Typography>
                ) : (
                  <>
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="subtitle2">
                          Niveau de risque
                        </Typography>
                        {forecasts.paludisme ? (
                          <RiskPill
                            risk={forecasts.paludisme.riskLevel}
                            prob={forecasts.paludisme.probability}
                          />
                        ) : (
                          <Chip label="—" />
                        )}
                      </Stack>

                      <Stack direction="column" spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Probabilité globale
                        </Typography>
                        <SmallBar
                          value={
                            forecasts.paludisme
                              ? forecasts.paludisme.probability
                              : 0
                          }
                        />
                      </Stack>

                      <Typography variant="caption" color="text.secondary">
                        Détails régionaux
                      </Typography>
                      <Box>
                        {(forecasts.paludisme?.regionalScores || [])
                          .slice(0, 4)
                          .map((r) => (
                            <Stack
                              key={r.region}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ py: 0.5 }}
                            >
                              <Typography variant="body2">
                                {r.region}
                              </Typography>
                              <Box sx={{ width: "50%", ml: 1 }}>
                                <SmallBar value={r.score} />
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{ ml: 1, minWidth: 48, textAlign: "right" }}
                              >
                                {Math.round(r.score * 100)}%
                              </Typography>
                            </Stack>
                          ))}
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        Source: {forecasts.paludisme?.model || "—"} • Généré:{" "}
                        {forecasts.paludisme?.generatedAt
                          ? new Date(
                              forecasts.paludisme.generatedAt
                            ).toLocaleString()
                          : "—"}
                      </Typography>
                    </Stack>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
        </SectionCard>

        {/* KPI */}
        <SectionCard title="Indicateurs clés" icon={<QueryStatsRoundedIcon />}>
          <KPICards
            data={filteredData}
            selectedYear={year}
            selectedDisease={disease}
            selectedMonth={month}
          />
        </SectionCard>

        {/* Contrôles de couche + Carte */}
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={4}>
            <SectionCard title="Couches carto" icon={<MapRoundedIcon />}>
              <MapLayerControls
                adminLayer={adminLayer}
                setAdminLayer={setAdminLayer}
                isLoading={isMapLoading}
              />
            </SectionCard>
          </Grid>
          <Grid item xs={12} md={8}>
            <SectionCard
              title="Carte épidémiologique"
              icon={<MapRoundedIcon />}
            >
              <MapView
                data={filteredData}
                adminLayer={adminLayer}
                isLoading={isMapLoading}
                setIsLoading={setIsMapLoading}
              />
            </SectionCard>
          </Grid>
        </Grid>

        {/* Tendances */}
        <SectionCard title="Tendances" icon={<InsightsRoundedIcon />}>
          <TrendCharts
            data={filteredData}
            selectedYear={year}
            selectedDisease={disease}
          />
        </SectionCard>
      </Container>
    </Box>
  );
};

export default Dashboard;

/* ===================== UI Helpers ===================== */

function LoadingState() {
  return (
    <Box
      sx={{
        display: "grid",
        placeItems: "center",
        height: "100vh",
        background: "#f6f9fc",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Chargement des données…
        </Typography>
      </Stack>
    </Box>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <Card
      elevation={0}
      sx={{
        mt: 2,
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.06)",
        background: "linear-gradient(180deg, #fff, #ffffffcc)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        {(title || icon) && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            sx={{ mb: 1.5 }}
          >
            {icon && <Box sx={{ color: PRIMARY_COLOR }}>{icon}</Box>}
            {title && (
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, letterSpacing: "-0.01em" }}
              >
                {title}
              </Typography>
            )}
          </Stack>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

const heroChip = {
  bgcolor: "rgba(255,255,255,0.16)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.35)",
  backdropFilter: "blur(6px)",
};

function RiskPill({ risk, prob }) {
  const color =
    risk === "Très élevé"
      ? "#b71c1c"
      : risk === "Élevé"
      ? "#ef6c00"
      : risk === "Modéré"
      ? "#fbc02d"
      : "#2e7d32";
  return (
    <Chip
      label={`${risk} (${Math.round(prob * 100)}%)`}
      sx={{
        bgcolor: color,
        color: "#fff",
        fontWeight: 700,
        px: 1.5,
      }}
    />
  );
}

function SmallBar({ value }) {
  return (
    <Box sx={{ width: "100%", height: 8, bgcolor: "#eee", borderRadius: 1 }}>
      <Box
        sx={{
          width: `${Math.round(value * 100)}%`,
          height: "100%",
          bgcolor: PRIMARY_COLOR,
          borderRadius: 1,
        }}
      />
    </Box>
  );
}

const iconBtnNeutral = {
  color: PRIMARY_COLOR,
  border: `1px solid ${PRIMARY_COLOR}33`,
};

function iconBtnAccent(color) {
  return {
    color,
    border: `1px solid ${color}33`,
  };
}
