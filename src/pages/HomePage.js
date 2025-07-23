// Fichier : HomePage.jsx
import React from "react";
import { Box, Container, Typography, Button, Grid, Stack } from "@mui/material";

// SECTION 1 - HERO
function HeroSection() {
  return (
    <Box
      sx={{ bgcolor: "#E8F5E9", py: { xs: 8, md: 12 }, textAlign: "center" }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          color="primary"
          fontWeight="bold"
        >
          Bienvenue sur SunuChat
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Une plateforme intelligente pour poser vos questions de santé en toute
          simplicité. Accédez aussi à un tableau de bord sur le paludisme.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
          <Button
            variant="contained"
            color="success"
            size="large"
            href="/chatbot"
          >
            Accéder au chatbot
          </Button>
          <Button
            variant="outlined"
            color="success"
            size="large"
            href="/dashboard"
          >
            Voir les statistiques
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

// SECTION 2 - FEATURES
function FeaturesSection() {
  const features = [
    {
      title: "Chat IA multilingue",
      description:
        "Posez vos questions en Wolof, Français ou Anglais et recevez des réponses instantanées.",
    },
    {
      title: "Synthèse vocale",
      description:
        "Le chatbot vous répond aussi par audio pour une accessibilité totale.",
    },
    {
      title: "Tableau de bord santé",
      description:
        "Accédez à des statistiques visuelles sur le paludisme au Sénégal.",
    },
  ];

  return (
    <Box sx={{ py: 10, px: 2 }}>
      <Container>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Fonctionnalités
        </Typography>
        <Grid container spacing={4} mt={2}>
          {features.map((feat, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#f5f5f5",
                  height: "100%",
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {feat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feat.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// SECTION 3 - PARTENAIRES
function PartnersSection() {
  const partners = [
    "Grand Challenges Canada",
    "École Polytechnique de Thiès",
    "Jokalante",
  ];
  return (
    <Box sx={{ bgcolor: "#F0F4F8", py: 6 }}>
      <Container>
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
          Nos Partenaires
        </Typography>
        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          mt={2}
          flexWrap="wrap"
        >
          {partners.map((p, idx) => (
            <Typography
              key={idx}
              variant="body1"
              color="text.primary"
              fontWeight="medium"
            >
              {p}
            </Typography>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

// SECTION 4 - ÉQUIPE
function TeamSection() {
  const members = [
    { name: "Mamadou Bachir Sy", role: "Chef de projet & Développeur" },
    { name: "Équipe Jokalante", role: "Conception et coordination" },
    { name: "Partenaires GCC / EPT", role: "Financement et accompagnement" },
  ];

  return (
    <Box sx={{ py: 10 }}>
      <Container>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Notre Équipe
        </Typography>
        <Grid container spacing={4} justifyContent="center" mt={3}>
          {members.map((member, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Box
                sx={{
                  p: 3,
                  textAlign: "center",
                  border: "1px solid #ccc",
                  borderRadius: 3,
                  bgcolor: "#fff",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.role}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// COMPOSANT PRINCIPAL
export default function HomePage() {
  return (
    <Box>
      {/* Header (à importer si existant) */}
      {/* <Header /> */}

      <HeroSection />
      <FeaturesSection />
      <PartnersSection />
      <TeamSection />

      {/* Footer (à importer si existant) */}
      {/* <Footer /> */}
    </Box>
  );
}
