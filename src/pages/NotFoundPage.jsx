// NotFoundPage.jsx — SunuChat · Editorial Clean
import React from "react";
import { Box, Typography, Stack, Button, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeOutlinedIcon              from "@mui/icons-material/HomeOutlined";
import ChatBubbleOutlineRoundedIcon  from "@mui/icons-material/ChatBubbleOutlineRounded";
import ArrowForwardRoundedIcon       from "@mui/icons-material/ArrowForwardRounded";
import {
  PRIMARY_COLOR, SECONDARY_COLOR, ACCENT_HOVER,
  BG_PAGE, BG_WHITE, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS, FONT_SERIF,
} from "../constants";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const links = [
    { label: "Accueil",    href: "/",         icon: <HomeOutlinedIcon sx={{ fontSize: 16 }} /> },
    { label: "Chatbot IA", href: "/chatbot",   icon: <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 16 }} /> },
    { label: "Dashboard",  href: "/dashboard", icon: <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} /> },
    { label: "Équipe",     href: "/team",      icon: <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} /> },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: BG_PAGE,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
      }}
    >
      {/* Big 404 */}
      <Box sx={{ position: "relative", mb: 2, userSelect: "none" }}>
        <Typography
          sx={{
            fontFamily: FONT_SERIF,
            fontWeight: 600,
            fontSize: { xs: "7rem", md: "10rem" },
            color: `${PRIMARY_COLOR}10`,
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          404
        </Typography>
        {/* Centered label over the big number */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 48, height: 48, borderRadius: "13px",
              bgcolor: BG_WHITE,
              border: `1px solid ${BORDER_COLOR}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            {/* Simple broken-link icon using CSS */}
            <Typography sx={{ fontSize: "1.4rem" }}>🔍</Typography>
          </Box>
        </Box>
      </Box>

      {/* Text */}
      <Typography
        sx={{
          fontFamily: FONT_SERIF, fontWeight: 600,
          fontSize: { xs: "1.4rem", md: "1.8rem" },
          color: TEXT_PRIMARY, letterSpacing: "-0.02em",
          textAlign: "center", mb: 1.5,
        }}
      >
        Page introuvable
      </Typography>
      <Typography
        sx={{
          fontFamily: FONT_SANS, fontSize: "0.9375rem",
          color: TEXT_MUTED, textAlign: "center",
          maxWidth: 380, lineHeight: 1.7, mb: 4,
        }}
      >
        La page que vous cherchez n'existe pas ou a été déplacée.
        Voici quelques liens utiles pour continuer.
      </Typography>

      {/* CTA principal */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} mb={5}>
        <Button
          variant="contained"
          disableElevation
          onClick={() => navigate("/")}
          startIcon={<HomeOutlinedIcon sx={{ fontSize: 17 }} />}
          sx={{
            fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.9rem",
            textTransform: "none", borderRadius: "8px", px: 2.5, py: 1.1,
            bgcolor: PRIMARY_COLOR,
            "&:hover": { bgcolor: ACCENT_HOVER },
            transition: "background .18s",
          }}
        >
          Retour à l'accueil
        </Button>
        <Button
          variant="outlined"
          disableElevation
          onClick={() => navigate("/chatbot")}
          startIcon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 17 }} />}
          sx={{
            fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.9rem",
            textTransform: "none", borderRadius: "8px", px: 2.5, py: 1.1,
            borderColor: BORDER_COLOR, color: TEXT_SECONDARY,
            "&:hover": { borderColor: TEXT_SECONDARY, bgcolor: "transparent", color: TEXT_PRIMARY },
          }}
        >
          Chatbot IA
        </Button>
      </Stack>

      {/* Quick links */}
      <Box
        sx={{
          bgcolor: BG_WHITE,
          border: `1px solid ${BORDER_COLOR}`,
          borderRadius: "12px",
          px: 3, py: 2.5,
          width: "100%", maxWidth: 340,
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.75rem",
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: TEXT_MUTED, mb: 1.5,
          }}
        >
          Liens rapides
        </Typography>
        <Stack spacing={0.5}>
          {links.map((l) => (
            <Link
              key={l.label}
              onClick={() => navigate(l.href)}
              underline="none"
              sx={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_SECONDARY,
                px: 1, py: 0.75, borderRadius: "7px", cursor: "pointer",
                "&:hover": { color: PRIMARY_COLOR, bgcolor: `${PRIMARY_COLOR}08` },
                transition: "all .15s",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ color: "inherit" }}>{l.icon}</Box>
                {l.label}
              </Stack>
              <ArrowForwardRoundedIcon sx={{ fontSize: 14, opacity: 0.4 }} />
            </Link>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}