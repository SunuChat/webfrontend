// ProfilePage.jsx — SunuChat · Editorial Clean
import React, { useEffect, useState } from "react";
import {
  Box, Container, Typography, Stack, Grid,
  Avatar, Divider, CircularProgress,
} from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockOutlinedIcon         from "@mui/icons-material/LockOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import axios from "axios";

import {
  AuthField, AuthButton, AuthButtonOutlined,
  AuthError, AuthSuccess,
} from "../components/Authformstyles";
import {
  PRIMARY_COLOR, SECONDARY_COLOR,
  BG_PAGE, BG_WHITE, BG_SECTION_ALT,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS, FONT_SERIF,
} from "../constants";

// ── Section card ───────────────────────────────────────────────────────────
function SectionCard({ icon, title, children }) {
  return (
    <Box
      sx={{
        bgcolor: BG_WHITE,
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: "14px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Stack
        direction="row" spacing={1.5} alignItems="center"
        sx={{
          px: { xs: 3, md: 3.5 },
          py: 2.5,
          borderBottom: `1px solid ${BORDER_COLOR}`,
          bgcolor: BG_SECTION_ALT,
        }}
      >
        <Box
          sx={{
            width: 34, height: 34, borderRadius: "9px",
            bgcolor: `${PRIMARY_COLOR}10`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: PRIMARY_COLOR, flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.9rem",
            color: TEXT_PRIMARY,
          }}
        >
          {title}
        </Typography>
      </Stack>

      {/* Body */}
      <Box sx={{ px: { xs: 3, md: 3.5 }, py: 3 }}>
        {children}
      </Box>
    </Box>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", phone: "" });
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError,   setProfileError]   = useState("");

  const [oldPassword,     setOldPassword]     = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError,   setPwError]   = useState("");

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACK_URL}/me`, { headers });
        setForm(data);
      } catch {
        setProfileError("Erreur lors de la récupération du profil.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setProfileError("");
    setProfileSuccess("");
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACK_URL}/me`,
        { firstname: form.firstname, lastname: form.lastname, phone: form.phone },
        { headers }
      );
      setProfileSuccess("Profil mis à jour avec succès.");
    } catch {
      setProfileError("Erreur lors de la mise à jour du profil.");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwError("Tous les champs sont requis.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setPwLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACK_URL}/me/password`,
        { old_password: oldPassword, new_password: newPassword },
        { headers }
      );
      setPwSuccess("Mot de passe mis à jour avec succès.");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      setPwError(err.response?.data?.detail || "Erreur lors de la mise à jour du mot de passe.");
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={36} sx={{ color: PRIMARY_COLOR }} />
      </Box>
    );
  }

  // Initiales de l'avatar
  const initials = `${form.firstname?.[0] ?? ""}${form.lastname?.[0] ?? ""}`.toUpperCase();

  return (
    <Box sx={{ bgcolor: BG_PAGE, minHeight: "100vh" }}>
      {/* Hero / Header */}
      <Box sx={{ bgcolor: BG_WHITE, borderBottom: `1px solid ${BORDER_COLOR}`, py: { xs: 4, md: 6 } }}>
        <Container maxWidth="md">
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ xs: "flex-start", sm: "center" }}>
            <Avatar
              sx={{
                width: 64, height: 64,
                bgcolor: `${PRIMARY_COLOR}18`,
                color: PRIMARY_COLOR,
                fontFamily: FONT_SERIF,
                fontWeight: 600,
                fontSize: "1.4rem",
                border: `1px solid ${BORDER_COLOR}`,
              }}
            >
              {initials || <PersonOutlineRoundedIcon sx={{ fontSize: 28 }} />}
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontFamily: FONT_SERIF, fontWeight: 600,
                  fontSize: { xs: "1.4rem", md: "1.7rem" },
                  color: TEXT_PRIMARY, letterSpacing: "-0.02em", lineHeight: 1.2,
                }}
              >
                {form.firstname} {form.lastname}
              </Typography>
              <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED, mt: 0.4 }}>
                {form.email}
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>

          {/* ── Infos personnelles ── */}
          <SectionCard
            icon={<PersonOutlineRoundedIcon sx={{ fontSize: 18 }} />}
            title="Informations personnelles"
          >
            <form onSubmit={handleUpdate} noValidate>
              <Stack spacing={2.5}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <AuthField
                      label="Prénom"
                      value={form.firstname}
                      onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                      autoComplete="given-name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <AuthField
                      label="Nom"
                      value={form.lastname}
                      onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                      autoComplete="family-name"
                    />
                  </Grid>
                </Grid>

                <AuthField
                  label="Téléphone"
                  value={form.phone ?? ""}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+221 77 000 00 00"
                  autoComplete="tel"
                />

                <Box>
                  <Typography sx={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.8rem", color: TEXT_SECONDARY, mb: 0.6 }}>
                    Adresse email
                  </Typography>
                  <Box
                    sx={{
                      px: "13px", py: "10px",
                      borderRadius: "8px",
                      border: `1px solid ${BORDER_COLOR}`,
                      bgcolor: "rgba(0,0,0,0.025)",
                      display: "flex", alignItems: "center", gap: 1,
                    }}
                  >
                    <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.9rem", color: TEXT_MUTED, flex: 1 }}>
                      {form.email}
                    </Typography>
                    <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.72rem", color: TEXT_MUTED }}>
                      Non modifiable
                    </Typography>
                  </Box>
                </Box>

                <AuthError   message={profileError} />
                <AuthSuccess message={profileSuccess} />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Box sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}>
                    <AuthButton loading={updating ? "Enregistrement..." : null}>
                      Enregistrer les modifications
                    </AuthButton>
                  </Box>
                </Box>
              </Stack>
            </form>
          </SectionCard>

          {/* ── Mot de passe ── */}
          <SectionCard
            icon={<LockOutlinedIcon sx={{ fontSize: 18 }} />}
            title="Changer le mot de passe"
          >
            <form onSubmit={handlePasswordChange} noValidate>
              <Stack spacing={2.5}>
                <AuthField
                  label="Mot de passe actuel"
                  type="password"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <Divider sx={{ borderColor: BORDER_COLOR }} />

                <AuthField
                  label="Nouveau mot de passe"
                  type="password"
                  placeholder="8 caractères minimum"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />

                {/* Checklist règles */}
                {newPassword && (
                  <Stack spacing={0.6} sx={{ px: 0.25 }}>
                    {[
                      { label: "8 caractères minimum", ok: newPassword.length >= 8 },
                      { label: "Une majuscule",          ok: /[A-Z]/.test(newPassword) },
                      { label: "Un chiffre",             ok: /\d/.test(newPassword) },
                      { label: "Un caractère spécial",   ok: /[^a-zA-Z\d]/.test(newPassword) },
                    ].map((rule) => (
                      <Stack key={rule.label} direction="row" spacing={0.75} alignItems="center">
                        <Box sx={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0, bgcolor: rule.ok ? "#22c55e" : BORDER_COLOR, transition: "background .2s" }} />
                        <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.77rem", color: rule.ok ? "#16a34a" : TEXT_MUTED, transition: "color .2s" }}>
                          {rule.label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                )}

                <AuthField
                  label="Confirmer le nouveau mot de passe"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />

                <AuthError   message={pwError} />
                <AuthSuccess message={pwSuccess} />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Box sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 220 }}>
                    <AuthButtonOutlined
                      type="submit"
                      loading={pwLoading ? "Mise à jour..." : null}
                    >
                      Mettre à jour le mot de passe
                    </AuthButtonOutlined>
                  </Box>
                </Box>
              </Stack>
            </form>
          </SectionCard>

        </Stack>
      </Container>
    </Box>
  );
}