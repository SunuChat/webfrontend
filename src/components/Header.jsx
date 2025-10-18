// Header.jsx — refonte visuelle premium (SunuChat)
import React, { useMemo, useState } from "react";
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
  Menu,
  MenuItem,
  Stack,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";

export default function Header() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isMobile = useMediaQuery("(max-width:960px)");
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const navItems = useMemo(
    () => [
      {
        label: "Accueil",
        href: "/",
        icon: <HomeRoundedIcon fontSize="small" />,
      },

      {
        label: "Partenaires",
        href: "/partners",
        icon: <FavoriteRoundedIcon fontSize="small" />,
      },
      {
        label: "Equipe",
        href: "/team",
        icon: <Groups2RoundedIcon fontSize="small" />,
      },
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <QueryStatsRoundedIcon fontSize="small" />,
      },
      {
        label: "Chatbot",
        href: "/chatbot",
        icon: <ChatRoundedIcon fontSize="small" />,
      },
    ],
    []
  );

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleMenuClose();
    navigate("/");
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const go = (href) => {
    setOpenDrawer(false);
    navigate(href);
  };

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        borderBottom: "1px solid #eee",
        backdropFilter: "saturate(180%) blur(10px)",
        background: "rgba(255,255,255,0.9)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 6 } }}>
        {/* Logo + Tagline */}
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Typography
            variant="h6"
            onClick={() => go("/")}
            sx={{
              cursor: "pointer",
              fontWeight: 900,
              color: PRIMARY_COLOR,
              letterSpacing: "-0.02em",
              fontSize: { xs: "1.2rem", md: "1.5rem" },
            }}
          >
            SunuChat
          </Typography>
          {/*<Chip
            size="small"
            label="beta"
            sx={{
              height: 22,
              bgcolor: `${SECONDARY_COLOR}22`,
              color: SECONDARY_COLOR,
              border: `1px solid ${SECONDARY_COLOR}55`,
              fontWeight: 700,
            }}
          />*/}
        </Stack>

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
                  width: 280,
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                },
              }}
            >
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    mb: 2,
                    fontWeight: 900,
                    color: PRIMARY_COLOR,
                  }}
                >
                  Menu
                </Typography>
                <Divider />
                <List>
                  {navItems.map((item) => (
                    <ListItem
                      key={item.label}
                      onClick={() => go(item.href)}
                      sx={{
                        px: 3,
                        py: 1.25,
                        cursor: "pointer",
                        bgcolor: isActive(item.href)
                          ? `${PRIMARY_COLOR}10`
                          : "transparent",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      <Box sx={{ mr: 1.25, color: PRIMARY_COLOR }}>
                        {item.icon}
                      </Box>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: isActive(item.href) ? 700 : 500,
                        }}
                      />
                    </ListItem>
                  ))}

                  <Divider sx={{ my: 1 }} />

                  {!isAuthenticated ? (
                    <ListItem
                      onClick={() => go("/login")}
                      sx={{ px: 3, py: 1.25, cursor: "pointer" }}
                    >
                      <ListItemText
                        primary="Se connecter"
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItem>
                  ) : (
                    <>
                      <ListItem
                        onClick={handleProfile}
                        sx={{ px: 3, py: 1.25, cursor: "pointer" }}
                      >
                        <Box sx={{ mr: 1.25, color: PRIMARY_COLOR }}>
                          <PersonRoundedIcon fontSize="small" />
                        </Box>
                        <ListItemText primary="Profil" />
                      </ListItem>
                      <ListItem
                        onClick={handleLogout}
                        sx={{ px: 3, py: 1.25, cursor: "pointer" }}
                      >
                        <Box sx={{ mr: 1.25, color: PRIMARY_COLOR }}>
                          <LogoutRoundedIcon fontSize="small" />
                        </Box>
                        <ListItemText primary="Se déconnecter" />
                      </ListItem>
                    </>
                  )}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {navItems.map((item) => (
              <NavButton
                key={item.label}
                active={isActive(item.href)}
                onClick={() => go(item.href)}
              >
                {item.label}
              </NavButton>
            ))}

            {!isAuthenticated ? (
              <Button
                onClick={() => go("/login")}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: 999,
                  fontWeight: 700,
                  px: 2.2,
                  borderColor: PRIMARY_COLOR,
                  color: PRIMARY_COLOR,
                  "&:hover": {
                    bgcolor: `${PRIMARY_COLOR}08`,
                    borderColor: PRIMARY_COLOR,
                  },
                }}
              >
                Se connecter
              </Button>
            ) : (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ color: PRIMARY_COLOR }}
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{ mt: 1.5 }}
                >
                  <MenuItem
                    sx={{ color: PRIMARY_COLOR }}
                    onClick={handleProfile}
                  >
                    <PersonRoundedIcon
                      fontSize="small"
                      style={{ marginRight: 8 }}
                    />{" "}
                    Profil
                  </MenuItem>
                  <MenuItem
                    sx={{ color: PRIMARY_COLOR }}
                    onClick={handleLogout}
                  >
                    <LogoutRoundedIcon
                      fontSize="small"
                      style={{ marginRight: 8 }}
                    />{" "}
                    Se déconnecter
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

function NavButton({ active, children, onClick }) {
  return (
    <Button
      onClick={onClick}
      sx={{
        position: "relative",
        textTransform: "none",
        fontWeight: active ? 800 : 600,
        fontSize: "1rem",
        px: 2,
        color: PRIMARY_COLOR,
        "&:hover": { backgroundColor: "#f5f5f5" },
        "&:after": {
          content: '""',
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 6,
          height: 3,
          borderRadius: 6,
          background: active
            ? `linear-gradient(90deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`
            : "transparent",
          transition: "all .2s ease",
        },
      }}
    >
      {children}
    </Button>
  );
}
