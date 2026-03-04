// AuthLayout.jsx — Layout partagé pour toutes les pages d'authentification
// Split : panneau de marque à gauche / formulaire à droite (desktop)
// Mobile : formulaire seul, centré
import React from "react";
import { Box, Typography, Stack, Button, Chip } from "@mui/material";
import HomeOutlinedIcon         from "@mui/icons-material/HomeOutlined";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import { useNavigate } from "react-router-dom";
import {
  PRIMARY_COLOR, SECONDARY_COLOR, ACCENT_HOVER,
  BG_PAGE, BG_WHITE, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS, FONT_SERIF,
} from "../constants";

// ── Logo (identique au Header) ─────────────────────────────────────────────
export function Logo({ light = false, onClick }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      onClick={onClick}
      sx={{ cursor: onClick ? "pointer" : "default", userSelect: "none" }}
    >
      <Box sx={{ display: "flex", gap: "3px", alignItems: "flex-end" }}>
        <Box sx={{ width: 9, height: 20, borderRadius: "3px", bgcolor: light ? "#fff" : PRIMARY_COLOR }} />
        <Box sx={{ width: 9, height: 13, borderRadius: "3px", bgcolor: SECONDARY_COLOR }} />
      </Box>
      <Typography
        sx={{
          fontFamily: FONT_SANS, fontWeight: 700, fontSize: "1.05rem",
          color: light ? "#fff" : TEXT_PRIMARY, letterSpacing: "-0.01em",
        }}
      >
        SunuChat
      </Typography>
    </Stack>
  );
}

// ── Panneau de marque gauche ───────────────────────────────────────────────
function BrandPanel() {
  const bullets = [
    "Assistant santé en Wolof & Français",
    "Réponses vocales et textuelles",
    "Données sur le paludisme au Sénégal",
    "Gratuit et accessible à tous",
  ];

  return (
    <Box
      sx={{
        width: { md: "42%", lg: "40%" },
        flexShrink: 0,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: PRIMARY_COLOR,
        px: { md: 5, lg: 6 },
        py: 5,
        position: "relative",
        overflow: "hidden",
        // Motif de fond discret
        "&:before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        },
      }}
    >
      {/* Logo */}
      <Logo light />

      {/* Corps */}
      <Box sx={{ position: "relative" }}>
        <Chip
          label="Sénégal · Santé · IA"
          size="small"
          sx={{
            fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.7rem",
            letterSpacing: "0.08em",
            bgcolor: "rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(255,255,255,0.2)",
            mb: 2.5, height: 24,
          }}
        />
        <Typography
          sx={{
            fontFamily: FONT_SERIF,
            fontWeight: 600,
            fontSize: { md: "1.75rem", lg: "2.1rem" },
            color: "#fff",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            mb: 3,
          }}
        >
          L'information santé,{" "}
          <Box component="span" sx={{ color: SECONDARY_COLOR, fontStyle: "italic" }}>
            dans votre langue.
          </Box>
        </Typography>

        <Stack spacing={1.5}>
          {bullets.map((b) => (
            <Stack key={b} direction="row" spacing={1.25} alignItems="center">
              <Box
                sx={{
                  width: 6, height: 6, borderRadius: "50%",
                  bgcolor: SECONDARY_COLOR, flexShrink: 0,
                }}
              />
              <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: "rgba(255,255,255,0.75)" }}>
                {b}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* Footer du panneau */}
      <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", position: "relative" }}>
        © {new Date().getFullYear()} SunuChat · École Polytechnique de Thiès
      </Typography>
    </Box>
  );
}

// ── Barre de nav en haut du formulaire ────────────────────────────────────
function FormNav() {
  const navigate = useNavigate();
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 5 }}
    >
      {/* Logo mobile uniquement */}
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <Logo onClick={() => navigate("/")} />
      </Box>
      {/* Spacer desktop */}
      <Box sx={{ display: { xs: "none", md: "block" } }} />

      {/* Boutons rapides */}
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          startIcon={<HomeOutlinedIcon sx={{ fontSize: "15px !important" }} />}
          onClick={() => navigate("/")}
          sx={{
            fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.8rem",
            textTransform: "none", color: TEXT_MUTED, borderRadius: "7px",
            px: 1.25, py: 0.6,
            "&:hover": { color: TEXT_PRIMARY, bgcolor: "rgba(0,0,0,0.04)" },
          }}
        >
          Accueil
        </Button>
        <Button
          size="small"
          startIcon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: "15px !important" }} />}
          onClick={() => navigate("/chatbot")}
          variant="outlined"
          sx={{
            fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.8rem",
            textTransform: "none", color: PRIMARY_COLOR,
            borderColor: `${PRIMARY_COLOR}35`,
            borderRadius: "7px", px: 1.25, py: 0.6,
            "&:hover": { borderColor: PRIMARY_COLOR, bgcolor: `${PRIMARY_COLOR}06` },
          }}
        >
          Chatbot
        </Button>
      </Stack>
    </Stack>
  );
}

// ── Layout principal ───────────────────────────────────────────────────────
export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: BG_PAGE,
      }}
    >
      {/* Panneau gauche */}
      <BrandPanel />

      {/* Panneau droit — formulaire */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 2.5, sm: 5, md: 6, lg: 8 },
          py: { xs: 4, md: 5 },
          maxWidth: { md: "none" },
          overflowY: "auto",
        }}
      >
        <Box sx={{ maxWidth: 420, width: "100%", mx: "auto" }}>
          <FormNav />
          {children}
        </Box>
      </Box>
    </Box>
  );
}