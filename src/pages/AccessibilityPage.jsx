// AccessibilityPage.jsx — SunuChat · Editorial Clean
import React from "react";
import { Box, Stack, Typography, Link } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import HearingRoundedIcon from "@mui/icons-material/HearingRounded";
import KeyboardRoundedIcon from "@mui/icons-material/KeyboardRounded";
import ContrastRoundedIcon from "@mui/icons-material/ContrastRounded";
import ImageSearchRoundedIcon from "@mui/icons-material/ImageSearchRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import LegalLayout, {
  LegalH2, LegalBody, LegalList, LegalDivider,
} from "../components/LegalLayout";
import {
  PRIMARY_COLOR, SECONDARY_COLOR, BG_SECTION_ALT,
  TEXT_PRIMARY, TEXT_SECONDARY, BORDER_COLOR, FONT_SANS, FONT_SERIF,
} from "../constants";

// ── Feature card ───────────────────────────────────────────────────────────
function AccessFeature({ icon, title, body }) {
  return (
    <Box
      sx={{
        display: "flex", gap: 2, alignItems: "flex-start",
        p: 2.5, borderRadius: "10px",
        border: `1px solid ${BORDER_COLOR}`,
        bgcolor: BG_SECTION_ALT,
      }}
    >
      <Box
        sx={{
          width: 38, height: 38, borderRadius: "9px", flexShrink: 0,
          bgcolor: `${PRIMARY_COLOR}10`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: PRIMARY_COLOR,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.875rem", color: TEXT_PRIMARY, mb: 0.4 }}>
          {title}
        </Typography>
        <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.84rem", color: TEXT_SECONDARY, lineHeight: 1.65 }}>
          {body}
        </Typography>
      </Box>
    </Box>
  );
}

export default function AccessibilityPage() {
  const features = [
    {
      icon: <ContrastRoundedIcon sx={{ fontSize: 19 }} />,
      title: "Contraste élevé",
      body: "Le texte et les éléments d'interface respectent un rapport de contraste minimum de 4.5:1 conforme WCAG AA.",
    },
    {
      icon: <HearingRoundedIcon sx={{ fontSize: 19 }} />,
      title: "Compatibilité lecteurs d'écran",
      body: "Les composants sont balisés sémantiquement (ARIA) pour fonctionner avec NVDA, VoiceOver et JAWS.",
    },
    {
      icon: <KeyboardRoundedIcon sx={{ fontSize: 19 }} />,
      title: "Navigation au clavier",
      body: "L'intégralité de l'interface est navigable au clavier, sans nécessiter l'usage d'une souris.",
    },
    {
      icon: <ImageSearchRoundedIcon sx={{ fontSize: 19 }} />,
      title: "Textes alternatifs",
      body: "Toutes les images fonctionnelles disposent d'un attribut alt descriptif pour les utilisateurs non-voyants.",
    },
    {
      icon: <TranslateRoundedIcon sx={{ fontSize: 19 }} />,
      title: "Multilingue & vocal",
      body: "Le chatbot répond en Wolof et en Français, avec support vocal intégré pour les personnes non-lectrices.",
    },
    {
      icon: <CheckRoundedIcon sx={{ fontSize: 19 }} />,
      title: "Responsive & léger",
      body: "L'interface s'adapte à tous les écrans et est optimisée pour les connexions lentes, courantes en zones rurales.",
    },
  ];

  return (
    <LegalLayout
      badge="Accessibilité"
      title="Politique d'accessibilité"
      updatedAt="juillet 2025"
    >
      <LegalBody>
        SunuChat s'engage à rendre sa plateforme accessible au plus grand nombre,
        y compris aux personnes en situation de handicap, conformément à notre
        mission d'inclusion numérique au Sénégal et en Afrique de l'Ouest.
      </LegalBody>

      <LegalDivider />

      <LegalH2>Notre engagement</LegalH2>
      <LegalBody>
        Nous nous efforçons de suivre les recommandations des directives
        internationales <strong>WCAG 2.1 niveau AA</strong> afin d'assurer une
        expérience inclusive et équitable pour tous les utilisateurs,
        indépendamment de leurs capacités ou de leur équipement.
      </LegalBody>

      <LegalH2>Fonctionnalités d'accessibilité</LegalH2>
      <Stack spacing={1.5} sx={{ mt: 0.5 }}>
        {features.map((f) => (
          <AccessFeature key={f.title} {...f} />
        ))}
      </Stack>

      <LegalH2>Limites connues</LegalH2>
      <LegalBody>
        Certaines fonctionnalités avancées du tableau de bord (graphiques
        interactifs) peuvent présenter des limitations pour les utilisateurs de
        lecteurs d'écran. Nous travaillons activement à améliorer leur
        accessibilité. Des alternatives textuelles sont disponibles sur demande.
      </LegalBody>

      <LegalH2>Conformité</LegalH2>
      <LegalList
        items={[
          "WCAG 2.1 niveau AA — partiellement conforme",
          "RGAA (Référentiel Général d'Amélioration de l'Accessibilité) — en cours d'évaluation",
          "Section 508 — compatible pour les fonctions principales",
        ]}
      />

      <LegalH2>Signaler un problème</LegalH2>
      <LegalBody>
        Si vous rencontrez une difficulté d'accès ou avez des suggestions pour
        améliorer l'accessibilité de SunuChat, nous vous encourageons vivement à
        nous contacter. Votre retour nous aide à progresser.{" "}
        <Link
          href="mailto:contact@sunuchat.sn"
          sx={{
            color: PRIMARY_COLOR, fontWeight: 500,
            textDecoration: "none", "&:hover": { textDecoration: "underline" },
          }}
        >
          contact@sunuchat.sn
        </Link>
      </LegalBody>
    </LegalLayout>
  );
}