// ForgotPasswordPage.jsx — SunuChat · Editorial Clean
import React, { useState } from "react";
import { Box, Typography, Link, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import AuthLayout from "../components/AuthLayout";
import {
  AuthTitle, AuthSubtitle, AuthField, AuthButton, AuthError, AuthSuccess,
} from "../components/Authformstyles";
import { PRIMARY_COLOR, TEXT_MUTED, FONT_SANS } from "../constants";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${process.env.REACT_APP_BACK_URL}/forgot-password`, { email });
      setSuccess(true);
    } catch {
      setError("Impossible d'envoyer l'email. Vérifiez l'adresse saisie.");
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
              width: 64, height: 64, borderRadius: "16px",
              bgcolor: `${PRIMARY_COLOR}10`,
              display: "flex", alignItems: "center", justifyContent: "center",
              mx: "auto", mb: 3,
            }}
          >
            <MarkEmailReadOutlinedIcon sx={{ color: PRIMARY_COLOR, fontSize: 30 }} />
          </Box>
          <AuthTitle>Email envoyé !</AuthTitle>
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED, mt: 1.5, mb: 4, lineHeight: 1.7 }}>
            Si un compte existe pour <strong>{email}</strong>, tu recevras un lien
            de réinitialisation dans quelques minutes. Pense à vérifier tes spams.
          </Typography>
          <Link
            onClick={() => navigate("/login")}
            sx={{
              fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.875rem",
              color: PRIMARY_COLOR, cursor: "pointer",
              textDecoration: "none", "&:hover": { textDecoration: "underline" },
            }}
          >
            ← Retour à la connexion
          </Link>
        </Box>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthTitle>Mot de passe oublié ?</AuthTitle>
      <AuthSubtitle>
        Saisis ton adresse email et nous t'enverrons un lien pour réinitialiser ton mot de passe.
      </AuthSubtitle>

      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.5}>
          <AuthField
            label="Adresse email" required
            type="email"
            placeholder="toi@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <AuthError message={error} />

          <AuthButton loading={loading ? "Envoi en cours..." : null} disabled={!email}>
            Envoyer le lien de réinitialisation
          </AuthButton>
        </Stack>
      </form>

      <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED, textAlign: "center", mt: 3 }}>
        <Link
          onClick={() => navigate("/login")}
          sx={{
            color: TEXT_MUTED, cursor: "pointer",
            textDecoration: "none", "&:hover": { color: PRIMARY_COLOR, textDecoration: "underline" },
          }}
        >
          ← Retour à la connexion
        </Link>
      </Typography>
    </AuthLayout>
  );
}