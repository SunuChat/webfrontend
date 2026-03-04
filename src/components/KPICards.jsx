// KPICards.jsx — SunuChat · Editorial Clean
import React, { useMemo } from "react";
import { Grid, Box, Typography, Stack } from "@mui/material";
import {
  PRIMARY_COLOR, SECONDARY_COLOR,
  BG_WHITE, BG_SECTION_ALT,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS, FONT_SERIF,
} from "../constants";

// ─── KPI card definition ──────────────────────────────────────────────────────
const KPI_DEF = [
  { key: "totalCases",   label: "Cas confirmés",        emoji: "🏥", color: PRIMARY_COLOR },
  { key: "totalDeath",   label: "Décès",                emoji: "🕊️",  color: "#e53935" },
  { key: "malariaCases", label: "Cas paludisme",         emoji: "🦟", color: "#00897b" },
  { key: "dengueCases",  label: "Cas dengue",            emoji: "🦠", color: "#f57c00" },
  { key: "avgTemp",      label: "Température moy. (°C)", emoji: "🌡️",  color: "#e6a817", format: (v) => v === "N/A" ? "N/A" : `${v} °C` },
  { key: "avgHumidity",  label: "Humidité moy. (%)",    emoji: "💧", color: "#5c6bc0", format: (v) => v === "N/A" ? "N/A" : `${v} %` },
  { key: "avgWind",      label: "Vent moy. (m/s)",      emoji: "🌬️",  color: "#8d6e63", format: (v) => v === "N/A" ? "N/A" : `${v} m/s` },
];

// ─── Single KPI card ──────────────────────────────────────────────────────────
function KPICard({ label, value, emoji, color }) {
  return (
    <Box
      sx={{
        bgcolor: BG_WHITE,
        border: `1px solid ${BORDER_COLOR}`,
        borderTop: `3px solid ${color}`,
        borderRadius: "12px",
        p: { xs: 2, md: 2.5 },
        height: "100%",
        transition: "box-shadow .2s, transform .2s",
        "&:hover": {
          boxShadow: `0 8px 24px ${color}18, 0 2px 6px rgba(0,0,0,0.04)`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 40, height: 40, borderRadius: "10px",
            bgcolor: `${color}12`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem", flexShrink: 0,
          }}
        >
          {emoji}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: FONT_SANS, fontSize: "0.75rem",
              color: TEXT_MUTED, lineHeight: 1.3, mb: 0.5,
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_SERIF, fontWeight: 600,
              fontSize: { xs: "1.4rem", md: "1.6rem" },
              color: TEXT_PRIMARY, lineHeight: 1, letterSpacing: "-0.02em",
            }}
          >
            {value}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function KPICards({ data }) {
  const metrics = useMemo(() => {
    const valid_c = data.filter((d) => !isNaN(d.Cas_confirmes));
    const valid_d = data.filter((d) => !isNaN(d.Morts));

    const totalCases   = valid_c.reduce((s, d) => s + d.Cas_confirmes, 0);
    const totalDeath   = valid_d.reduce((s, d) => s + d.Morts, 0);
    const malariaCases = valid_c.filter((d) => d.Maladie === "Paludisme").reduce((s, d) => s + d.Cas_confirmes, 0);
    const dengueCases  = valid_c.filter((d) => d.Maladie === "Dengue").reduce((s, d) => s + d.Cas_confirmes, 0);

    const avg = (arr, field) => {
      const vals = arr.map((d) => d[field]).filter((v) => typeof v === "number" && !isNaN(v));
      return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "N/A";
    };

    return {
      totalCases,   totalDeath,
      malariaCases, dengueCases,
      avgTemp:     avg(valid_c, "Temperature_moy"),
      avgHumidity: avg(valid_c, "Humidite_moy"),
      avgWind:     avg(valid_c, "Vent_vit_moy"),
    };
  }, [data]);

  return (
    <Grid container spacing={2}>
      {KPI_DEF.map((def) => {
        const raw    = metrics[def.key];
        const value  = def.format
          ? def.format(raw)
          : typeof raw === "number"
            ? raw.toLocaleString("fr-FR")
            : raw;
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={12/7} key={def.key}>
            <KPICard label={def.label} value={value} emoji={def.emoji} color={def.color} />
          </Grid>
        );
      })}
    </Grid>
  );
}

export default React.memo(KPICards);