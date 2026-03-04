// HomePage.jsx — SunuChat · Direction "Editorial Clean"
// Principes : respirer, lisible, humain. Zéro effet superflu.
import React from "react";
import {
  Box, Container, Typography, Button, Grid,
  Stack, Card, CardContent, Chip,
} from "@mui/material";
import ChatBubbleOutlineRoundedIcon  from "@mui/icons-material/ChatBubbleOutlineRounded";
import HearingRoundedIcon            from "@mui/icons-material/HearingRounded";
import BarChartRoundedIcon           from "@mui/icons-material/BarChartRounded";
import ArrowForwardRoundedIcon       from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon              from "@mui/icons-material/CheckRounded";
import TranslateRoundedIcon          from "@mui/icons-material/TranslateRounded";
import ShieldOutlinedIcon            from "@mui/icons-material/ShieldOutlined";
import BoltRoundedIcon               from "@mui/icons-material/BoltRounded";
import GroupsOutlinedIcon            from "@mui/icons-material/GroupsOutlined";
import FavoriteBorderRoundedIcon     from "@mui/icons-material/FavoriteBorderRounded";
import {
  PRIMARY_COLOR, SECONDARY_COLOR, ACCENT_HOVER,
  BG_PAGE, BG_WHITE, BG_SECTION_ALT,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, SHADOW_CARD, SHADOW_CARD_HOVER,
  FONT_SANS, FONT_SERIF,
} from "../constants";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Label({ children }) {
  return (
    <Typography
      sx={{
        display: "inline-block",
        fontFamily: FONT_SANS,
        fontWeight: 600,
        fontSize: "0.72rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: PRIMARY_COLOR,
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}

function H2({ children, light = false }) {
  return (
    <Typography
      variant="h2"
      sx={{
        fontFamily: FONT_SERIF,
        fontWeight: 600,
        fontSize: { xs: "1.75rem", md: "2.25rem" },
        letterSpacing: "-0.02em",
        color: light ? "#fff" : TEXT_PRIMARY,
        lineHeight: 1.25,
      }}
    >
      {children}
    </Typography>
  );
}

function Body({ children, light = false, sx = {} }) {
  return (
    <Typography
      sx={{
        fontFamily: FONT_SANS,
        fontSize: "0.9375rem",
        color: light ? "rgba(255,255,255,0.72)" : TEXT_SECONDARY,
        lineHeight: 1.75,
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

function IconBox({ children }) {
  return (
    <Box
      sx={{
        width: 44, height: 44, borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        bgcolor: `${PRIMARY_COLOR}10`,
        color: PRIMARY_COLOR,
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <Box
      id="hero_section"
      sx={{
        bgcolor: BG_WHITE,
        borderBottom: `1px solid ${BORDER_COLOR}`,
        pt: { xs: 7, md: 10 },
        pb: { xs: 7, md: 9 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">

          {/* ── Text side ── */}
          <Grid item xs={12} md={6}>
            <Stack spacing={0.5} mb={2}>
              <Typography
                sx={{
                  fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.72rem",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: SECONDARY_COLOR,
                }}
              >
                Santé · IA · Sénégal
              </Typography>
            </Stack>

            <Typography
              variant="h1"
              sx={{
                fontFamily: FONT_SERIF,
                fontWeight: 600,
                fontSize: { xs: "2.2rem", sm: "2.75rem", md: "3.1rem" },
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                color: TEXT_PRIMARY,
                mb: 2.5,
                "& em": {
                  fontStyle: "italic",
                  color: PRIMARY_COLOR,
                },
              }}
            >
              Des réponses claires sur le paludisme,{" "}
              <em>en wolof et en français.</em>
            </Typography>

            <Body sx={{ maxWidth: 480, mb: 4 }}>
              SunuChat est un assistant santé gratuit, accessible sur mobile,
              qui répond à vos questions par texte et par audio — dans votre langue.
            </Body>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} mb={4}>
              <Button
                href="/chatbot"
                variant="contained"
                disableElevation
                startIcon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 17 }} />}
                sx={{
                  fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.9rem",
                  textTransform: "none", borderRadius: "8px", px: 2.5, py: 1.1,
                  bgcolor: PRIMARY_COLOR,
                  "&:hover": { bgcolor: ACCENT_HOVER },
                  transition: "background .18s",
                }}
              >
                Démarrer le chatbot
              </Button>
              <Button
                href="/dashboard"
                variant="outlined"
                disableElevation
                startIcon={<BarChartRoundedIcon sx={{ fontSize: 17 }} />}
                sx={{
                  fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.9rem",
                  textTransform: "none", borderRadius: "8px", px: 2.5, py: 1.1,
                  borderColor: BORDER_COLOR, color: TEXT_SECONDARY,
                  "&:hover": { borderColor: TEXT_SECONDARY, bgcolor: "transparent", color: TEXT_PRIMARY },
                }}
              >
                Voir le tableau de bord
              </Button>
            </Stack>

            {/* Trust line */}
            <Stack direction="row" spacing={2.5} flexWrap="wrap" gap={1}>
              {[
                { icon: <TranslateRoundedIcon sx={{ fontSize: 14 }} />, label: "Wolof & Français" },
                { icon: <HearingRoundedIcon   sx={{ fontSize: 14 }} />, label: "Vocal & Texte" },
                { icon: <ShieldOutlinedIcon   sx={{ fontSize: 14 }} />, label: "Gratuit & privé" },
              ].map((b) => (
                <Stack key={b.label} direction="row" spacing={0.75} alignItems="center">
                  <Box sx={{ color: TEXT_MUTED }}>{b.icon}</Box>
                  <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.8rem", color: TEXT_MUTED }}>
                    {b.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          {/* ── Visual side — chat preview ── */}
          <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
            <Box
              sx={{
                maxWidth: 380,
                ml: "auto",
                borderRadius: "16px",
                border: `1px solid ${BORDER_COLOR}`,
                bgcolor: BG_WHITE,
                boxShadow: "0 4px 32px rgba(0,152,192,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                overflow: "hidden",
              }}
            >
              {/* Chat header */}
              <Box
                sx={{
                  px: 2.5, py: 1.75,
                  borderBottom: `1px solid ${BORDER_COLOR}`,
                  bgcolor: BG_PAGE,
                  display: "flex", alignItems: "center", gap: 1.25,
                }}
              >
                <Box
                  sx={{
                    width: 34, height: 34, borderRadius: "9px",
                    bgcolor: PRIMARY_COLOR,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ChatBubbleOutlineRoundedIcon sx={{ color: "#fff", fontSize: 16 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.875rem", color: TEXT_PRIMARY }}>
                    SunuChat
                  </Typography>
                  <Stack direction="row" spacing={0.6} alignItems="center">
                    <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#43a047" }} />
                    <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.72rem", color: TEXT_MUTED }}>
                      En ligne
                    </Typography>
                  </Stack>
                </Box>
              </Box>

              {/* Messages */}
              <Stack spacing={2} sx={{ p: 2.5 }}>
                {/* User */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Box
                    sx={{
                      maxWidth: "82%", bgcolor: PRIMARY_COLOR,
                      borderRadius: "12px 12px 3px 12px",
                      px: 1.75, py: 1,
                    }}
                  >
                    <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.84rem", color: "#fff", lineHeight: 1.55 }}>
                      Quels sont les symptômes du paludisme ?
                    </Typography>
                  </Box>
                </Box>

                {/* Bot */}
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                  <Box
                    sx={{
                      width: 26, height: 26, borderRadius: "7px", flexShrink: 0,
                      bgcolor: `${SECONDARY_COLOR}22`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: "0.72rem", color: SECONDARY_COLOR }}>S</Typography>
                  </Box>
                  <Box
                    sx={{
                      maxWidth: "82%", bgcolor: BG_PAGE,
                      border: `1px solid ${BORDER_COLOR}`,
                      borderRadius: "12px 12px 12px 3px",
                      px: 1.75, py: 1,
                    }}
                  >
                    <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.84rem", color: TEXT_SECONDARY, lineHeight: 1.55 }}>
                      Les symptômes courants sont : fièvre élevée, frissons, maux de tête, nausées et fatigue intense.
                    </Typography>
                  </Box>
                </Box>

                {/* Audio indicator */}
                <Box
                  sx={{
                    display: "flex", alignItems: "center", gap: 1.25,
                    px: 1.75, py: 1.25,
                    border: `1px solid ${BORDER_COLOR}`,
                    borderRadius: "10px",
                    bgcolor: BG_PAGE,
                  }}
                >
                  <HearingRoundedIcon sx={{ color: PRIMARY_COLOR, fontSize: 17 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.75rem", color: TEXT_MUTED }}>
                      Réponse audio disponible
                    </Typography>
                    {/* Waveform décorative statique */}
                    <Stack direction="row" spacing="2px" mt="4px" alignItems="center">
                      {[3, 7, 11, 5, 9, 13, 7, 4, 10, 6, 12, 8, 5].map((h, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 2, height: h,
                            borderRadius: "2px",
                            bgcolor: PRIMARY_COLOR,
                            opacity: 0.5,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Box>

                {/* Typing */}
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                  <Box sx={{ width: 26, height: 26, borderRadius: "7px", bgcolor: `${SECONDARY_COLOR}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: "0.72rem", color: SECONDARY_COLOR }}>S</Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 1.75, py: 1,
                      border: `1px solid ${BORDER_COLOR}`,
                      borderRadius: "12px 12px 12px 3px",
                      bgcolor: BG_PAGE,
                      display: "flex", gap: "4px", alignItems: "center",
                    }}
                  >
                    {[0, 0.18, 0.36].map((d, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 5, height: 5, borderRadius: "50%",
                          bgcolor: TEXT_MUTED,
                          animation: "dot 1.3s ease-in-out infinite",
                          animationDelay: `${d}s`,
                          "@keyframes dot": {
                            "0%, 80%, 100%": { opacity: 0.3, transform: "scale(1)" },
                            "40%": { opacity: 1, transform: "scale(1.15)" },
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: "2",    label: "Langues supportées", sub: "Wolof & Français" },
    { value: "24/7", label: "Disponibilité",       sub: "Toujours accessible" },
    { value: "< 3s", label: "Temps de réponse",    sub: "Texte et audio" },
    { value: "100%", label: "Gratuit",              sub: "Sans inscription" },
  ];
  return (
    <Box sx={{ bgcolor: BG_WHITE, borderBottom: `1px solid ${BORDER_COLOR}` }}>
      <Container maxWidth="lg">
        <Grid container>
          {stats.map((s, i) => (
            <Grid
              item xs={6} md={3} key={s.label}
              sx={{
                py: { xs: 2.5, md: 3 },
                px: { xs: 2, md: 3 },
                borderRight: i < stats.length - 1 ? `1px solid ${BORDER_COLOR}` : "none",
                borderBottom: { xs: i < 2 ? `1px solid ${BORDER_COLOR}` : "none", md: "none" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_SERIF,
                  fontWeight: 600,
                  fontSize: { xs: "1.5rem", md: "1.75rem" },
                  color: PRIMARY_COLOR,
                  lineHeight: 1,
                  mb: 0.5,
                }}
              >
                {s.value}
              </Typography>
              <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.8rem", color: TEXT_PRIMARY, mb: 0.25 }}>
                {s.label}
              </Typography>
              <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.75rem", color: TEXT_MUTED }}>
                {s.sub}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 20 }} />,
      title: "Chat IA multilingue",
      description: "Posez vos questions en Wolof ou en Français. L'IA détecte automatiquement votre langue et répond de façon adaptée.",
      perks: ["Détection automatique de langue", "Réponses contextuelles précises", "Historique des conversations"],
    },
    {
      icon: <HearingRoundedIcon sx={{ fontSize: 20 }} />,
      title: "Réponses vocales",
      description: "Parlez au lieu de taper, et écoutez les réponses. Idéal si vous avez du mal à lire ou préférez l'oral.",
      perks: ["Transcription vocale en Wolof", "Synthèse audio naturelle", "Accessibilité maximale"],
    },
    {
      icon: <BarChartRoundedIcon sx={{ fontSize: 20 }} />,
      title: "Tableau de bord santé",
      description: "Suivez l'évolution du paludisme et de la dengue au Sénégal avec des visualisations claires et actualisées.",
      perks: ["Données par région", "Graphiques interactifs", "Tendances et prévisions"],
    },
  ];

  return (
    <Box id="features" sx={{ py: { xs: 8, md: 11 }, bgcolor: BG_PAGE }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">

          {/* Intro col */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: { md: "sticky" }, top: { md: 96 } }}>
              <Label>Fonctionnalités</Label>
              <H2>Tout pour une expérience fluide</H2>
              <Body sx={{ mt: 2, mb: 3 }}>
                Une IA pensée pour le contexte local, la diversité linguistique
                et l'inclusion numérique au Sénégal.
              </Body>
              <Button
                href="/chatbot"
                variant="outlined"
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />}
                disableElevation
                sx={{
                  fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.84rem",
                  textTransform: "none", borderRadius: "8px", px: 2, py: "7px",
                  borderColor: BORDER_COLOR, color: TEXT_SECONDARY,
                  "&:hover": { borderColor: TEXT_SECONDARY, bgcolor: "transparent", color: TEXT_PRIMARY },
                }}
              >
                Essayer maintenant
              </Button>
            </Box>
          </Grid>

          {/* Feature cards */}
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              {features.map((feat) => (
                <Card
                  key={feat.title}
                  elevation={0}
                  sx={{
                    borderRadius: "12px",
                    border: `1px solid ${BORDER_COLOR}`,
                    bgcolor: BG_WHITE,
                    boxShadow: SHADOW_CARD,
                    transition: "box-shadow .2s, transform .2s",
                    "&:hover": { boxShadow: SHADOW_CARD_HOVER, transform: "translateY(-2px)" },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <IconBox>{feat.icon}</IconBox>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.95rem",
                            color: TEXT_PRIMARY, mb: 0.75,
                          }}
                        >
                          {feat.title}
                        </Typography>
                        <Body sx={{ mb: 2, fontSize: "0.875rem" }}>{feat.description}</Body>
                        <Stack spacing={0.75}>
                          {feat.perks.map((perk) => (
                            <Stack key={perk} direction="row" spacing={1} alignItems="center">
                              <CheckRoundedIcon sx={{ fontSize: 14, color: SECONDARY_COLOR, flexShrink: 0 }} />
                              <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.82rem", color: TEXT_SECONDARY }}>
                                {perk}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      num: "1",
      icon: <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 20 }} />,
      title: "Posez votre question",
      body: "Tapez ou parlez en Wolof ou en Français. Demandez ce que vous voulez sur le paludisme, ses symptômes, son traitement.",
    },
    {
      num: "2",
      icon: <BoltRoundedIcon sx={{ fontSize: 20 }} />,
      title: "L'IA comprend et répond",
      body: "Notre modèle détecte la langue, analyse votre demande et génère une réponse claire et précise en quelques secondes.",
    },
    {
      num: "3",
      icon: <HearingRoundedIcon sx={{ fontSize: 20 }} />,
      title: "Lisez ou écoutez",
      body: "Recevez la réponse par texte, ou écoutez-la directement en audio — pour une expérience accessible à tous.",
    },
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 11 }, bgcolor: BG_SECTION_ALT }}>
      <Container maxWidth="lg">
        <Stack alignItems="center" textAlign="center" mb={6}>
          <Label>Comment ça marche</Label>
          <H2>Simple. Rapide. Accessible.</H2>
        </Stack>

        <Grid container spacing={3}>
          {steps.map((step, i) => (
            <Grid item xs={12} md={4} key={step.num}>
              <Box
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: "12px",
                  bgcolor: BG_WHITE,
                  border: `1px solid ${BORDER_COLOR}`,
                  height: "100%",
                  position: "relative",
                }}
              >
                {/* Numéro en filigrane */}
                <Typography
                  sx={{
                    position: "absolute",
                    top: 14, right: 18,
                    fontFamily: FONT_SERIF,
                    fontWeight: 600,
                    fontSize: "2.5rem",
                    color: `${PRIMARY_COLOR}10`,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {step.num}
                </Typography>

                <IconBox sx={{ mb: 2 }}>{step.icon}</IconBox>
                <Box sx={{ height: 12 }} />
                <Typography
                  sx={{
                    fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.92rem",
                    color: TEXT_PRIMARY, mb: 1,
                  }}
                >
                  {step.title}
                </Typography>
                <Body sx={{ fontSize: "0.875rem" }}>{step.body}</Body>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// ─── Partners ─────────────────────────────────────────────────────────────────
function PartnersSection() {
  return (
    <Box sx={{ py: { xs: 7, md: 9 }, bgcolor: BG_WHITE, borderTop: `1px solid ${BORDER_COLOR}` }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Grid item xs={12} md={5}>
            <Label>Partenaires</Label>
            <H2>Ils nous font confiance</H2>
            <Body sx={{ mt: 2 }}>
              SunuChat est soutenu par des organisations engagées pour la
              santé publique et l'innovation numérique en Afrique.
            </Body>
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack spacing={2}>
              {/* Partenaire */}
              <Box
                sx={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  px: 2.5, py: 2,
                  border: `1px solid ${BORDER_COLOR}`,
                  borderRadius: "10px",
                  bgcolor: BG_PAGE,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <FavoriteBorderRoundedIcon sx={{ color: PRIMARY_COLOR, fontSize: 18 }} />
                  <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.9rem", color: TEXT_PRIMARY }}>
                    Grand Challenges Canada
                  </Typography>
                </Stack>
                <Chip
                  label="Financeur"
                  size="small"
                  sx={{
                    fontFamily: FONT_SANS, fontSize: "0.72rem", fontWeight: 500,
                    bgcolor: `${SECONDARY_COLOR}18`, color: "#5a7019",
                    border: `1px solid ${SECONDARY_COLOR}44`, height: 22,
                  }}
                />
              </Box>

              <Button
                href="/partners"
                variant="text"
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />}
                sx={{
                  fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.84rem",
                  textTransform: "none", color: PRIMARY_COLOR, px: 0,
                  alignSelf: "flex-start",
                  "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                }}
              >
                Voir tous les partenaires
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────
function TeamSection() {
  const values = [
    { emoji: "🎓", title: "EPT — Thiès",   body: "Portée par l'excellence académique de l'École Polytechnique de Thiès." },
    { emoji: "🌍", title: "Impact local",   body: "Des outils numériques adaptés aux réalités et aux langues africaines." },
    { emoji: "🤝", title: "Open & inclusif", body: "Un projet ouvert, conçu pour tous, même sans connexion haut débit." },
  ];

  return (
    <Box sx={{ py: { xs: 7, md: 9 }, bgcolor: BG_PAGE, borderTop: `1px solid ${BORDER_COLOR}` }}>
      <Container maxWidth="lg">
        <Stack alignItems="center" textAlign="center" mb={5}>
          <Label>L'équipe</Label>
          <H2>Derrière SunuChat</H2>
          <Body sx={{ maxWidth: 500, mt: 1.5 }}>
            Des étudiants-chercheurs de l'EPT passionnés par la tech au service de la santé.
          </Body>
        </Stack>

        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {values.map((v) => (
            <Grid item xs={12} sm={4} key={v.title}>
              <Box
                sx={{
                  p: 3, borderRadius: "12px",
                  border: `1px solid ${BORDER_COLOR}`,
                  bgcolor: BG_WHITE,
                  height: "100%",
                }}
              >
                <Typography sx={{ fontSize: "1.5rem", mb: 1.5 }}>{v.emoji}</Typography>
                <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.9rem", color: TEXT_PRIMARY, mb: 0.75 }}>
                  {v.title}
                </Typography>
                <Body sx={{ fontSize: "0.875rem" }}>{v.body}</Body>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center">
          <Button
            href="/team"
            variant="outlined"
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />}
            disableElevation
            sx={{
              fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.84rem",
              textTransform: "none", borderRadius: "8px", px: 2.5, py: "7px",
              borderColor: BORDER_COLOR, color: TEXT_SECONDARY,
              "&:hover": { borderColor: TEXT_SECONDARY, bgcolor: "transparent", color: TEXT_PRIMARY },
            }}
          >
            Rencontrer l'équipe
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// ─── Footer CTA ───────────────────────────────────────────────────────────────
function FooterCtaSection() {
  return (
    <Box
      sx={{
        bgcolor: PRIMARY_COLOR,
        py: { xs: 7, md: 9 },
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography
          sx={{
            fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.72rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)", mb: 2,
          }}
        >
          Prêt à commencer ?
        </Typography>

        <H2 light>
          Posez votre première question. C'est gratuit.
        </H2>

        <Body light sx={{ mt: 2, mb: 4, maxWidth: 420, mx: "auto" }}>
          En Wolof ou en Français, par texte ou à voix haute.
          SunuChat est là pour vous, à tout moment.
        </Body>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center">
          <Button
            href="/chatbot"
            variant="contained"
            disableElevation
            startIcon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 17 }} />}
            sx={{
              fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.9rem",
              textTransform: "none", borderRadius: "8px", px: 2.5, py: 1.1,
              bgcolor: "#fff", color: PRIMARY_COLOR,
              "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
              transition: "background .18s",
            }}
          >
            Démarrer le chatbot
          </Button>
          <Button
            href="/signup"
            variant="outlined"
            disableElevation
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />}
            sx={{
              fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.9rem",
              textTransform: "none", borderRadius: "8px", px: 2.5, py: 1.1,
              borderColor: "rgba(255,255,255,0.4)", color: "#fff",
              "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            Créer un compte
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <Box sx={{ bgcolor: BG_PAGE }}>
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorksSection />
      <PartnersSection />
      <TeamSection />
      <FooterCtaSection />
    </Box>
  );
}