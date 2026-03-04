// Header.jsx — SunuChat · Direction "Editorial Clean"
import React, { useMemo, useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Drawer, Divider, Menu, MenuItem, Stack,
} from "@mui/material";
import MenuRoundedIcon             from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon            from "@mui/icons-material/CloseRounded";
import PersonOutlineRoundedIcon    from "@mui/icons-material/PersonOutlineRounded";
import LogoutRoundedIcon           from "@mui/icons-material/LogoutRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PRIMARY_COLOR, SECONDARY_COLOR, ACCENT_HOVER,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS,
} from "../constants";

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ onClick }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" onClick={onClick} sx={{ cursor: "pointer" }}>
      <Box sx={{ display: "flex", gap: "3px", alignItems: "flex-end" }}>
        <Box sx={{ width: 9, height: 20, borderRadius: "3px", bgcolor: PRIMARY_COLOR }} />
        <Box sx={{ width: 9, height: 13, borderRadius: "3px", bgcolor: SECONDARY_COLOR }} />
      </Box>
      <Typography
        sx={{
          fontFamily: FONT_SANS,
          fontWeight: 700,
          fontSize: "1.05rem",
          color: TEXT_PRIMARY,
          letterSpacing: "-0.01em",
        }}
      >
        SunuChat
      </Typography>
    </Stack>
  );
}

// ─── Desktop nav link ─────────────────────────────────────────────────────────
function NavLink({ active, onClick, children }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        all: "unset",
        cursor: "pointer",
        fontFamily: FONT_SANS,
        fontSize: "0.875rem",
        fontWeight: active ? 600 : 400,
        color: active ? PRIMARY_COLOR : TEXT_SECONDARY,
        px: "12px",
        py: "6px",
        borderRadius: "6px",
        transition: "color .15s, background .15s",
        "&:hover": { color: TEXT_PRIMARY, bgcolor: "rgba(0,0,0,0.04)" },
      }}
    >
      {children}
    </Box>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Header() {
  const [drawer, setDrawer]     = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [raised, setRaised]     = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isAuth   = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const fn = () => setRaised(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const nav = useMemo(() => [
    { label: "Accueil",     href: "/" },
    { label: "Partenaires", href: "/partners" },
    { label: "Équipe",      href: "/team" },
    { label: "Dashboard",   href: "/dashboard" },
  ], []);

  const go    = (href) => { setDrawer(false); navigate(href); };
  const isOn  = (href) => href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);
  const openMenu  = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = ()  => setAnchorEl(null);
  const logout    = ()  => { localStorage.removeItem("token"); closeMenu(); navigate("/"); };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${raised ? BORDER_COLOR : "transparent"}`,
        transition: "border-color .2s",
      }}
    >
      <Toolbar
        disableGutters
        sx={{ px: { xs: 2.5, md: 5 }, minHeight: { xs: 56, md: 64 }, gap: 2 }}
      >
        {/* Logo */}
        <Logo onClick={() => go("/")} />

        {/* Nav — desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.25, flex: 1 }}>
          {nav.map((item) => (
            <NavLink key={item.label} active={isOn(item.href)} onClick={() => go(item.href)}>
              {item.label}
            </NavLink>
          ))}
        </Box>

        {/* Actions — desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center", ml: "auto" }}>
          <Button
            onClick={() => go("/chatbot")}
            variant="contained"
            disableElevation
            sx={{
              fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.84rem",
              textTransform: "none", borderRadius: "8px", px: 2, py: "7px",
              bgcolor: PRIMARY_COLOR,
              "&:hover": { bgcolor: ACCENT_HOVER },
              transition: "background .18s",
            }}
          >
            Chatbot IA
          </Button>

          {!isAuth ? (
            <Button
              onClick={() => go("/login")}
              variant="text"
              sx={{
                fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.84rem",
                textTransform: "none", color: TEXT_SECONDARY, borderRadius: "8px", px: 1.5,
                "&:hover": { color: TEXT_PRIMARY, bgcolor: "rgba(0,0,0,0.04)" },
              }}
            >
              Connexion
            </Button>
          ) : (
            <>
              <Button
                onClick={openMenu}
                endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: "1rem !important" }} />}
                sx={{
                  fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.84rem",
                  textTransform: "none", color: TEXT_SECONDARY, borderRadius: "8px", px: 1.5,
                  "&:hover": { color: TEXT_PRIMARY, bgcolor: "rgba(0,0,0,0.04)" },
                }}
              >
                Mon compte
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1, border: `1px solid ${BORDER_COLOR}`,
                    borderRadius: "10px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", minWidth: 160,
                    "& .MuiMenuItem-root": {
                      fontFamily: FONT_SANS, fontSize: "0.84rem", color: TEXT_SECONDARY,
                      gap: 1.25, py: 1, px: 1.75,
                      "&:hover": { color: TEXT_PRIMARY, bgcolor: "rgba(0,0,0,0.04)" },
                    },
                  },
                }}
              >
                <MenuItem onClick={() => { closeMenu(); navigate("/profile"); }}>
                  <PersonOutlineRoundedIcon sx={{ fontSize: 17 }} />
                  Mon profil
                </MenuItem>
                <Divider sx={{ my: 0.5, borderColor: BORDER_COLOR }} />
                <MenuItem onClick={logout} sx={{ color: "#d32f2f !important" }}>
                  <LogoutRoundedIcon sx={{ fontSize: 17 }} />
                  Déconnexion
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Burger — mobile */}
        <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
          <IconButton size="small" onClick={() => setDrawer(true)} sx={{ color: TEXT_PRIMARY }}>
            <MenuRoundedIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* ── Drawer mobile ── */}
      <Drawer
        anchor="right"
        open={drawer}
        onClose={() => setDrawer(false)}
        PaperProps={{
          sx: { width: 280, boxShadow: "none", borderLeft: `1px solid ${BORDER_COLOR}` },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Logo onClick={() => go("/")} />
            <IconButton size="small" onClick={() => setDrawer(false)} sx={{ color: TEXT_MUTED }}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Divider sx={{ borderColor: BORDER_COLOR, mb: 2 }} />

          <Stack spacing={0.25}>
            {nav.map((item) => (
              <Box
                key={item.label}
                component="button"
                onClick={() => go(item.href)}
                sx={{
                  all: "unset", cursor: "pointer", display: "block",
                  fontFamily: FONT_SANS, fontSize: "0.9rem",
                  fontWeight: isOn(item.href) ? 600 : 400,
                  color: isOn(item.href) ? PRIMARY_COLOR : TEXT_SECONDARY,
                  px: 1.5, py: 1, borderRadius: "8px",
                  bgcolor: isOn(item.href) ? `${PRIMARY_COLOR}0D` : "transparent",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.04)", color: TEXT_PRIMARY },
                  transition: "all .15s",
                }}
              >
                {item.label}
              </Box>
            ))}
          </Stack>

          <Divider sx={{ borderColor: BORDER_COLOR, my: 2 }} />

          <Button
            fullWidth variant="contained" disableElevation
            onClick={() => go("/chatbot")}
            sx={{
              fontFamily: FONT_SANS, fontWeight: 600, textTransform: "none",
              borderRadius: "8px", py: 1, mb: 1,
              bgcolor: PRIMARY_COLOR, "&:hover": { bgcolor: ACCENT_HOVER },
            }}
          >
            Chatbot IA
          </Button>

          {!isAuth ? (
            <Button
              fullWidth variant="text" onClick={() => go("/login")}
              sx={{
                fontFamily: FONT_SANS, fontWeight: 500, textTransform: "none",
                borderRadius: "8px", py: 1, color: TEXT_SECONDARY,
                "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
              }}
            >
              Se connecter
            </Button>
          ) : (
            <Stack spacing={0.25} mt={0.5}>
              {[
                { label: "Mon profil",    icon: <PersonOutlineRoundedIcon sx={{ fontSize: 17 }} />, action: () => go("/profile"), color: TEXT_SECONDARY },
                { label: "Déconnexion",   icon: <LogoutRoundedIcon sx={{ fontSize: 17 }} />, action: logout, color: "#d32f2f" },
              ].map((i) => (
                <Box
                  key={i.label}
                  component="button"
                  onClick={i.action}
                  sx={{
                    all: "unset", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 1,
                    fontFamily: FONT_SANS, fontSize: "0.88rem",
                    color: i.color, px: 1.5, py: 1, borderRadius: "8px",
                    "&:hover": { bgcolor: i.color === "#d32f2f" ? "#ffebee" : "rgba(0,0,0,0.04)" },
                  }}
                >
                  {i.icon}
                  {i.label}
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}