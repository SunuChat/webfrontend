// Dashboard.jsx — SunuChat · Editorial Clean
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Papa from "papaparse";
import {
  Box, Container, Typography, Grid, Stack, Card, CardContent,
  CircularProgress, Alert, Button, Chip, Tooltip,
} from "@mui/material";
import BarChartRoundedIcon        from "@mui/icons-material/BarChartRounded";
import AddLocationAltRoundedIcon  from "@mui/icons-material/AddLocationAltRounded";
import DownloadRoundedIcon        from "@mui/icons-material/DownloadRounded";
import PictureAsPdfRoundedIcon    from "@mui/icons-material/PictureAsPdfRounded";
import TuneRoundedIcon            from "@mui/icons-material/TuneRounded";
import InfoOutlinedIcon           from "@mui/icons-material/InfoOutlined";
import jsPDF       from "jspdf";
import html2canvas from "html2canvas";

import KPICards          from "../components/KPICards";
import MapView           from "../components/MapView";
import TrendCharts       from "../components/TrendCharts";
import MapLayerControls  from "../components/MapLayerControls";
import FilterBar         from "../components/FilterBar";
import RegionForecastPanel from "../components/RegionForecastPanel";

import {
  PRIMARY_COLOR, SECONDARY_COLOR, ACCENT_HOVER,
  BG_PAGE, BG_WHITE, BG_SECTION_ALT,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, SHADOW_CARD,
  FONT_SANS, FONT_SERIF,
} from "../constants";

const API_BASE_URL      = process.env.REACT_APP_BACK_URL;
const THREE_HOURS_MS    = 3 * 60 * 60 * 1000;
const FORECAST_ROUTES   = {
  dengue:    "/api/predict/dengue",
  paludisme: "/api/predict/paludisme",
};

export default function Dashboard() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  // Filtres
  const [year,    setYear]    = useState("Toutes");
  const [disease, setDisease] = useState("Toutes");
  const [month,   setMonth]   = useState("Tous");

  // Carte
  const [adminLayer,       setAdminLayer]       = useState("regions");
  const [isMapLoading,     setIsMapLoading]     = useState(false);
  const [visibleLayerType, setVisibleLayerType] = useState("admin");

  // Export
  const [isExporting, setIsExporting] = useState(false);

  // Forecast
  const [forecasts,       setForecasts]       = useState({ dengue: null, paludisme: null });
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError,   setForecastError]   = useState("");
  const [lastForecastAt,  setLastForecastAt]  = useState(null);

  // ── Data load ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/epi/data`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json  = await res.json();
        const apiData = json.data || [];
        const enriched = apiData
          .map((row) => {
            const yearNum  = row.Year  ?? null;
            const monthNum = row.Month ?? null;
            return {
              ...row,
              Annee: yearNum  !== null ? String(yearNum)                         : null,
              Mois:  monthNum !== null ? String(monthNum).padStart(2, "0")       : null,
              Cas_confirmes:   Number(row.Cas_confirmes)   || 0,
              Morts:           Number(row.Morts)           || 0,
              Temperature_moy: Number(row.Temperature_moy) || 0,
              Humidite_moy:    Number(row.Humidite_moy)    || 0,
              Vent_vit_moy:    Number(row.Vent_vit_moy)    || 0,
              Densite:         Number(row.Densite)         || 0,
            };
          })
          .filter((d) => d.Annee !== null);
        setData(enriched);
      } catch (e) {
        setError("Erreur de chargement des données depuis l'API.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Filtered data ────────────────────────────────────────────────────────
  const filteredData = useMemo(() => data.filter((item) => {
    const yearMatch    = year    === "Toutes" || item.Annee   === year;
    const diseaseMatch = disease === "Toutes" || item.Maladie === disease;
    const monthMatch   = month   === "Tous"   || item.Mois    === month;
    return yearMatch && diseaseMatch && monthMatch;
  }), [data, year, disease, month]);

  // ── Export PDF ───────────────────────────────────────────────────────────
  const exportToPDF = async () => {
    const input = document.getElementById("dashboard-root");
    if (!input) return;
    setIsExporting(true);
    try {
      const canvas  = await html2canvas(input, { scale: 2, useCORS: true, backgroundColor: "#ffffff", scrollY: -window.scrollY });
      const imgData = canvas.toDataURL("image/png");
      const pdf     = new jsPDF("p", "mm", "a4");
      const pdfW    = pdf.internal.pageSize.getWidth();
      const pdfH    = pdf.internal.pageSize.getHeight();
      const imgH    = (canvas.height * pdfW) / canvas.width;
      let left      = imgH;
      let pos        = 0;
      pdf.addImage(imgData, "PNG", 0, pos, pdfW, imgH);
      left -= pdfH;
      while (left > -0.1) {
        pos = left - imgH;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, pos, pdfW, imgH);
        left -= pdfH;
      }
      pdf.save("dashboard-epidemiologie.pdf");
    } catch (err) {
      setError("Impossible d'exporter le PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportCSV = () => {
    try {
      const csv  = Papa.unparse(filteredData, { header: true, quotes: true });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `sunuchat-epi-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch { setError("Impossible d'exporter le CSV."); }
  };

  // ── Forecasts ────────────────────────────────────────────────────────────
  const fetchForecasts = useCallback(async () => {
    setForecastLoading(true); setForecastError("");
    try {
      const [dengue, paludisme] = await Promise.all([
        fetch(FORECAST_ROUTES.dengue).then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
        fetch(FORECAST_ROUTES.paludisme).then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
      ]);
      setForecasts({ dengue, paludisme });
      setLastForecastAt(Date.now());
    } catch {
      setForecastError("Erreur lors de la récupération des prévisions.");
    } finally {
      setForecastLoading(false);
    }
  }, []);

  useEffect(() => {
    const last = localStorage.getItem("lastForecastAt");
    if (!last || Date.now() - parseInt(last, 10) > THREE_HOURS_MS) {
      fetchForecasts();
    } else {
      const stored = localStorage.getItem("forecasts");
      if (stored) { setForecasts(JSON.parse(stored)); setLastForecastAt(parseInt(last, 10)); }
      else fetchForecasts();
    }
  }, [fetchForecasts]);

  useEffect(() => {
    if (lastForecastAt) {
      localStorage.setItem("lastForecastAt", String(lastForecastAt));
      localStorage.setItem("forecasts", JSON.stringify(forecasts));
    }
  }, [lastForecastAt, forecasts]);

  // ── Loading / Error states ───────────────────────────────────────────────
  if (loading) return (
    <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Stack spacing={2} alignItems="center">
        <CircularProgress size={36} sx={{ color: PRIMARY_COLOR }} />
        <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED }}>
          Chargement des données…
        </Typography>
      </Stack>
    </Box>
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: BG_PAGE, minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <Box sx={{ bgcolor: BG_WHITE, borderBottom: `1px solid ${BORDER_COLOR}`, py: { xs: 5, md: 7 } }}>
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            gap={3}
          >
            <Box>
              <Typography sx={{
                fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.72rem",
                letterSpacing: "0.1em", textTransform: "uppercase", color: SECONDARY_COLOR, mb: 1.5,
              }}>
                Données épidémiologiques
              </Typography>
              <Typography sx={{
                fontFamily: FONT_SERIF, fontWeight: 600,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                letterSpacing: "-0.025em", color: TEXT_PRIMARY, lineHeight: 1.15, mb: 1,
              }}>
                Tableau de bord
              </Typography>
              <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.9rem", color: TEXT_SECONDARY, lineHeight: 1.7, maxWidth: 480 }}>
                Suivi en temps réel de l'évolution du paludisme et de la dengue au Sénégal.
              </Typography>
            </Box>

            {/* Export buttons */}
            <Stack direction="row" spacing={1.25} flexShrink={0}>
              <Tooltip title="Télécharger les données filtrées (CSV)">
                <Button
                  onClick={exportCSV}
                  variant="outlined"
                  startIcon={<DownloadRoundedIcon sx={{ fontSize: 16 }} />}
                  disableElevation
                  sx={{
                    fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.84rem",
                    textTransform: "none", borderRadius: "8px", px: 2, py: "7px",
                    borderColor: BORDER_COLOR, color: TEXT_SECONDARY,
                    "&:hover": { borderColor: TEXT_SECONDARY, bgcolor: "transparent", color: TEXT_PRIMARY },
                  }}
                >
                  CSV
                </Button>
              </Tooltip>
              <Tooltip title="Exporter le dashboard en PDF">
                <Button
                  onClick={exportToPDF}
                  disabled={isExporting}
                  variant="contained"
                  startIcon={<PictureAsPdfRoundedIcon sx={{ fontSize: 16 }} />}
                  disableElevation
                  sx={{
                    fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.84rem",
                    textTransform: "none", borderRadius: "8px", px: 2, py: "7px",
                    bgcolor: PRIMARY_COLOR,
                    "&:hover": { bgcolor: ACCENT_HOVER },
                    "&:disabled": { bgcolor: `${PRIMARY_COLOR}55`, color: "rgba(255,255,255,0.7)" },
                  }}
                >
                  {isExporting ? "Génération…" : "PDF"}
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ── Disclaimer banner ── */}
      <Box sx={{ bgcolor: "#fffbeb", borderBottom: "1px solid #fde68a" }}>
        <Container maxWidth="xl">
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ py: 1.25 }}>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: "#b45309", flexShrink: 0 }} />
            <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.82rem", color: "#92400e", lineHeight: 1.5 }}>
              <strong>Données indicatives.</strong>{" "}
              Les données affichées ne sont pas encore à jour. Nous collaborons avec le Ministère de la Santé et de l'Action Sociale du Sénégal pour intégrer prochainement des données officielles actualisées.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* ── Content ── */}
      <Container id="dashboard-root" maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Sticky filter bar */}
        <Box sx={{
          position: "sticky", top: 56, zIndex: (t) => t.zIndex.appBar - 1,
          mb: 3,
        }}>
          <FilterBar
            data={data}
            year={year}     setYear={setYear}
            disease={disease} setDisease={setDisease}
            month={month}   setMonth={setMonth}
          />
        </Box>

        {/* KPIs */}
        <Box sx={{ mb: 3 }}>
          <KPICards data={filteredData} />
        </Box>

        {/* Map + Controls */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={4}>
            <DashCard
              icon={<AddLocationAltRoundedIcon sx={{ fontSize: 18 }} />}
              title="Analyse géographique"
            >
              <MapLayerControls
                adminLayer={adminLayer}         setAdminLayer={setAdminLayer}
                isLoading={isMapLoading}
                visibleLayerType={visibleLayerType} setVisibleLayerType={setVisibleLayerType}
              />
            </DashCard>
          </Grid>
          <Grid item xs={12} lg={8}>
            <MapView
              data={filteredData}
              adminLayer={adminLayer}
              isLoading={isMapLoading}
              setIsLoading={setIsMapLoading}
              visibleLayerType={visibleLayerType}
            />
          </Grid>
        </Grid>

        {/* Trend charts */}
        <DashCard
          icon={<BarChartRoundedIcon sx={{ fontSize: 18 }} />}
          title="Tendances temporelles"
          sx={{ mb: 3 }}
        >
          <TrendCharts data={filteredData} disease={disease} year={year} month={month} />
        </DashCard>

      </Container>
    </Box>
  );
}

// ── Reusable section card ─────────────────────────────────────────────────────
function DashCard({ icon, title, children, sx = {} }) {
  return (
    <Box
      sx={{
        bgcolor: BG_WHITE,
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: "14px",
        overflow: "hidden",
        ...sx,
      }}
    >
      <Stack
        direction="row" spacing={1.5} alignItems="center"
        sx={{ px: { xs: 2.5, md: 3 }, py: 2, borderBottom: `1px solid ${BORDER_COLOR}`, bgcolor: BG_SECTION_ALT }}
      >
        <Box sx={{
          width: 32, height: 32, borderRadius: "8px",
          bgcolor: `${PRIMARY_COLOR}10`, color: PRIMARY_COLOR,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </Box>
        <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.875rem", color: TEXT_PRIMARY }}>
          {title}
        </Typography>
      </Stack>
      <Box sx={{ p: { xs: 2.5, md: 3 } }}>{children}</Box>
    </Box>
  );
}