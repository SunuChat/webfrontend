// Footer.jsx — SunuChat · Direction "Editorial Clean"
import React from "react";
import {
  Box, Container, Grid, Typography, Link, Divider, Stack, IconButton,
} from "@mui/material";
import RoomOutlinedIcon               from "@mui/icons-material/RoomOutlined";
import EmailOutlinedIcon              from "@mui/icons-material/EmailOutlined";
import ChatBubbleOutlineRoundedIcon   from "@mui/icons-material/ChatBubbleOutlineRounded";
import PhoneOutlinedIcon              from "@mui/icons-material/PhoneOutlined";
import LinkedInIcon                   from "@mui/icons-material/LinkedIn";
import TwitterIcon                    from "@mui/icons-material/Twitter";
import InstagramIcon                  from "@mui/icons-material/Instagram";
import FacebookIcon                   from "@mui/icons-material/Facebook";
import {
  PRIMARY_COLOR, SECONDARY_COLOR, ACCENT_HOVER,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FOOTER_BG, FONT_SANS,
} from "../constants";

const FOOTER_BORDER = "rgba(0,0,0,0.07)";

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ display: "flex", gap: "3px", alignItems: "flex-end" }}>
        <Box sx={{ width: 9, height: 20, borderRadius: "3px", bgcolor: PRIMARY_COLOR }} />
        <Box sx={{ width: 9, height: 13, borderRadius: "3px", bgcolor: SECONDARY_COLOR }} />
      </Box>
      <Typography
        sx={{
          fontFamily: FONT_SANS, fontWeight: 700, fontSize: "1.05rem",
          color: TEXT_PRIMARY, letterSpacing: "-0.01em",
        }}
      >
        SunuChat
      </Typography>
    </Stack>
  );
}

// ─── Footer link ──────────────────────────────────────────────────────────────
function FLink({ href, children }) {
  return (
    <Link
      href={href}
      underline="none"
      sx={{
        display: "block",
        fontFamily: FONT_SANS,
        fontSize: "0.875rem",
        color: TEXT_SECONDARY,
        py: "4px",
        transition: "color .15s",
        "&:hover": { color: PRIMARY_COLOR },
      }}
    >
      {children}
    </Link>
  );
}

// ─── Column heading ───────────────────────────────────────────────────────────
function ColHeading({ children }) {
  return (
    <Typography
      sx={{
        fontFamily: FONT_SANS,
        fontWeight: 600,
        fontSize: "0.78rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: TEXT_PRIMARY,
        mb: 2,
      }}
    >
      {children}
    </Typography>
  );
}

// ─── Contact row ──────────────────────────────────────────────────────────────
function CRow({ icon, children }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="flex-start">
      <Box sx={{ color: TEXT_MUTED, mt: "2px", flexShrink: 0 }}>{icon}</Box>
      <Typography
        component="div"
        sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_SECONDARY, lineHeight: 1.5 }}
      >
        {children}
      </Typography>
    </Stack>
  );
}

// ─── Social icons ─────────────────────────────────────────────────────────────
const socials = [
  { icon: <LinkedInIcon sx={{ fontSize: 17 }} />,  href: "https://www.linkedin.com/in/ecole-polytechnique-thi%C3%A8s-l%E2%80%99officiel-b32426147/", label: "LinkedIn" },
  { icon: <TwitterIcon sx={{ fontSize: 17 }} />,   href: "https://x.com/EPT_officiel", label: "Twitter" },
  { icon: <InstagramIcon sx={{ fontSize: 17 }} />, href: "https://www.instagram.com/ept_e/", label: "Instagram" },
  { icon: <FacebookIcon sx={{ fontSize: 17 }} />,  href: "https://web.facebook.com/eptthies", label: "Facebook" },
];

// ─── Footer ───────────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: FOOTER_BG, borderTop: `1px solid ${FOOTER_BORDER}` }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 8 }, pb: 0 }}>
        <Grid container spacing={{ xs: 5, md: 6 }}>

          {/* ── Brand ── */}
          <Grid item xs={12} md={4} lg={3.5}>
            <Logo />
            <Typography
              sx={{
                fontFamily: FONT_SANS, fontSize: "0.875rem",
                color: TEXT_SECONDARY, lineHeight: 1.7,
                mt: 2, mb: 2.5, maxWidth: 300,
              }}
            >
              Accès simplifié à l'information sur le paludisme grâce à
              l'intelligence artificielle, en français et en wolof.
            </Typography>

            <Stack direction="row" spacing={0.75} alignItems="center" mb={3}>
              <RoomOutlinedIcon sx={{ fontSize: 15, color: TEXT_MUTED }} />
              <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.8rem", color: TEXT_MUTED }}>
                Thiès, Sénégal
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              {socials.map((s) => (
                <IconButton
                  key={s.label}
                  component="a"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  size="small"
                  sx={{
                    width: 32, height: 32, borderRadius: "8px",
                    color: TEXT_MUTED,
                    bgcolor: "rgba(0,0,0,0.04)",
                    "&:hover": { color: PRIMARY_COLOR, bgcolor: `${PRIMARY_COLOR}12` },
                    transition: "all .15s",
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* ── Plateforme ── */}
          <Grid item xs={6} sm={4} md={2.5} lg={2.5}>
            <ColHeading>Plateforme</ColHeading>
            <Stack spacing={0.25}>
              <FLink href="/chatbot">Chatbot IA</FLink>
              <FLink href="/dashboard">Tableau de bord</FLink>
              <FLink href="/#features">Comment ça marche</FLink>
              <FLink href="/#hero_section">Commencer</FLink>
            </Stack>
          </Grid>

          {/* ── Entreprise ── */}
          <Grid item xs={6} sm={4} md={2.5} lg={2.5}>
            <ColHeading>L'entreprise</ColHeading>
            <Stack spacing={0.25}>
              <FLink href="/team">Notre équipe</FLink>
              <FLink href="/partners">Partenaires</FLink>
              <FLink href="/privacy">Confidentialité</FLink>
              <FLink href="/terms">Conditions</FLink>
              <FLink href="/accessibility">Accessibilité</FLink>
            </Stack>
          </Grid>

          {/* ── Contact ── */}
          <Grid item xs={12} sm={4} md={2.5} lg={3.5}>
            <ColHeading>Contact</ColHeading>
            <Stack spacing={1.75}>
              <CRow icon={<EmailOutlinedIcon sx={{ fontSize: 16 }} />}>
                <Link
                  href="mailto:contact@sunuchat.sn"
                  underline="hover"
                  sx={{ color: TEXT_SECONDARY, fontFamily: FONT_SANS, "&:hover": { color: PRIMARY_COLOR } }}
                >
                  contact@sunuchat.sn
                </Link>
              </CRow>
              <CRow icon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 16 }} />}>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <span>Assistance 24/7</span>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#43a047", flexShrink: 0 }} />
                </Stack>
              </CRow>
              <CRow icon={<PhoneOutlinedIcon sx={{ fontSize: 16 }} />}>
                <Link
                  href="tel:+221777344030"
                  underline="hover"
                  sx={{ color: TEXT_SECONDARY, fontFamily: FONT_SANS, "&:hover": { color: PRIMARY_COLOR } }}
                >
                  +221 77 734 40 30
                </Link>
              </CRow>
            </Stack>
          </Grid>
        </Grid>

        {/* ── Sponsor ── */}
        <Box
          sx={{
            mt: 6,
            py: 2.5,
            borderTop: `1px solid ${FOOTER_BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.78rem", color: TEXT_MUTED }}>
            Soutenu par
          </Typography>
          <Box
            sx={{
              px: 1.5, py: 0.5, borderRadius: "6px",
              border: `1px solid ${FOOTER_BORDER}`,
              bgcolor: "rgba(255,255,255,0.6)",
            }}
          >
            <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.82rem", color: TEXT_SECONDARY }}>
              Grand Challenges Canada
            </Typography>
          </Box>
        </Box>

        {/* ── Bottom bar ── */}
        <Box
          sx={{
            py: 2.5,
            borderTop: `1px solid ${FOOTER_BORDER}`,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.8rem", color: TEXT_MUTED }}>
            © {new Date().getFullYear()} SunuChat — École Polytechnique de Thiès
          </Typography>
          <Stack direction="row" spacing={2.5}>
            {[
              { label: "Confidentialité", href: "/privacy" },
              { label: "Conditions",      href: "/terms" },
              { label: "Accessibilité",   href: "/accessibility" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                underline="hover"
                sx={{
                  fontFamily: FONT_SANS, fontSize: "0.8rem", color: TEXT_MUTED,
                  "&:hover": { color: PRIMARY_COLOR }, transition: "color .15s",
                }}
              >
                {l.label}
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}