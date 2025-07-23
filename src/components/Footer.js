// Footer.jsx
import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Stack,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import EmailIcon from "@mui/icons-material/Email";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneIcon from "@mui/icons-material/Phone";
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_MUTED,
  FOOTER_BG,
} from "../constants";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: FOOTER_BG, color: TEXT_PRIMARY, py: 8 }}
    >
      <Container>
        <Grid container spacing={6}>
          {/* Branding */}
          <Grid item xs={12} md={6} lg={3}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  background: `linear-gradient(to right, ${SECONDARY_COLOR}, ${PRIMARY_COLOR})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="#fff" fontWeight="bold" fontSize={18}>
                  S
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold">
                SunuChat
              </Typography>
            </Stack>
            <Typography variant="body2" color={TEXT_SECONDARY} mb={2}>
              Offrir aux communautés sénégalaises un accès simplifié à des
              informations de santé grâce à l'intelligence artificielle.
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <RoomIcon sx={{ fontSize: 16, color: TEXT_MUTED }} />
              <Typography variant="caption" color={TEXT_MUTED}>
                Sénégal
              </Typography>
            </Stack>
          </Grid>

          {/* Platform Links */}
          <Grid item xs={12} sm={6} lg={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Plateforme
            </Typography>
            <Stack spacing={1}>
              {[
                { label: "Chatbot IA", href: "/chatbot" },
                { label: "Tableau de bord santé", href: "/dashboard" },
                { label: "Comment ça marche", href: "#features" },
                { label: "Commencer", href: "/" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  underline="hover"
                  color={TEXT_SECONDARY}
                  sx={{
                    "&:hover": { color: SECONDARY_COLOR },
                    transition: "color 0.3s",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Company Links */}
          <Grid item xs={12} sm={6} lg={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              L'entreprise
            </Typography>
            <Stack spacing={1}>
              {[
                { label: "Notre équipe", href: "/team" },
                { label: "Partenaires", href: "/partenaires" },
                { label: "Politique de confidentialité", href: "#" },
                { label: "Conditions d'utilisation", href: "#" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  underline="hover"
                  color={TEXT_SECONDARY}
                  sx={{
                    "&:hover": { color: SECONDARY_COLOR },
                    transition: "color 0.3s",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} lg={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contact
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon sx={{ fontSize: 16, color: TEXT_MUTED }} />
                <Typography variant="body2" color={TEXT_SECONDARY}>
                  hello@sunuchat.org
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ChatIcon sx={{ fontSize: 16, color: TEXT_MUTED }} />
                <Typography variant="body2" color={TEXT_SECONDARY}>
                  Assistance 24/7
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon sx={{ fontSize: 16, color: TEXT_MUTED }} />
                <Typography variant="body2" color={TEXT_SECONDARY}>
                  +221 XX XXX XXXX
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6, borderColor: "#ddd" }} />

        {/* Supported by */}
        <Box textAlign="center" mb={4}>
          <Typography variant="body2" color={TEXT_MUTED} gutterBottom>
            Soutenu par
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            color={TEXT_SECONDARY}
          >
            {[
              "Grand Challenges Canada",
              "École Polytechnique de Thiès",
              "Jokalante",
            ].map((org, idx) => (
              <Stack key={org} direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" fontWeight="medium">
                  {org}
                </Typography>
                {idx < 2 && (
                  <Typography
                    variant="body2"
                    sx={{
                      display: { xs: "none", sm: "inline" },
                      color: TEXT_MUTED,
                    }}
                  >
                    •
                  </Typography>
                )}
              </Stack>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "#ddd" }} />

        {/* Footer bottom */}
        <Box
          mt={4}
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography variant="caption" color={PRIMARY_COLOR}>
            © 2025 SunuChat. Tous droits réservés.
          </Typography>
          <Stack direction="row" spacing={3}>
            {["Confidentialité", "Conditions", "Accessibilité"].map((item) => (
              <Link
                key={item}
                href="#"
                underline="hover"
                color={TEXT_SECONDARY}
                sx={{ "&:hover": { color: SECONDARY_COLOR } }}
              >
                {item}
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
