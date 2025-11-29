// src/components/RegionForecastPanel.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Stack,
  LinearProgress,
  Chip,
  Button,
  Tooltip,
  Alert,
} from "@mui/material";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";

// Seuils (à ajuster plus tard ou rendre configurables)
const PALU_THRESHOLD = 2000; // cas / mois
const DENGUE_THRESHOLD = 80; // cas / semaine

// 4h
const REFRESH_INTERVAL_MS = 4 * 60 * 60 * 1000;

// Endpoints backend
const PALU_ALL_URL = `${process.env.REACT_APP_BACK_URL}/epi/predict/palu-all`;
const DENGUE_ALL_URL = `${process.env.REACT_APP_BACK_URL}/epi/predict/dengue-all`;

// ---------------- Helpers pour l'affichage des périodes ---------------- //

const MONTH_NAMES_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

// Convertit (year, isoWeek) → { start: Date, end: Date }
function getIsoWeekDateRange(year, week) {
  // Algorithme classique ISO pour retrouver le lundi de la semaine
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay(); // 0 (dimanche) → 6 (samedi)
  let isoWeekStart = new Date(simple);

  if (dow === 0) {
    // dimanche
    isoWeekStart.setDate(simple.getDate() - 6);
  } else if (dow <= 4) {
    // lundi (1) à jeudi (4)
    isoWeekStart.setDate(simple.getDate() - (dow - 1));
  } else {
    // vendredi (5) ou samedi (6)
    isoWeekStart.setDate(simple.getDate() + (8 - dow));
  }

  const isoWeekEnd = new Date(isoWeekStart);
  isoWeekEnd.setDate(isoWeekStart.getDate() + 6);

  return { start: isoWeekStart, end: isoWeekEnd };
}

function formatDateFr(date) {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// --------------------------------- Component --------------------------------- //

const RegionForecastPanel = () => {
  const [activeTab, setActiveTab] = useState("palu"); // "palu" | "dengue"
  const [showAll, setShowAll] = useState(false);

  const [paluForecasts, setPaluForecasts] = useState([]);
  const [dengueForecasts, setDengueForecasts] = useState([]);

  // Métadonnées envoyées par le backend
  const [paluMeta, setPaluMeta] = useState(null); // { year, month, generated_at, disease }
  const [dengueMeta, setDengueMeta] = useState(null); // { year, week, generated_at, disease }

  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState("");

  const handleTabChange = (_e, newValue) => {
    setActiveTab(newValue);
  };

  // ----- Fetch Palu : /epi/predict/palu-all ----- //
  const fetchPaluAllRegions = useCallback(async () => {
    const res = await fetch(PALU_ALL_URL);
    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status} sur /epi/predict/palu-all`);
    }
    const json = await res.json();

    // json = { generated_at, year, month, disease, regions: [{region, prediction, unit}, ...] }
    setPaluMeta({
      generated_at: json.generated_at,
      year: json.year,
      month: json.month,
      disease: json.disease,
    });

    const nowIso = new Date().toISOString();
    const regions = (json.regions || []).map((r) => ({
      region: r.region,
      value: typeof r.prediction === "number" ? r.prediction : 0,
      unit: r.unit || "malaria_cases",
      updatedAt: nowIso,
    }));

    return regions;
  }, []);

  // ----- Fetch Dengue : /epi/predict/dengue-all ----- //
  const fetchDengueAllRegions = useCallback(async () => {
    const res = await fetch(DENGUE_ALL_URL);
    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status} sur /epi/predict/dengue-all`);
    }
    const json = await res.json();

    // json = { generated_at, year, week, disease, regions: [{region, prediction, unit}, ...] }
    setDengueMeta({
      generated_at: json.generated_at,
      year: json.year,
      week: json.week,
      disease: json.disease,
    });

    const nowIso = new Date().toISOString();
    const regions = (json.regions || []).map((r) => ({
      region: r.region,
      value: typeof r.prediction === "number" ? r.prediction : 0,
      unit: r.unit || "dengue_cases_ssa",
      updatedAt: nowIso,
    }));

    return regions;
  }, []);

  // ----- Fetch global ----- //
  const fetchAllForecasts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [palu, dengue] = await Promise.all([
        fetchPaluAllRegions(),
        fetchDengueAllRegions(),
      ]);
      setPaluForecasts(palu);
      setDengueForecasts(dengue);
      setLastUpdated(new Date().toISOString());
    } catch (e) {
      console.error(e);
      setError("Erreur lors de la récupération des prévisions.");
    } finally {
      setLoading(false);
    }
  }, [fetchPaluAllRegions, fetchDengueAllRegions]);

  useEffect(() => {
    // Premier fetch au montage
    fetchAllForecasts();

    // Rafraîchissement toutes les 4 heures
    const interval = setInterval(fetchAllForecasts, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchAllForecasts]);

  // ----- Sélection entre palu / dengue ----- //
  const currentForecasts = useMemo(
    () => (activeTab === "palu" ? paluForecasts : dengueForecasts),
    [activeTab, paluForecasts, dengueForecasts]
  );

  const threshold = activeTab === "palu" ? PALU_THRESHOLD : DENGUE_THRESHOLD;
  const unit = activeTab === "palu" ? "cas / mois" : "cas / semaine";

  const sortedForecasts = useMemo(() => {
    return [...currentForecasts].sort((a, b) => b.value - a.value);
  }, [currentForecasts]);

  const displayedForecasts = useMemo(() => {
    return showAll ? sortedForecasts : sortedForecasts.slice(0, 5);
  }, [sortedForecasts, showAll]);

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("fr-FR");
  };

  // ----- Textes de contexte (mois courant / semaine courante) ----- //

  const paluSubtitle = useMemo(() => {
    if (!paluMeta) return "";
    const monthIndex = (paluMeta.month || 1) - 1;
    const monthName =
      MONTH_NAMES_FR[monthIndex] || `mois ${String(paluMeta.month)}`;
    return `Prédiction des cas de paludisme pour le mois en cours : ${monthName} ${paluMeta.year}.`;
  }, [paluMeta]);

  const dengueSubtitle = useMemo(() => {
    if (!dengueMeta) return "";

    const { year, week } = dengueMeta;
    const { start, end } = getIsoWeekDateRange(year, week);

    return `Prédiction des cas de dengue pour la semaine en cours : du ${formatDateFr(
      start
    )} au ${formatDateFr(end)} (semaine ${week}, ${year}).`;
  }, [dengueMeta]);

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: "0 18px 45px rgba(15,23,42,0.15)",
        background: "linear-gradient(135deg, #ffffff, rgba(248,250,252,0.95))",
        border: "1px solid rgba(148,163,184,0.2)",
      }}
    >
      <CardContent sx={{ p: 3, pb: 3.5 }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          spacing={2}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 12px 30px rgba(15,23,42,0.25)",
              }}
            >
              <QueryStatsRoundedIcon sx={{ color: "#fff" }} />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ textTransform: "uppercase", letterSpacing: 1 }}
                color="text.secondary"
              >
                Prévisions régionales
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Risque épidémique par région
              </Typography>
            </Box>
          </Stack>

          <Stack alignItems="flex-end" spacing={1}>
            {lastUpdated && (
              <Tooltip
                title={`Dernière mise à jour complète: ${formatDate(
                  lastUpdated
                )}`}
              >
                <Chip
                  size="small"
                  label={`MAJ: ${new Date(lastUpdated).toLocaleTimeString(
                    "fr-FR"
                  )}`}
                  icon={<InsightsRoundedIcon />}
                  sx={{ bgcolor: "rgba(15,23,42,0.04)" }}
                />
              </Tooltip>
            )}
            <Button
              onClick={fetchAllForecasts}
              size="small"
              variant="outlined"
              disabled={loading}
            >
              {loading ? "Actualisation..." : "Actualiser maintenant"}
            </Button>
          </Stack>
        </Stack>

        {/* Tabs Palu / Dengue */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderRadius: 2,
            minHeight: 40,
            mb: 1,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 40,
              borderRadius: 999,
              mx: 0.5,
            },
          }}
        >
          <Tab value="palu" label="Paludisme" />
          <Tab value="dengue" label="Dengue" />
        </Tabs>

        {/* Sous-titre période (mois ou semaine) */}
        {activeTab === "palu" && paluMeta && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, fontStyle: "italic" }}
          >
            {paluSubtitle}
          </Typography>
        )}
        {activeTab === "dengue" && dengueMeta && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, fontStyle: "italic" }}
          >
            {dengueSubtitle}
          </Typography>
        )}

        {/* Erreur éventuelle */}
        {error && (
          <Alert
            severity="warning"
            sx={{ mb: 2, borderRadius: 2, fontSize: 14 }}
          >
            {error}
          </Alert>
        )}

        {/* Liste des régions */}
        <Stack spacing={1.5}>
          {displayedForecasts.map((item) => {
            const isAbove = item.value >= threshold;
            const ratio = Math.min((item.value / threshold) * 100, 130);
            const progressValue = Math.min((item.value / threshold) * 100, 100);

            return (
              <Box
                key={item.region}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: isAbove
                    ? "rgba(239, 68, 68, 0.06)"
                    : "rgba(15,23,42,0.02)",
                  border: `1px solid ${
                    isAbove ? "rgba(239,68,68,0.4)" : "rgba(148,163,184,0.4)"
                  }`,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 140 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, letterSpacing: 0.2 }}
                  >
                    {item.region}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    {Math.round(item.value)} {unit}
                    {isAbove && (
                      <Chip
                        size="small"
                        color="error"
                        icon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
                        label="Alerte"
                        sx={{ ml: 0.5, height: 20 }}
                      />
                    )}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    color={isAbove ? "error" : "primary"}
                    sx={{
                      height: 10,
                      borderRadius: 999,
                      backgroundColor: isAbove
                        ? "rgba(254, 226, 226, 0.8)"
                        : "rgba(191, 219, 254, 0.6)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ minWidth: 70, textAlign: "right" }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {Math.round(ratio)}%
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>

        {/* Footer */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography variant="caption" color="text.secondary">
            Seuil {activeTab === "palu" ? "mensuel" : "hebdomadaire"} défini à{" "}
            <strong>
              {threshold} {unit}
            </strong>
            . Au-delà, les barres passent en rouge.
          </Typography>
          <Button
            size="small"
            onClick={() => setShowAll((prev) => !prev)}
            sx={{ textTransform: "none" }}
          >
            {showAll ? "Voir seulement le Top 5" : "Voir toutes les régions"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RegionForecastPanel;
