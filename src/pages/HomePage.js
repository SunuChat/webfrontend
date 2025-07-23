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
  Avatar,
  useTheme,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import HearingIcon from "@mui/icons-material/Hearing";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupIcon from "@mui/icons-material/Group";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { PRIMARY_COLOR, SECONDARY_COLOR, bgImage } from "../constants";

function HeroSection() {
  return (
    <Box
      sx={{
        py: { xs: 12, md: 16 },
        color: "white",
        background: `linear-gradient(to bottom right, rgba(0,0,0,0.6), ${PRIMARY_COLOR}99), url(${bgImage}) center/cover no-repeat`,
        textAlign: "center",
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          Bienvenue sur <span style={{ color: SECONDARY_COLOR }}>SunuChat</span>
        </Typography>
        <Typography variant="h6" color="#e0f2f1">
          Votre assistant santé intelligent, multilingue, vocal et accessible à
          tous
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          mt={5}
        >
          <Button
            variant="contained"
            size="large"
            href="/chatbot"
            sx={{
              borderRadius: 6,
              px: 4,
              bgcolor: PRIMARY_COLOR,
              "&:hover": { bgcolor: SECONDARY_COLOR },
            }}
            endIcon={<ArrowForwardIcon />}
          >
            Accéder au chatbot
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="/dashboard"
            sx={{
              borderRadius: 6,
              px: 4,
              color: "white",
              borderColor: "white",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          >
            Voir les statistiques
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Chat IA multilingue",
      description:
        "Posez vos questions en Wolof ou Français  et recevez des réponses instantanées.",
      icon: <ChatIcon fontSize="large" sx={{ color: PRIMARY_COLOR }} />,
    },
    {
      title: "Synthèse vocale",
      description:
        "Le chatbot vous répond aussi par audio pour une accessibilité totale.",
      icon: <HearingIcon fontSize="large" sx={{ color: PRIMARY_COLOR }} />,
    },
    {
      title: "Tableau de bord santé",
      description:
        "Accédez à des statistiques visuelles sur le paludisme et la dengue au Sénégal.",
      icon: <BarChartIcon fontSize="large" sx={{ color: PRIMARY_COLOR }} />,
    },
  ];

  return (
    <Box sx={{ py: 12, bgcolor: "#f9fbe7" }}>
      <Container>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Fonctionnalités
        </Typography>
        <Grid container spacing={4} mt={2}>
          {features.map((feat, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card elevation={4} sx={{ borderRadius: 4, height: "100%" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Box mb={2}>{feat.icon}</Box>
                  <Typography variant="h6" fontWeight="bold">
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

function PartnersSection() {
  return (
    <Box sx={{ bgcolor: "#e8f5e9", py: 8 }}>
      <Container>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          Nos Partenaires
        </Typography>
        <Typography
          align="center"
          color="text.secondary"
          maxWidth="sm"
          mx="auto"
        >
          Retrouvez la liste complète sur la page dédiée.
        </Typography>
        <Box textAlign="center" mt={3}>
          <Button
            variant="outlined"
            href="/partners"
            sx={{
              borderRadius: 4,
              color: PRIMARY_COLOR,
              borderColor: PRIMARY_COLOR,
              "&:hover": { bgcolor: PRIMARY_COLOR, color: "white" },
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
    <Box sx={{ py: 10, bgcolor: "#fff" }}>
      <Container>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Notre Équipe
        </Typography>
        <Typography
          align="center"
          color="text.secondary"
          maxWidth="sm"
          mx="auto"
        >
          Découvrez toute l’équipe derrière SunuChat sur la page dédiée.
        </Typography>
        <Box textAlign="center" mt={3}>
          <Button
            variant="outlined"
            href="/team"
            sx={{
              borderRadius: 4,
              color: PRIMARY_COLOR,
              borderColor: PRIMARY_COLOR,
              "&:hover": { bgcolor: PRIMARY_COLOR, color: "white" },
            }}
          >
            Voir l’équipe
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default function HomePage() {
  return (
    <Box>
      <HeroSection />
      <FeaturesSection />
      <PartnersSection />
      <TeamSection />
    </Box>
  );
}
