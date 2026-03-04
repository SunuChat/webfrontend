// RegionModal.jsx — SunuChat · Editorial Clean
// Remplace @headlessui/react + react-icons par MUI natif
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Stack, Typography, Button, Divider, Grid, IconButton,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ThermostatRoundedIcon    from "@mui/icons-material/ThermostatRounded";
import WaterDropOutlinedIcon    from "@mui/icons-material/WaterDropOutlined";
import AirRoundedIcon           from "@mui/icons-material/AirRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import BugReportOutlinedIcon    from "@mui/icons-material/BugReportOutlined";
import {
  PRIMARY_COLOR, SECONDARY_COLOR,
  BG_PAGE, BG_WHITE, BG_SECTION_ALT,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS, FONT_SERIF,
} from "../constants";

// ─── Stat row ─────────────────────────────────────────────────────────────────
function StatRow({ icon, label, value, highlight }) {
  return (
    <Stack
      direction="row" spacing={1.5} alignItems="center"
      sx={{
        px: 2, py: 1.25,
        borderRadius: "8px",
        bgcolor: highlight ? `${PRIMARY_COLOR}06` : "transparent",
        border: `1px solid ${highlight ? `${PRIMARY_COLOR}18` : BORDER_COLOR}`,
      }}
    >
      <Box sx={{
        width: 30, height: 30, borderRadius: "7px",
        bgcolor: `${PRIMARY_COLOR}10`, color: PRIMARY_COLOR,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.75rem", color: TEXT_MUTED, lineHeight: 1.2 }}>
          {label}
        </Typography>
        <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.9rem", color: TEXT_PRIMARY, lineHeight: 1.3 }}>
          {value !== null && value !== undefined && value !== "" ? value : "N/A"}
        </Typography>
      </Box>
    </Stack>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function RegionModal({ isOpen, onClose, regionData }) {
  if (!regionData) return null;

  const {
    Region, Cas_confirmes, Morts, Maladie,
    Temperature_moy, Humidite_moy, Precipitations_tot,
    Densite_moustiques, Population, Vent_vit_moy,
    Densite, Acces_soins,
  } = regionData;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          border: `1px solid ${BORDER_COLOR}`,
          boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3, pt: 3, pb: 2.5,
          bgcolor: BG_SECTION_ALT,
          borderBottom: `1px solid ${BORDER_COLOR}`,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography sx={{
              fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.72rem",
              letterSpacing: "0.09em", textTransform: "uppercase",
              color: SECONDARY_COLOR, mb: 0.5,
            }}>
              Région
            </Typography>
            <Typography sx={{
              fontFamily: FONT_SERIF, fontWeight: 600,
              fontSize: "1.35rem", color: TEXT_PRIMARY, letterSpacing: "-0.015em",
            }}>
              {Region || "Région inconnue"}
            </Typography>
            {Maladie && (
              <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.82rem", color: TEXT_MUTED, mt: 0.25 }}>
                {Maladie}
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={onClose} size="small"
            sx={{
              color: TEXT_MUTED, borderRadius: "8px",
              "&:hover": { bgcolor: BORDER_COLOR, color: TEXT_PRIMARY },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ px: 3, py: 3, bgcolor: BG_WHITE }}>
        {/* Key stats */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <StatRow
              icon={<LocalHospitalOutlinedIcon sx={{ fontSize: 16 }} />}
              label="Cas confirmés"
              value={Number(Cas_confirmes || 0).toLocaleString("fr-FR")}
              highlight
            />
          </Grid>
          <Grid item xs={6}>
            <StatRow
              icon={<BugReportOutlinedIcon sx={{ fontSize: 16 }} />}
              label="Décès"
              value={Number(Morts || 0).toLocaleString("fr-FR")}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2, borderColor: BORDER_COLOR }} />

        <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.78rem", color: TEXT_MUTED, letterSpacing: "0.07em", textTransform: "uppercase", mb: 1.5 }}>
          Facteurs environnementaux
        </Typography>
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <StatRow icon={<ThermostatRoundedIcon sx={{ fontSize: 16 }} />} label="Température moy." value={Temperature_moy !== undefined && Temperature_moy !== null ? `${Temperature_moy} °C` : "N/A"} />
          </Grid>
          <Grid item xs={6}>
            <StatRow icon={<WaterDropOutlinedIcon sx={{ fontSize: 16 }} />} label="Humidité" value={Humidite_moy !== undefined ? `${Humidite_moy} %` : "N/A"} />
          </Grid>
          <Grid item xs={6}>
            <StatRow icon={<AirRoundedIcon sx={{ fontSize: 16 }} />} label="Vent moy." value={Vent_vit_moy !== undefined ? `${Vent_vit_moy} m/s` : "N/A"} />
          </Grid>
          <Grid item xs={6}>
            <StatRow icon={<WaterDropOutlinedIcon sx={{ fontSize: 16 }} />} label="Précipitations" value={Precipitations_tot !== undefined ? `${Precipitations_tot} mm` : "N/A"} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2, borderColor: BORDER_COLOR }} />

        <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.78rem", color: TEXT_MUTED, letterSpacing: "0.07em", textTransform: "uppercase", mb: 1.5 }}>
          Données sociales
        </Typography>
        <Grid container spacing={1.5}>
          <Grid item xs={6}>
            <StatRow icon={<PeopleOutlineRoundedIcon sx={{ fontSize: 16 }} />} label="Population" value={Population ? Number(Population).toLocaleString("fr-FR") : "N/A"} />
          </Grid>
          <Grid item xs={6}>
            <StatRow icon={<PeopleOutlineRoundedIcon sx={{ fontSize: 16 }} />} label="Densité (hab/km²)" value={Densite ?? "N/A"} />
          </Grid>
          <Grid item xs={6}>
            <StatRow icon={<BugReportOutlinedIcon sx={{ fontSize: 16 }} />} label="Densité moustiques" value={Densite_moustiques ?? "N/A"} />
          </Grid>
          <Grid item xs={6}>
            <StatRow icon={<LocalHospitalOutlinedIcon sx={{ fontSize: 16 }} />} label="Accès aux soins" value={Acces_soins !== undefined ? `${Acces_soins} %` : "N/A"} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${BORDER_COLOR}`, bgcolor: BG_SECTION_ALT }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disableElevation
          sx={{
            fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.875rem",
            textTransform: "none", borderRadius: "8px", px: 2.5,
            borderColor: BORDER_COLOR, color: TEXT_SECONDARY,
            "&:hover": { borderColor: TEXT_SECONDARY, bgcolor: "transparent", color: TEXT_PRIMARY },
          }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}