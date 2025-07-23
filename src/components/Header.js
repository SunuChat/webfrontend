// Header.jsx
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
  useMediaQuery,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { PRIMARY_COLOR } from "../constants"; // <-- Import de la couleur

export default function Header() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useMediaQuery("(max-width:960px)");
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem("token");

  const navItems = [
    { label: "Accueil", href: "/" },
    { label: "Chatbot", href: "/chatbot" },
    { label: "Partenaires", href: "/partners" },
    { label: "Equipe", href: "/team" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const authButtons = isAuthenticated
    ? [
        {
          label: "Se déconnecter",
          action: () => {
            localStorage.removeItem("token");
            navigate("/login");
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
            color: PRIMARY_COLOR,
            fontSize: { xs: "1.2rem", md: "1.5rem" },
          }}
        >
          SunuChat
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              sx={{ color: PRIMARY_COLOR }}
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
                    color: PRIMARY_COLOR,
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
                          backgroundColor: "#f5f5f5",
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
                  {authButtons.map((btn) =>
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
                            backgroundColor: "#f5f5f5",
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
                            backgroundColor: "#f5f5f5",
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
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "1rem",
                  px: 2,
                  color: PRIMARY_COLOR,
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
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
                  sx={{
                    textTransform: "none",
                    borderRadius: "20px",
                    fontWeight: 500,
                    px: 2,
                    borderColor: PRIMARY_COLOR,
                    color: PRIMARY_COLOR,
                  }}
                >
                  {btn.label}
                </Button>
              ) : (
                <Button
                  key={btn.label}
                  onClick={btn.action}
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderRadius: "20px",
                    fontWeight: 500,
                    px: 2,
                    borderColor: PRIMARY_COLOR,
                    color: PRIMARY_COLOR,
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
