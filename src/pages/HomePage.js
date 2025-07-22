import Header from "../components/Header";
import Footer from "../components/Footer";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";

export default function HomePage() {
  return (
    <Box>
      <Header />

      <Box
        sx={{
          backgroundColor: "#E8F5E9",
          py: { xs: 8, md: 12 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            Bienvenue sur SunuChat
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Une plateforme intelligente pour poser vos questions de santé en
            toute simplicité. Accédez aussi à un tableau de bord sur le
            paludisme.
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="primary"
            startIcon={<ChatIcon />}
            href="/chatbot"
          >
            Démarrer une conversation
          </Button>
        </Container>
      </Box>

      {/* Fonctionnalités */}
      <Box py={10} bgcolor="#fff">
        <Container>
          <Typography variant="h4" textAlign="center" mb={6}>
            Fonctionnalités principales
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <ChatIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">Assistant IA Santé</Typography>
                <Typography variant="body2" color="text.secondary">
                  Posez vos questions et recevez des réponses fiables et
                  rapides.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <DashboardIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">Dashboard Paludisme</Typography>
                <Typography variant="body2" color="text.secondary">
                  Accédez à des données utiles sur la prévention et l'évolution
                  du paludisme.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <PeopleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">Partenaires</Typography>
                <Typography variant="body2" color="text.secondary">
                  EPT, Jokalante et Grand Challenge Canada soutiennent le
                  projet.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
