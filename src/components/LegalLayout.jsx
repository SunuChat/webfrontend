// LegalLayout.jsx — Layout partagé pour les pages légales (Privacy, Terms, Accessibility)
import React from "react";
import { Box, Container, Typography, Stack, Link, Chip } from "@mui/material";
import {
  PRIMARY_COLOR, SECONDARY_COLOR, BG_PAGE, BG_WHITE,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS, FONT_SERIF,
} from "../constants";

// ── Section heading ────────────────────────────────────────────────────────
export function LegalH2({ children }) {
  return (
    <Typography
      sx={{
        fontFamily: FONT_SERIF, fontWeight: 600,
        fontSize: { xs: "1.05rem", md: "1.15rem" },
        color: TEXT_PRIMARY, letterSpacing: "-0.01em",
        mt: 4, mb: 1.25, lineHeight: 1.3,
      }}
    >
      {children}
    </Typography>
  );
}

// ── Body text ──────────────────────────────────────────────────────────────
export function LegalBody({ children, sx = {} }) {
  return (
    <Typography
      sx={{
        fontFamily: FONT_SANS, fontSize: "0.9rem",
        color: TEXT_SECONDARY, lineHeight: 1.8, ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

// ── List item ──────────────────────────────────────────────────────────────
export function LegalList({ items }) {
  return (
    <Stack component="ul" spacing={1} sx={{ pl: 0, m: 0, listStyle: "none" }}>
      {items.map((item, i) => (
        <Stack key={i} component="li" direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              mt: "7px", width: 5, height: 5, borderRadius: "50%",
              bgcolor: SECONDARY_COLOR, flexShrink: 0,
            }}
          />
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.9rem", color: TEXT_SECONDARY, lineHeight: 1.8 }}>
            {item}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

// ── Section divider ────────────────────────────────────────────────────────
export function LegalDivider() {
  return <Box sx={{ height: "1px", bgcolor: BORDER_COLOR, my: 3 }} />;
}

// ── Main layout ────────────────────────────────────────────────────────────
export default function LegalLayout({ badge, title, updatedAt, children }) {
  return (
    <Box sx={{ bgcolor: BG_PAGE, minHeight: "100vh" }}>
      {/* Hero strip */}
      <Box
        sx={{
          bgcolor: BG_WHITE,
          borderBottom: `1px solid ${BORDER_COLOR}`,
          py: { xs: 5, md: 7 },
        }}
      >
        <Container maxWidth="md">
          {badge && (
            <Chip
              label={badge}
              size="small"
              sx={{
                fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.7rem",
                letterSpacing: "0.08em", height: 24,
                bgcolor: `${PRIMARY_COLOR}0D`,
                color: PRIMARY_COLOR,
                border: `1px solid ${PRIMARY_COLOR}22`,
                mb: 2,
              }}
            />
          )}
          <Typography
            sx={{
              fontFamily: FONT_SERIF, fontWeight: 600,
              fontSize: { xs: "1.8rem", md: "2.4rem" },
              letterSpacing: "-0.025em", color: TEXT_PRIMARY,
              lineHeight: 1.2, mb: 1.5,
            }}
          >
            {title}
          </Typography>
          {updatedAt && (
            <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.8rem", color: TEXT_MUTED }}>
              Dernière mise à jour : {updatedAt}
            </Typography>
          )}
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
        <Box
          sx={{
            bgcolor: BG_WHITE,
            border: `1px solid ${BORDER_COLOR}`,
            borderRadius: "14px",
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 5 },
          }}
        >
          {children}
        </Box>

        {/* Contact footer */}
        <Box
          sx={{
            mt: 4, px: { xs: 2, md: 0 },
            display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: 1,
          }}
        >
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.8rem", color: TEXT_MUTED }}>
            Une question sur ce document ?{" "}
            <Link
              href="mailto:contact@sunuchat.sn"
              sx={{
                color: PRIMARY_COLOR, fontWeight: 500,
                textDecoration: "none", "&:hover": { textDecoration: "underline" },
              }}
            >
              contact@sunuchat.sn
            </Link>
          </Typography>
          <Stack direction="row" spacing={2}>
            {[
              { label: "Confidentialité", href: "/privacy" },
              { label: "Conditions",      href: "/terms" },
              { label: "Accessibilité",   href: "/accessibility" },
            ].map((l) => (
              <Link
                key={l.label} href={l.href}
                sx={{
                  fontFamily: FONT_SANS, fontSize: "0.8rem", color: TEXT_MUTED,
                  textDecoration: "none", "&:hover": { color: PRIMARY_COLOR },
                  transition: "color .15s",
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