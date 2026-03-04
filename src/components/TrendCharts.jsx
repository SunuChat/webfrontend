// TrendCharts.jsx — SunuChat · Editorial Clean
import React, { useMemo } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Grid, Box, Typography } from "@mui/material";
import {
  PRIMARY_COLOR, SECONDARY_COLOR,
  BG_PAGE, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS,
} from "../constants";

ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler
);

const MONTH_LABELS = {
  "01": "Jan", "02": "Fév", "03": "Mar", "04": "Avr",
  "05": "Mai", "06": "Jun", "07": "Jul", "08": "Aoû",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Déc",
};

// ─── Shared chart options factory ─────────────────────────────────────────────
function chartOptions(title) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        align:    "start",
        labels: {
          font: { family: FONT_SANS, size: 12 },
          color: TEXT_SECONDARY,
          padding: 16,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
        },
      },
      title: {
        display: !!title,
        text:    title,
        font: { family: FONT_SANS, size: 13, weight: "600" },
        color: TEXT_PRIMARY,
        padding: { bottom: 12 },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: TEXT_PRIMARY,
        bodyColor:  TEXT_SECONDARY,
        borderColor: BORDER_COLOR,
        borderWidth: 1,
        padding: 10,
        titleFont: { family: FONT_SANS, size: 12, weight: "600" },
        bodyFont:  { family: FONT_SANS, size: 12 },
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: `${BORDER_COLOR}80` },
        ticks: { font: { family: FONT_SANS, size: 11 }, color: TEXT_MUTED },
        border: { color: BORDER_COLOR },
      },
      y: {
        beginAtZero: true,
        grid: { color: `${BORDER_COLOR}80` },
        ticks: { font: { family: FONT_SANS, size: 11 }, color: TEXT_MUTED },
        border: { color: BORDER_COLOR },
      },
    },
  };
}

// ─── Chart wrapper ────────────────────────────────────────────────────────────
function ChartBox({ children, title }) {
  return (
    <Box
      sx={{
        height: 320,
        p: 2.5,
        borderRadius: "10px",
        border: `1px solid ${BORDER_COLOR}`,
        bgcolor: BG_PAGE,
      }}
    >
      {children}
    </Box>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TrendCharts({ data }) {
  const { monthly, regional } = useMemo(() => {
    const mon = {};
    const reg = {};

    data.forEach((d) => {
      // Monthly aggregation
      const m = d.Mois;
      if (m) {
        if (!mon[m]) mon[m] = { cases: 0, deaths: 0, temp: [], hum: [] };
        mon[m].cases  += d.Cas_confirmes || 0;
        mon[m].deaths += d.Morts        || 0;
        if (d.Temperature_moy) mon[m].temp.push(d.Temperature_moy);
        if (d.Humidite_moy)    mon[m].hum.push(d.Humidite_moy);
      }

      // Regional aggregation
      const r = d.Region;
      if (r) {
        if (!reg[r]) reg[r] = { cases: 0, deaths: 0 };
        reg[r].cases  += d.Cas_confirmes || 0;
        reg[r].deaths += d.Morts        || 0;
      }
    });

    return { monthly: mon, regional: reg };
  }, [data]);

  const months  = Object.keys(monthly).sort();
  const regions = Object.keys(regional);
  const monthLabels = months.map((m) => MONTH_LABELS[m] || m);

  // ── Dataset 1 : monthly cases ──
  const monthlyCasesData = {
    labels: monthLabels,
    datasets: [{
      label: "Cas confirmés",
      data:  months.map((m) => monthly[m].cases),
      borderColor: PRIMARY_COLOR,
      backgroundColor: `${PRIMARY_COLOR}18`,
      fill: true,
      tension: 0.35,
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
    }],
  };

  // ── Dataset 2 : environmental ──
  const envData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Température moy. (°C)",
        data: months.map((m) => {
          const t = monthly[m].temp;
          return t.length ? (t.reduce((a, b) => a + b, 0) / t.length).toFixed(1) : null;
        }),
        borderColor: "#e6a817",
        backgroundColor: "rgba(230,168,23,0.12)",
        fill: false, tension: 0.35, pointRadius: 3, borderWidth: 2,
      },
      {
        label: "Humidité moy. (%)",
        data: months.map((m) => {
          const h = monthly[m].hum;
          return h.length ? (h.reduce((a, b) => a + b, 0) / h.length).toFixed(1) : null;
        }),
        borderColor: "#5c6bc0",
        backgroundColor: "rgba(92,107,192,0.08)",
        fill: false, tension: 0.35, pointRadius: 3, borderWidth: 2,
      },
    ],
  };

  // ── Dataset 3 : regional cases ──
  const regCasesData = {
    labels: regions,
    datasets: [{
      label: "Cas confirmés",
      data: regions.map((r) => regional[r].cases),
      backgroundColor: `${PRIMARY_COLOR}70`,
      borderColor: PRIMARY_COLOR,
      borderWidth: 1,
      borderRadius: 5,
    }],
  };

  // ── Dataset 4 : regional deaths ──
  const regDeathsData = {
    labels: regions,
    datasets: [{
      label: "Décès",
      data: regions.map((r) => regional[r].deaths),
      backgroundColor: "rgba(229,57,53,0.55)",
      borderColor: "#e53935",
      borderWidth: 1,
      borderRadius: 5,
    }],
  };

  if (months.length === 0 && regions.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED }}>
          Aucune donnée à afficher pour les filtres sélectionnés.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2.5}>
      {months.length > 0 && (
        <>
          <Grid item xs={12} md={6}>
            <ChartBox>
              <Line options={chartOptions("Tendance mensuelle des cas confirmés")} data={monthlyCasesData} />
            </ChartBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartBox>
              <Line options={chartOptions("Facteurs environnementaux moyens")} data={envData} />
            </ChartBox>
          </Grid>
        </>
      )}
      {regions.length > 0 && (
        <>
          <Grid item xs={12} md={6}>
            <ChartBox>
              <Bar options={chartOptions("Cas confirmés par région")} data={regCasesData} />
            </ChartBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartBox>
              <Bar options={chartOptions("Décès par région")} data={regDeathsData} />
            </ChartBox>
          </Grid>
        </>
      )}
    </Grid>
  );
}