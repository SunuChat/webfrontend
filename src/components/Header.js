import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Header() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Simule l'état d'authentification (à remplacer par ton vrai état Redux ou Context)
  const isAuthenticated = false; // true si connecté, false sinon

  const navItems = [
    { label: "Accueil", href: "/" },
    { label: "Chatbot", href: "/chatbot" },
    { label: "Partenaires", href: "/partenaires" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const authButtons = isAuthenticated
    ? [
        {
          label: "Se déconnecter",
          action: () => {
            // logique de déconnexion ici
            console.log("Déconnexion");
          },
        },
      ]
    : [{ label: " Se Connecter", href: "/login" }];

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: "1px solid #eee",
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 6 } }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: theme.palette.primary.main,
            fontSize: { xs: "1.2rem", md: "1.5rem" },
          }}
        >
          SunuChat
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="primary"
              aria-label="menu"
              onClick={() => setOpenDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={openDrawer}
              onClose={() => setOpenDrawer(false)}
              PaperProps={{
                sx: {
                  width: 260,
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                },
              }}
            >
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    mb: 2,
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                  }}
                >
                  Menu
                </Typography>
                <Divider />
                <List>
                  {navItems.map((item) => (
                    <ListItem
                      button
                      key={item.label}
                      component="a"
                      href={item.href}
                      onClick={() => setOpenDrawer(false)}
                      sx={{
                        px: 3,
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  {authButtons.map((btn, index) =>
                    btn.href ? (
                      <ListItem
                        button
                        key={btn.label}
                        component="a"
                        href={btn.href}
                        onClick={() => setOpenDrawer(false)}
                        sx={{
                          px: 3,
                          py: 1.5,
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <ListItemText
                          primary={btn.label}
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                    ) : (
                      <ListItem
                        button
                        key={btn.label}
                        onClick={() => {
                          btn.action();
                          setOpenDrawer(false);
                        }}
                        sx={{
                          px: 3,
                          py: 1.5,
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <ListItemText
                          primary={btn.label}
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                    )
                  )}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                href={item.href}
                color="primary"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "1rem",
                  px: 2,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            {authButtons.map((btn) =>
              btn.href ? (
                <Button
                  key={btn.label}
                  href={btn.href}
                  variant="outlined"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    borderRadius: "20px",
                    fontWeight: 500,
                    px: 2,
                  }}
                >
                  {btn.label}
                </Button>
              ) : (
                <Button
                  key={btn.label}
                  onClick={btn.action}
                  variant="outlined"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    borderRadius: "20px",
                    fontWeight: 500,
                    px: 2,
                  }}
                >
                  {btn.label}
                </Button>
              )
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
