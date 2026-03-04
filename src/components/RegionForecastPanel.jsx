// RegionForecastPanel.jsx — SunuChat · Editorial Clean
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box, Stack, Typography, Tabs, Tab, LinearProgress,
  Chip, Button, Tooltip, Alert, Divider,
} from "@mui/material";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import {
  PRIMARY_COLOR, SECONDARY_COLOR,
  BG_WHITE, BG_PAGE, BG_SECTION_ALT,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS, FONT_SERIF,
} from "../constants";

const PALU_THRESHOLD   = 2000;
const DENGUE_THRESHOLD = 80;
const REFRESH_MS       = 4 * 60 * 60 * 1000;
const PALU_URL         = `${process.env.REACT_APP_BACK_URL}/epi/predict/palu-all`;
const DENGUE_URL       = `${process.env.REACT_APP_BACK_URL}/epi/predict/dengue-all`;

const MONTH_FR = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];

function isoWeekRange(year, week) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const start = new Date(simple);
  if (dow === 0) start.setDate(simple.getDate() - 6);
  else if (dow <= 4) start.setDate(simple.getDate() - (dow - 1));
  else start.setDate(simple.getDate() + (8 - dow));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

function dateFr(d) {
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

// ─── Region row ───────────────────────────────────────────────────────────────
function RegionRow({ item, threshold, unit }) {
  const isAbove = item.value >= threshold;
  const pct     = Math.min((item.value / threshold) * 100, 100);

  return (
    <Box
      sx={{
        px: 2, py: 1.5,
        borderRadius: "9px",
        border: `1px solid ${isAbove ? "rgba(229,57,53,0.3)" : BORDER_COLOR}`,
        bgcolor: isAbove ? "rgba(229,57,53,0.04)" : BG_PAGE,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ minWidth: 140 }}>
          <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.84rem", color: TEXT_PRIMARY }}>
            {item.region}
          </Typography>
          <Stack direction="row" spacing={0.75} alignItems="center" mt={0.25}>
            <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.75rem", color: TEXT_MUTED }}>
              {Math.round(item.value)} {unit}
            </Typography>
            {isAbove && (
              <Chip
                icon={<WarningAmberRoundedIcon sx={{ fontSize: "12px !important" }} />}
                label="Alerte"
                size="small"
                sx={{
                  fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.68rem", height: 18,
                  bgcolor: "rgba(229,57,53,0.08)", color: "#c62828",
                  border: "1px solid rgba(229,57,53,0.25)",
                  "& .MuiChip-icon": { color: "#c62828 !important" },
                }}
              />
            )}
          </Stack>
        </Box>

        <Box sx={{ flex: 1 }}>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{
              height: 6, borderRadius: 3,
              bgcolor: isAbove ? "rgba(229,57,53,0.12)" : `${PRIMARY_COLOR}15`,
              "& .MuiLinearProgress-bar": {
                borderRadius: 3,
                bgcolor: isAbove ? "#e53935" : PRIMARY_COLOR,
              },
            }}
          />
        </Box>

        <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.75rem", color: TEXT_MUTED, minWidth: 36, textAlign: "right" }}>
          {Math.round(pct)}%
        </Typography>
      </Stack>
    </Box>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function RegionForecastPanel() {
  const [tab,     setTab]     = useState("palu");
  const [showAll, setShowAll] = useState(false);

  const [paluData,   setPaluData]   = useState([]);
  const [dengueData, setDengueData] = useState([]);
  const [paluMeta,   setPaluMeta]   = useState(null);
  const [dengueMeta, setDengueMeta] = useState(null);

  const [loading,     setLoading]     = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error,       setError]       = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [pj, dj] = await Promise.all([
        fetch(PALU_URL).then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
        fetch(DENGUE_URL).then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
      ]);
      setPaluMeta({ year: pj.year, month: pj.month });
      setPaluData((pj.regions || []).map((r) => ({ region: r.region, value: Number(r.prediction) || 0 })));
      setDengueMeta({ year: dj.year, week: dj.week });
      setDengueData((dj.regions || []).map((r) => ({ region: r.region, value: Number(r.prediction) || 0 })));
      setLastUpdated(new Date());
    } catch {
      setError("Impossible de récupérer les prévisions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, REFRESH_MS);
    return () => clearInterval(id);
  }, [fetchAll]);

  const sorted = useMemo(() => {
    const src = tab === "palu" ? paluData : dengueData;
    return [...src].sort((a, b) => b.value - a.value);
  }, [tab, paluData, dengueData]);

  const displayed   = showAll ? sorted : sorted.slice(0, 5);
  const threshold   = tab === "palu" ? PALU_THRESHOLD : DENGUE_THRESHOLD;
  const unit        = tab === "palu" ? "cas/mois"     : "cas/sem.";

  const subtitle = useMemo(() => {
    if (tab === "palu" && paluMeta) {
      const mName = MONTH_FR[(paluMeta.month || 1) - 1] || `mois ${paluMeta.month}`;
      return `Prédiction pour ${mName} ${paluMeta.year}`;
    }
    if (tab === "dengue" && dengueMeta) {
      const { start, end } = isoWeekRange(dengueMeta.year, dengueMeta.week);
      return `Du ${dateFr(start)} au ${dateFr(end)} (sem. ${dengueMeta.week})`;
    }
    return "";
  }, [tab, paluMeta, dengueMeta]);

  return (
    <Box
      sx={{
        bgcolor: BG_WHITE,
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: "14px",
        overflow: "hidden",
        mb: 3,
      }}
    >
      {/* Header */}
      <Stack
        direction="row" spacing={1.5} alignItems="center" justifyContent="space-between"
        sx={{ px: { xs: 2.5, md: 3 }, py: 2, borderBottom: `1px solid ${BORDER_COLOR}`, bgcolor: BG_SECTION_ALT }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: `${PRIMARY_COLOR}10`, color: PRIMARY_COLOR, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <QueryStatsRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.875rem", color: TEXT_PRIMARY, lineHeight: 1.2 }}>
              Prévisions régionales
            </Typography>
            {lastUpdated && (
              <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.72rem", color: TEXT_MUTED }}>
                MAJ : {lastUpdated.toLocaleTimeString("fr-FR")}
              </Typography>
            )}
          </Box>
        </Stack>
        <Button
          size="small"
          startIcon={<RefreshRoundedIcon sx={{ fontSize: 15 }} />}
          onClick={fetchAll}
          disabled={loading}
          sx={{
            fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.78rem",
            textTransform: "none", color: TEXT_MUTED, borderRadius: "7px",
            "&:hover": { bgcolor: "rgba(0,0,0,0.04)", color: TEXT_PRIMARY },
          }}
        >
          {loading ? "Chargement…" : "Actualiser"}
        </Button>
      </Stack>

      <Box sx={{ px: { xs: 2.5, md: 3 }, py: 2.5 }}>
        {error && <Alert severity="warning" sx={{ mb: 2, borderRadius: "8px", fontFamily: FONT_SANS, fontSize: "0.84rem" }}>{error}</Alert>}

        {/* Tabs */}
        <Tabs
          value={tab} onChange={(_, v) => setTab(v)}
          sx={{
            mb: 2, minHeight: 36,
            "& .MuiTab-root": { fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.84rem", textTransform: "none", minHeight: 36, py: 0.75 },
            "& .MuiTabs-indicator": { bgcolor: PRIMARY_COLOR },
            "& .Mui-selected": { color: `${PRIMARY_COLOR} !important`, fontWeight: 600 },
          }}
        >
          <Tab value="palu"   label="Paludisme" />
          <Tab value="dengue" label="Dengue" />
        </Tabs>

        {subtitle && (
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.8rem", color: TEXT_MUTED, fontStyle: "italic", mb: 2 }}>
            {subtitle}
          </Typography>
        )}

        {/* Rows */}
        <Stack spacing={1}>
          {displayed.map((item) => (
            <RegionRow key={item.region} item={item} threshold={threshold} unit={unit} />
          ))}
          {displayed.length === 0 && !loading && (
            <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED, py: 2, textAlign: "center" }}>
              Aucune donnée de prévision disponible.
            </Typography>
          )}
        </Stack>

        {/* Footer */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.75rem", color: TEXT_MUTED }}>
            Seuil : <strong>{threshold.toLocaleString()} {unit}</strong>
          </Typography>
          {sorted.length > 5 && (
            <Button
              size="small"
              onClick={() => setShowAll((p) => !p)}
              sx={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.78rem", textTransform: "none", color: PRIMARY_COLOR }}
            >
              {showAll ? "Voir moins" : `Voir toutes les ${sorted.length} régions`}
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
}