// FilterBar.jsx — SunuChat · Editorial Clean
import React from "react";
import PropTypes from "prop-types";
import {
  Box, Stack, Typography, Select, MenuItem,
  FormControl, InputLabel, Chip,
} from "@mui/material";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import {
  PRIMARY_COLOR, BG_WHITE, BG_SECTION_ALT,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS,
} from "../constants";

const MONTH_NAMES = {
  "01": "Janvier", "02": "Février",  "03": "Mars",
  "04": "Avril",   "05": "Mai",      "06": "Juin",
  "07": "Juillet", "08": "Août",     "09": "Septembre",
  "10": "Octobre", "11": "Novembre", "12": "Décembre",
};

const selectSx = {
  fontFamily: FONT_SANS,
  fontSize: "0.875rem",
  borderRadius: "8px",
  bgcolor: BG_WHITE,
  "& .MuiOutlinedInput-notchedOutline": { borderColor: BORDER_COLOR },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: `${PRIMARY_COLOR}55` },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: PRIMARY_COLOR, borderWidth: "1.5px" },
  "& .MuiSelect-select": { py: "9px", px: "13px" },
};

const labelSx = {
  fontFamily: FONT_SANS, fontSize: "0.875rem",
  "&.Mui-focused": { color: PRIMARY_COLOR },
  "&.MuiInputLabel-shrink": { color: TEXT_MUTED },
};

export default function FilterBar({ data, year, setYear, disease, setDisease, month, setMonth }) {
  const uniqueYears    = Array.from(new Set(data.map((d) => d.Annee))).filter(Boolean).sort().reverse();
  const uniqueDiseases = Array.from(new Set(data.map((d) => d.Maladie))).filter(Boolean).sort();
  const uniqueMonths   = Array.from(new Set(data.map((d) => d.Mois))).filter(Boolean).sort();

  // Compte les filtres actifs
  const activeCount = [year !== "Toutes", disease !== "Toutes", month !== "Tous"].filter(Boolean).length;

  return (
    <Box
      sx={{
        bgcolor: BG_WHITE,
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: "12px",
        px: { xs: 2.5, md: 3 },
        py: 2,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
        {/* Label */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
          <Box sx={{
            width: 30, height: 30, borderRadius: "7px",
            bgcolor: `${PRIMARY_COLOR}10`, color: PRIMARY_COLOR,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FilterListRoundedIcon sx={{ fontSize: 17 }} />
          </Box>
          <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.84rem", color: TEXT_PRIMARY }}>
            Filtres
          </Typography>
          {activeCount > 0 && (
            <Chip
              label={`${activeCount} actif${activeCount > 1 ? "s" : ""}`}
              size="small"
              sx={{
                fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.7rem", height: 20,
                bgcolor: `${PRIMARY_COLOR}10`, color: PRIMARY_COLOR,
                border: `1px solid ${PRIMARY_COLOR}25`,
              }}
            />
          )}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ flex: 1 }}>
          {/* Année */}
          <FormControl sx={{ flex: 1, minWidth: 120 }} size="small">
            <InputLabel sx={labelSx}>Année</InputLabel>
            <Select value={year} onChange={(e) => setYear(e.target.value)} label="Année" sx={selectSx}>
              <MenuItem value="Toutes" sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED }}>
                Toutes les années
              </MenuItem>
              {uniqueYears.map((y) => (
                <MenuItem key={y} value={y} sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem" }}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Maladie */}
          <FormControl sx={{ flex: 1, minWidth: 140 }} size="small">
            <InputLabel sx={labelSx}>Maladie</InputLabel>
            <Select value={disease} onChange={(e) => setDisease(e.target.value)} label="Maladie" sx={selectSx}>
              <MenuItem value="Toutes" sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED }}>
                Toutes les maladies
              </MenuItem>
              {uniqueDiseases.map((d) => (
                <MenuItem key={d} value={d} sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem" }}>{d}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Mois */}
          <FormControl sx={{ flex: 1, minWidth: 130 }} size="small">
            <InputLabel sx={labelSx}>Mois</InputLabel>
            <Select value={month} onChange={(e) => setMonth(e.target.value)} label="Mois" sx={selectSx}>
              <MenuItem value="Tous" sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED }}>
                Tous les mois
              </MenuItem>
              {uniqueMonths.map((m) => (
                <MenuItem key={m} value={m} sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem" }}>
                  {MONTH_NAMES[m] || m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </Box>
  );
}

FilterBar.propTypes = {
  data:       PropTypes.array.isRequired,
  year:       PropTypes.string.isRequired, setYear:    PropTypes.func.isRequired,
  disease:    PropTypes.string.isRequired, setDisease: PropTypes.func.isRequired,
  month:      PropTypes.string.isRequired, setMonth:   PropTypes.func.isRequired,
};