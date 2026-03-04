// MapLayerControls.jsx — SunuChat · Editorial Clean
import React from "react";
import PropTypes from "prop-types";
import {
  Box, Stack, Typography, Select, MenuItem,
  FormControl, InputLabel, ToggleButtonGroup, ToggleButton, Divider,
} from "@mui/material";
import MapRoundedIcon         from "@mui/icons-material/MapRounded";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import {
  PRIMARY_COLOR, BG_WHITE, BG_SECTION_ALT,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS,
} from "../constants";

export const LAYER_CONFIG = {
  admin: {
    regions: {
      name:     "Régions",
      path:     "/delimitations_sen/Sen_regions.geojson",
      type:     "polygon",
      keyProp:  "NOMREG",
      nameProp: "NOMREG",
      dataCol:  "Region",
    },
    districts: {
      name:     "Districts",
      path:     "/delimitations_sen/Sen_districts.geojson",
      type:     "polygon",
      keyProp:  "NAME",
      nameProp: "NAME",
      dataCol:  "District",
    },
  },
  infra: {
    health: {
      name:     "Infrastructures sanitaires",
      path:     "/delimitations_sen/Sen_infrastructures_san.geojson",
      type:     "point",
      nameProp: "Structure",
    },
  },
};

const selectSx = {
  fontFamily: FONT_SANS, fontSize: "0.875rem",
  borderRadius: "8px", bgcolor: BG_WHITE,
  "& .MuiOutlinedInput-notchedOutline": { borderColor: BORDER_COLOR },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: `${PRIMARY_COLOR}55` },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: PRIMARY_COLOR, borderWidth: "1.5px" },
  "& .MuiSelect-select": { py: "9px", px: "13px" },
};

export default function MapLayerControls({ adminLayer, setAdminLayer, visibleLayerType, setVisibleLayerType, isLoading }) {
  return (
    <Stack spacing={2.5}>
      {/* Type de vue */}
      <Box>
        <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.8rem", color: TEXT_PRIMARY, mb: 1 }}>
          Type de vue
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={visibleLayerType}
          onChange={(_, v) => v && setVisibleLayerType(v)}
          fullWidth
          sx={{
            "& .MuiToggleButton-root": {
              fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.82rem",
              textTransform: "none", py: 0.9,
              borderColor: BORDER_COLOR, color: TEXT_SECONDARY,
              "&.Mui-selected": {
                bgcolor: `${PRIMARY_COLOR}10`,
                color: PRIMARY_COLOR,
                borderColor: `${PRIMARY_COLOR}40`,
                fontWeight: 600,
              },
              "&:hover": { bgcolor: `${PRIMARY_COLOR}06` },
            },
          }}
        >
          <ToggleButton value="admin" disabled={isLoading}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <MapRoundedIcon sx={{ fontSize: 16 }} />
              <span>Analyse</span>
            </Stack>
          </ToggleButton>
          <ToggleButton value="infra" disabled={isLoading}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <LocalHospitalOutlinedIcon sx={{ fontSize: 16 }} />
              <span>Infrastructures</span>
            </Stack>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Niveau géographique */}
      {visibleLayerType === "admin" && (
        <>
          <Divider sx={{ borderColor: BORDER_COLOR }} />
          <Box>
            <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.8rem", color: TEXT_PRIMARY, mb: 1 }}>
              Niveau d'analyse
            </Typography>
            <FormControl fullWidth disabled={isLoading} size="small">
              <Select
                value={adminLayer}
                onChange={(e) => setAdminLayer(e.target.value)}
                sx={selectSx}
                displayEmpty
              >
                {Object.entries(LAYER_CONFIG.admin).map(([key, cfg]) => (
                  <MenuItem key={key} value={key} sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem" }}>
                    {cfg.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </>
      )}

      {/* Info contextuelle */}
      <Box sx={{ px: 1.5, py: 1.25, borderRadius: "8px", bgcolor: BG_SECTION_ALT, border: `1px solid ${BORDER_COLOR}` }}>
        <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.75rem", color: TEXT_MUTED, lineHeight: 1.6 }}>
          {visibleLayerType === "admin"
            ? "Survolez une zone pour voir les données épidémiologiques agrégées."
            : "Les points représentent les structures de santé. Survolez pour les détails."}
        </Typography>
      </Box>
    </Stack>
  );
}

MapLayerControls.propTypes = {
  adminLayer:          PropTypes.string.isRequired,
  setAdminLayer:       PropTypes.func.isRequired,
  visibleLayerType:    PropTypes.string.isRequired,
  setVisibleLayerType: PropTypes.func.isRequired,
  isLoading:           PropTypes.bool.isRequired,
};