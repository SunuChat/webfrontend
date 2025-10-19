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
} from "@mui/material";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

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
  const [visibleLayerType, setVisibleLayerType] = useState("admin");

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
  // MODIFIÉ : La logique de chargement a été rendue plus robuste en utilisant une Promise
  // pour s'assurer que les données sont complètement chargées et parsées avant de mettre à jour l'état.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data_epi_final.csv", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const csvText = await response.text();

        // On enveloppe Papa.parse dans une Promise pour pouvoir utiliser await
        const parsedData = await new Promise((resolve, reject) => {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => resolve(results.data),
            error: (error) => reject(error),
          });
        });

        const enrichedData = parsedData
          .map((row) => {
            let date, annee, mois;
            if (row && typeof row.Date === "string" && row.Date.includes("/")) {
              const parts = row.Date.split("/");
              if (parts.length === 3) {
                const [day, monthStr, yearStr] = parts;
                if (day && monthStr && yearStr) {
                  date = new Date(`${yearStr}-${monthStr}-${day}`);
                  if (!isNaN(date.getTime())) {
                    annee = date.getFullYear().toString();
                    mois = (date.getMonth() + 1).toString().padStart(2, "0");
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
      } catch (e) {
        console.error("Erreur de chargement ou de parsing des données:", e);
        setError("Erreur de chargement des données.");
      } finally {
        // Le setLoading est déplacé ici pour s'exécuter dans tous les cas (succès ou erreur)
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ------------------- Data filtering ------------------- */
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const yearMatch = year === "Toutes" || item.Annee === year;
      const diseaseMatch = disease === "Toutes" || item.Maladie === disease;
      const monthMatch = month === "Tous" || item.Mois === month;
      return yearMatch && diseaseMatch && monthMatch;
    });
  }, [data, year, disease, month]);

  /* ------------------- Export PDF ------------------- */
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

  /* ------------------- Forecasts ------------------- */
  const fetchForecasts = useCallback(async () => {
    setForecastLoading(true);
    setForecastError("");
    try {
      // On crée une fonction interne pour gérer chaque appel et sa vérification
      const fetchAndCheck = async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status} pour ${url}`);
        }
        return response.json();
      };

      const denguePromise = fetchAndCheck(FORECAST_ROUTES.dengue);
      const paludismePromise = fetchAndCheck(FORECAST_ROUTES.paludisme);

      const [dengueResult, paludismeResult] = await Promise.all([
        denguePromise,
        paludismePromise,
      ]);

      setForecasts({
        dengue: dengueResult,
        paludisme: paludismeResult,
      });
      setLastForecastAt(Date.now());
    } catch (err) {
      setForecastError(
        err.message || "Erreur lors de la récupération des prévisions."
      );
      console.error(err);
    } finally {
      setForecastLoading(false);
    }
  }, []);

  useEffect(() => {
    const lastForecast = localStorage.getItem("lastForecastAt");
    const lastForecastTime = lastForecast ? parseInt(lastForecast, 10) : 0;

    if (Date.now() - lastForecastTime > THREE_HOURS_MS) {
      fetchForecasts();
    } else {
      const storedForecasts = localStorage.getItem("forecasts");
      if (storedForecasts) {
        setForecasts(JSON.parse(storedForecasts));
        setLastForecastAt(lastForecastTime);
      } else {
        fetchForecasts();
      }
    }
  }, [fetchForecasts]);

  useEffect(() => {
    if (lastForecastAt) {
      localStorage.setItem("lastForecastAt", lastForecastAt.toString());
      localStorage.setItem("forecasts", JSON.stringify(forecasts));
    }
  }, [lastForecastAt, forecasts]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const heroChip = {
    bgcolor: "rgba(255,255,255,0.16)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.35)",
    backdropFilter: "blur(6px)",
  };

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
        {/* On enveloppe la barre de filtres dans une Box pour la rendre "collante" */}
        <Box
          sx={{
            position: "sticky", // Rendre l'élément collant
            top: 56, // Se colle à 56px du haut (hauteur de l'AppBar si vous en avez une)
            zIndex: (t) => t.zIndex.appBar - 1, // Juste en dessous de l'AppBar
            borderRadius: 3, // Bords arrondis
            mb: 2, // Marge en bas
            border: "1px solid rgba(0,0,0,0.06)", // Bordure subtile
            background: "linear-gradient(180deg, #fff, #ffffffcc)", // Fond dégradé pour un effet de verre
          }}
        >
          <FilterBar
            data={data}
            year={year}
            setYear={setYear}
            disease={disease}
            setDisease={setDisease}
            month={month}
            setMonth={setMonth}
          />
        </Box>

        <Box sx={{ my: 3 }}>
          <KPICards data={filteredData} />
        </Box>

        <Grid container spacing={3}>
          {/* Section Carte et Contrôles */}
          <Grid item xs={12} lg={5}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <AddLocationAltIcon sx={{ color: PRIMARY_COLOR }} />
                  <Typography variant="h6" component="h3">
                    Analyse Géographique
                  </Typography>
                </Stack>
                <MapLayerControls
                  adminLayer={adminLayer}
                  setAdminLayer={setAdminLayer}
                  isLoading={isMapLoading}
                  visibleLayerType={visibleLayerType}
                  setVisibleLayerType={setVisibleLayerType}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Section Carte */}
          <Grid item xs={12} lg={7}>
            <MapView
              data={filteredData}
              adminLayer={adminLayer}
              isLoading={isMapLoading}
              setIsLoading={setIsMapLoading}
              visibleLayerType={visibleLayerType}
            />
          </Grid>

          {/* Section Graphiques de Tendance */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <InsightsRoundedIcon sx={{ color: PRIMARY_COLOR }} />
                  <Typography variant="h6" component="h3">
                    Tendances Temporelles
                  </Typography>
                </Stack>
                <TrendCharts
                  data={filteredData}
                  disease={disease}
                  year={year}
                  month={month}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Section Prévisions - Temporairement masquée */}
          {/* 
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <QueryStatsRoundedIcon sx={{ color: PRIMARY_COLOR }} />
                    <Typography variant="h6" component="h3">
                      Prévisions
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {lastForecastAt && (
                      <Tooltip
                        title={`Dernière mise à jour: ${new Date(
                          lastForecastAt
                        ).toLocaleString()}`}
                      >
                        <Chip
                          label={`MAJ: ${new Date(
                            lastForecastAt
                          ).toLocaleTimeString()}`}
                          size="small"
                        />
                      </Tooltip>
                    )}
                    <Button
                      onClick={fetchForecasts}
                      disabled={forecastLoading}
                      size="small"
                    >
                      {forecastLoading ? "Chargement..." : "Actualiser"}
                    </Button>
                  </Stack>
                </Stack>

                {forecastLoading && !forecasts.dengue && (
                  <CircularProgress size={24} />
                )}
                {forecastError && (
                  <Alert severity="warning">{forecastError}</Alert>
                )}

                <Grid container spacing={3}>
                  {forecasts.dengue && (
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle1"
                        align="center"
                        gutterBottom
                      >
                        <Chip
                          icon={<StackedLineChartIcon />}
                          label="Prévision Dengue (7 prochains jours)"
                          color="primary"
                          variant="outlined"
                        />
                      </Typography>
                      <TrendCharts
                        data={forecasts.dengue}
                        isForecast
                        disease="Dengue"
                      />
                    </Grid>
                  )}
                  {forecasts.paludisme && (
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle1"
                        align="center"
                        gutterBottom
                      >
                        <Chip
                          icon={<BarChartIcon />}
                          label="Prévision Paludisme (7 prochains jours)"
                          color="primary"
                          variant="outlined"
                        />
                      </Typography>
                      <TrendCharts
                        data={forecasts.paludisme}
                        isForecast
                        disease="Paludisme"
                      />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          */}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
