// Fichier : Footer.jsx
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

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#000", color: "#fff", py: 8 }}>
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
                  background: "linear-gradient(to right, #4ade80, #16a34a)",
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
            <Typography variant="body2" color="rgba(255,255,255,0.7)" mb={2}>
              Empowering African communities with accessible AI-powered
              healthcare information and support.
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <RoomIcon sx={{ fontSize: 16, opacity: 0.6 }} />
              <Typography variant="caption" color="rgba(255,255,255,0.6)">
                Sub-Saharan Africa
              </Typography>
            </Stack>
          </Grid>

          {/* Platform Links */}
          <Grid item xs={12} sm={6} lg={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Platform
            </Typography>
            <Stack spacing={1}>
              {[
                { label: "AI Chatbot", href: "#chatbot" },
                { label: "Health Dashboard", href: "#dashboard" },
                { label: "How it Works", href: "#features" },
                { label: "Get Started", href: "#home" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  underline="hover"
                  color="rgba(255,255,255,0.7)"
                  sx={{
                    "&:hover": { color: "#fff" },
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
              Company
            </Typography>
            <Stack spacing={1}>
              {[
                { label: "About Us", href: "#team" },
                { label: "Partners", href: "#partners" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  underline="hover"
                  color="rgba(255,255,255,0.7)"
                  sx={{
                    "&:hover": { color: "#fff" },
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
                <EmailIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  hello@sunuchat.org
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ChatIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  24/7 Support
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  +221 XX XXX XXXX
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* Separator */}
        <Divider sx={{ my: 6, borderColor: "rgba(255,255,255,0.2)" }} />

        {/* Supported by */}
        <Box textAlign="center" mb={4}>
          <Typography
            variant="body2"
            color="rgba(255,255,255,0.6)"
            gutterBottom
          >
            Supported by
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            color="rgba(255,255,255,0.7)"
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
                    sx={{ display: { xs: "none", sm: "inline" }, opacity: 0.4 }}
                  >
                    •
                  </Typography>
                )}
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Bottom copyright */}
        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
        <Box
          mt={4}
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography variant="caption" color="rgba(255,255,255,0.6)">
            © 2025 SunuChat. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            {["Privacy", "Terms", "Accessibility"].map((item) => (
              <Link
                key={item}
                href="#"
                underline="hover"
                color="rgba(255,255,255,0.7)"
                sx={{ "&:hover": { color: "#fff" }, transition: "color 0.3s" }}
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
