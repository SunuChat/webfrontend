// ResetPasswordPage.jsx — SunuChat · Editorial Clean
import React, { useState } from "react";
import { Box, Typography, Link, Stack } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LockOutlinedIcon  from "@mui/icons-material/LockOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AuthLayout from "../components/AuthLayout";
import {
  AuthTitle, AuthSubtitle, AuthField, AuthButton, AuthError,
} from "../components/Authformstyles";
import {
  PRIMARY_COLOR, SECONDARY_COLOR, BORDER_COLOR, TEXT_MUTED, FONT_SANS,
} from "../constants";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate  = useNavigate();

  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = newPassword && confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_BACK_URL}/reset-password/${token}`, {
        new_password: newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      setError("Lien invalide ou expiré. Demande un nouveau lien.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Box
            sx={{
              width: 64, height: 64, borderRadius: "50%",
              bgcolor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              display: "flex", alignItems: "center", justifyContent: "center",
              mx: "auto", mb: 3,
            }}
          >
            <CheckCircleOutlineRoundedIcon sx={{ color: "#16a34a", fontSize: 32 }} />
          </Box>
          <AuthTitle>Mot de passe mis à jour !</AuthTitle>
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED, mt: 1.5, mb: 1, lineHeight: 1.7 }}>
            Ton mot de passe a été réinitialisé avec succès.
            Tu vas être redirigé vers la connexion dans quelques secondes.
          </Typography>
          <Link
            onClick={() => navigate("/login")}
            sx={{
              fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.875rem",
              color: PRIMARY_COLOR, cursor: "pointer",
              textDecoration: "none", "&:hover": { textDecoration: "underline" },
            }}
          >
            Se connecter maintenant →
          </Link>
        </Box>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Box
        sx={{
          width: 48, height: 48, borderRadius: "12px",
          bgcolor: `${PRIMARY_COLOR}10`,
          display: "flex", alignItems: "center", justifyContent: "center",
          mb: 2.5,
        }}
      >
        <LockOutlinedIcon sx={{ color: PRIMARY_COLOR, fontSize: 22 }} />
      </Box>

      <AuthTitle>Nouveau mot de passe</AuthTitle>
      <AuthSubtitle>Choisis un mot de passe sécurisé pour ton compte.</AuthSubtitle>

      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.5}>
          <AuthField
            label="Nouveau mot de passe" required
            type="password"
            placeholder="8 caractères minimum"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <AuthField
            label="Confirmer le mot de passe" required
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          {/* Règles de mot de passe */}
          <Box sx={{ px: 0.25 }}>
            {[
              { label: "8 caractères minimum", ok: newPassword.length >= 8 },
              { label: "Une majuscule",          ok: /[A-Z]/.test(newPassword) },
              { label: "Un chiffre",             ok: /\d/.test(newPassword) },
              { label: "Un caractère spécial",   ok: /[^a-zA-Z\d]/.test(newPassword) },
            ].map((rule) => (
              <Stack key={rule.label} direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
                <Box
                  sx={{
                    width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                    bgcolor: newPassword
                      ? rule.ok ? "#22c55e" : BORDER_COLOR
                      : BORDER_COLOR,
                    transition: "background .2s",
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: FONT_SANS, fontSize: "0.77rem",
                    color: newPassword && rule.ok ? "#16a34a" : TEXT_MUTED,
                    transition: "color .2s",
                  }}
                >
                  {rule.label}
                </Typography>
              </Stack>
            ))}
          </Box>

          <AuthError message={error} />

          <AuthButton loading={loading ? "Réinitialisation..." : null} disabled={!isValid}>
            Réinitialiser mon mot de passe
          </AuthButton>
        </Stack>
      </form>
    </AuthLayout>
  );
}