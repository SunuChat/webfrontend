import React from "react";
import PropTypes from 'prop-types';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";

// Ajout d'un objet pour mapper les numéros de mois à leurs noms.
const monthNames = {
  "01": "Janvier",
  "02": "Février",
  "03": "Mars",
  "04": "Avril",
  "05": "Mai",
  "06": "Juin",
  "07": "Juillet",
  "08": "Août",
  "09": "Septembre",
  "10": "Octobre",
  "11": "Novembre",
  "12": "Décembre",
};

const FilterBar = ({
  data,
  year,
  setYear,
  disease,
  setDisease,
  month,
  setMonth,
}) => {
  const uniqueYears = Array.from(new Set(data.map((d) => d.Annee)))
    .sort()
    .reverse();
  const uniqueDiseases = Array.from(new Set(data.map((d) => d.Maladie))).sort();
  const uniqueMonths = Array.from(new Set(data.map((d) => d.Mois))).sort();

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <FormControl sx={{ minWidth: 150, flexGrow: 1 }}>
        <InputLabel id="year-filter-label">Année</InputLabel>
        <Select
          labelId="year-filter-label"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          label="Année"
        >
          {/* CORRECTION: Remplacement de <option> par <MenuItem> */}
          <MenuItem value="Toutes">Toutes</MenuItem>
          {uniqueYears.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150, flexGrow: 1 }}>
        <InputLabel id="disease-filter-label">Maladie</InputLabel>
        <Select
          labelId="disease-filter-label"
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
          label="Maladie"
        >
          {/* CORRECTION: Remplacement de <option> par <MenuItem> */}
          <MenuItem value="Toutes">Toutes</MenuItem>
          {uniqueDiseases.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150, flexGrow: 1 }}>
        <InputLabel id="month-filter-label">Mois</InputLabel>
        <Select
          labelId="month-filter-label"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          label="Mois"
        >
          {/* CORRECTION: Remplacement de <option> par <MenuItem> */}
          <MenuItem value="Tous">Tous</MenuItem>
          {uniqueMonths.map((m) => (
            <MenuItem key={m} value={m}>
              {monthNames[m] || m}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

FilterBar.propTypes = {
  data: PropTypes.array.isRequired,
  year: PropTypes.string.isRequired,
  setYear: PropTypes.func.isRequired,
  disease: PropTypes.string.isRequired,
  setDisease: PropTypes.func.isRequired,
  month: PropTypes.string.isRequired,
  setMonth: PropTypes.func.isRequired,
};

export default FilterBar;
