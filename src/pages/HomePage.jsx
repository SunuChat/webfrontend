import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import HearingIcon from "@mui/icons-material/Hearing";
import BarChartIcon from "@mui/icons-material/BarChart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import { PRIMARY_COLOR, SECONDARY_COLOR, bgImage } from "../constants";
import gccImg from "../assets/images/partners/gcc.jpg";
import eptImg from "../assets/images/partners/ept.jpg";
import jokalanteImg from "../assets/images/partners/jokalante.png";

/**
 * Refonte visuelle "wow" sans changer les couleurs principales/secondaires.
 * - Hero avec overlay dégradé, orbes floutées, micro-animations légères
 * - Cartes fonctionnalités en glassmorphism + effets hover
 * - Sections partenaires/équipe équilibrées, CTA visibles
 * - Typographies et espacements raffinés
 */

const partenersLogo = [gccImg, eptImg, jokalanteImg];
export default function HomePage() {
  return (
    <Box sx={{ bgcolor: "#f7fafc" }}>
      <HeroSection />
      <FeaturesSection />
      <PartnersSection />
      <TeamSection />
      <FooterCta />
    </Box>
  );
}

function HeroSection() {
  return (
    <Box
      id="hero_section"
      sx={{
        position: "relative",
        overflow: "hidden",
        color: "white",
        py: { xs: 10, md: 16 },
        px: 2,
        background: `linear-gradient(135deg, rgba(0,0,0,0.55) 0%, ${PRIMARY_COLOR}99 100%), url(${bgImage}) center/cover no-repeat`,
      }}
    >
      {/* Orbes décoratives */}
      <Blob
        color={PRIMARY_COLOR}
        size={360}
        top={-80}
        left={-80}
        opacity={0.25}
      />
      <Blob
        color={SECONDARY_COLOR}
        size={280}
        top={-40}
        right={-60}
        opacity={0.2}
        delay={0.6}
      />
      <Blob
        color={"#ffffff"}
        size={200}
        bottom={-60}
        left={"20%"}
        opacity={0.12}
        delay={1.2}
      />

      <Container maxWidth="lg">
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Typography
            variant="overline"
            sx={{ letterSpacing: 2, opacity: 0.9 }}
          >
            Santé · IA · Accessibilité
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              textShadow: "0 8px 30px rgba(0,0,0,0.35)",
            }}
          >
            Bienvenue sur{" "}
            <Box component="span" sx={{ color: SECONDARY_COLOR }}>
              SunuChat
            </Box>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              maxWidth: 880,
              color: "#e6fffb",
              opacity: 0.95,
            }}
          >
            Votre assistant santé intelligent, multilingue, vocal et accessible
            à tous.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ pt: 2 }}
          >
            <Button
              variant="contained"
              size="large"
              href="/chatbot"
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderRadius: 3,
                px: 3.5,
                py: 1.5,
                bgcolor: PRIMARY_COLOR,
                boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                "&:hover": {
                  bgcolor: SECONDARY_COLOR,
                  transform: "translateY(-2px)",
                },
                transition: "all .25s ease",
              }}
            >
              Accéder au chatbot
            </Button>
            <Button
              variant="outlined"
              size="large"
              href="/dashboard"
              startIcon={<BarChartIcon />}
              sx={{
                borderRadius: 3,
                px: 3.5,
                py: 1.5,
                color: "white",
                borderColor: "rgba(255,255,255,0.7)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "white",
                },
                backdropFilter: "blur(4px)",
              }}
            >
              Voir les statistiques
            </Button>
          </Stack>

          {/* Badges de confiance */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ pt: 4 }}
          >
            <Chip
              icon={<PlayArrowRoundedIcon />}
              label="Réponses instantanées texte & audio"
              sx={chipStyle}
            />
            <Chip icon={<ChatIcon />} label="FR · WOLOF" sx={chipStyle} />
            <Chip
              icon={<StarRateRoundedIcon />}
              label="Design accessible et inclusif"
              sx={chipStyle}
            />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

const chipStyle = {
  bgcolor: "rgba(255,255,255,0.14)",
  color: "#fff",
  borderColor: "rgba(255,255,255,0.25)",
  borderWidth: 1,
  borderStyle: "solid",
  backdropFilter: "blur(6px)",
  ":hover": { bgcolor: "rgba(255,255,255,0.22)" },
};

function Blob({
  color,
  size = 320,
  top,
  left,
  right,
  bottom,
  opacity = 0.2,
  delay = 0,
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        filter: "blur(40px)",
        opacity,
        background: `radial-gradient(closest-side, ${color}, transparent 70%)`,
        top,
        left,
        right,
        bottom,
        animation: "float 8s ease-in-out infinite",
        animationDelay: `${delay}s`,
        "@keyframes float": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
          "100%": { transform: "translateY(0px)" },
        },
      }}
    />
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Chat IA multilingue",
      description:
        "Posez vos questions en Wolof ou Français et recevez des réponses instantanées.",
      icon: <ChatIcon sx={{ color: PRIMARY_COLOR }} />,
    },
    {
      title: "Synthèse vocale",
      description:
        "Le chatbot vous répond aussi par audio pour une accessibilité totale.",
      icon: <HearingIcon sx={{ color: PRIMARY_COLOR }} />,
    },
    {
      title: "Tableau de bord santé",
      description:
        "Accédez à des statistiques visuelles sur le paludisme et la dengue au Sénégal.",
      icon: <BarChartIcon sx={{ color: PRIMARY_COLOR }} />,
    },
  ];

  return (
    <Box id="features" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#f9fbe7" }}>
      <Container maxWidth="lg">
        <Stack
          spacing={1.5}
          alignItems="center"
          textAlign="center"
          sx={{ mb: 5 }}
        >
          <Typography
            variant="overline"
            sx={{ color: PRIMARY_COLOR, letterSpacing: 2 }}
          >
            Fonctionnalités
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            Tout pour une expérience fluide
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
            Une IA pensée pour le contexte local et l’accessibilité.
          </Typography>
        </Stack>

        <Grid container spacing={3.5}>
          {features.map((feat, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  p: 0.5,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,1), rgba(255,255,255,0.7))",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(0,0,0,0.04)",
                  transition: "transform .25s ease, box-shadow .25s ease",
                  ":hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", p: { xs: 3, md: 4 } }}>
                  <Box sx={{ display: "inline-flex", mb: 2.5 }}>
                    <IconBadge>{feat.icon}</IconBadge>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {feat.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feat.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function IconBadge({ children }) {
  return (
    <Box
      sx={{
        width: 64,
        height: 64,
        borderRadius: 3,
        display: "grid",
        placeItems: "center",
        background: `linear-gradient(135deg, ${PRIMARY_COLOR}22, ${SECONDARY_COLOR}22)`,
        border: `1px solid ${PRIMARY_COLOR}33`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
      }}
    >
      <Box sx={{ fontSize: 34 }}>{children}</Box>
    </Box>
  );
}

function PartnersSection() {
  return (
    <Box sx={{ bgcolor: "#e8f5e9", py: { xs: 8, md: 10 } }}>
      <Container maxWidth="lg">
        <Stack
          spacing={1.5}
          alignItems="center"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          <Typography
            variant="overline"
            sx={{ color: PRIMARY_COLOR, letterSpacing: 2 }}
          >
            Partenaires
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Nos Partenaires
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
            Retrouvez la liste complète sur la page dédiée.
          </Typography>
        </Stack>

        <Grid container spacing={2} sx={{ opacity: 0.9, mb: 3 }}></Grid>

        <Box textAlign="center">
          <Button
            variant="outlined"
            href="/partners"
            sx={{
              borderRadius: 3,
              px: 3.5,
              color: PRIMARY_COLOR,
              borderColor: PRIMARY_COLOR,
              ":hover": { bgcolor: PRIMARY_COLOR, color: "white" },
            }}
          >
            Voir les partenaires
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

function TeamSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#fff" }}>
      <Container maxWidth="lg">
        <Stack
          spacing={1.5}
          alignItems="center"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          <Typography
            variant="overline"
            sx={{ color: PRIMARY_COLOR, letterSpacing: 2 }}
          >
            Équipe
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Notre Équipe
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
            Découvrez toute l’équipe derrière SunuChat sur la page dédiée.
          </Typography>
        </Stack>

        <Box textAlign="center" mt={2}>
          <Button
            variant="outlined"
            href="/team"
            sx={{
              borderRadius: 3,
              px: 3.5,
              color: PRIMARY_COLOR,
              borderColor: PRIMARY_COLOR,
              ":hover": { bgcolor: PRIMARY_COLOR, color: "white" },
            }}
          >
            Voir l’équipe
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

function FooterCta() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                Prêt à essayer SunuChat ?
              </Typography>
              <Typography sx={{ opacity: 0.9 }}>
                Lancez une conversation maintenant et découvrez l’expérience.
              </Typography>
            </Box>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                variant="contained"
                href="/chatbot"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderRadius: 3,
                  px: 3.5,
                  bgcolor: "#fff",
                  color: PRIMARY_COLOR,
                  ":hover": { bgcolor: "#f5f5f5" },
                }}
              >
                Démarrer le chat
              </Button>
              <Button
                variant="outlined"
                href="/dashboard"
                sx={{
                  borderRadius: 3,
                  px: 3.5,
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.6)",
                  ":hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Voir le tableau de bord
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
