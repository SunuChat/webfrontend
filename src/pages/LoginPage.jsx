// LoginPage.jsx — SunuChat · Editorial Clean
import React, { useState } from "react";
import { Box, Typography, Link, Stack, Checkbox } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout              from "../components/AuthLayout";
import {
  AuthTitle, AuthSubtitle, AuthField, AuthButton,
  AuthButtonOutlined, AuthError, AuthSuccess,
} from "../components/Authformstyles";
import {
  PRIMARY_COLOR, TEXT_SECONDARY, TEXT_MUTED, FONT_SANS,
} from "../constants";

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showResend,    setShowResend]    = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg,     setResendMsg]     = useState("");

  const navigate    = useNavigate();
  const isFormValid = email && password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowResend(false);
    setResendMsg("");

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACK_URL}/login`, { email, password });
      localStorage.setItem("token", res.data.access_token);
      navigate("/");
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400: setError("Email ou mot de passe incorrect."); break;
          case 403:
            setError("Compte non vérifié. Vérifie ta boîte mail !");
            setShowResend(true);
            break;
          default: setError("Une erreur est survenue. Réessaie plus tard.");
        }
      } else {
        setError("Impossible de se connecter au serveur.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg("");
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACK_URL}/resend-verification`, { email });
      setResendMsg(res.data.message || "Email renvoyé avec succès.");
    } catch {
      setResendMsg("Impossible de renvoyer l'email pour le moment.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthTitle>Bon retour 👋</AuthTitle>
      <AuthSubtitle>Connecte-toi pour accéder à ton espace SunuChat.</AuthSubtitle>

      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.5}>
          <AuthField
            label="Adresse email"
            required
            type="email"
            placeholder="toi@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Box>
            <AuthField
              label="Mot de passe"
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {/* Mot de passe oublié aligné à droite */}
            <Box sx={{ textAlign: "right", mt: 0.75 }}>
              <Link
                onClick={() => navigate("/forgot-password")}
                sx={{
                  fontFamily: FONT_SANS, fontSize: "0.8rem",
                  color: TEXT_MUTED, cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": { color: PRIMARY_COLOR, textDecoration: "underline" },
                }}
              >
                Mot de passe oublié ?
              </Link>
            </Box>
          </Box>

          <AuthError message={error} />

          {showResend && (
            <AuthButtonOutlined
              onClick={handleResend}
              loading={resendLoading ? "Envoi en cours..." : null}
            >
              Renvoyer l'email de vérification
            </AuthButtonOutlined>
          )}

          {resendMsg && (
            <AuthSuccess message={resendMsg} />
          )}

          <AuthButton loading={loading ? "Connexion..." : null} disabled={!isFormValid}>
            Se connecter
          </AuthButton>
        </Stack>
      </form>

      {/* Lien inscription */}
      <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED, textAlign: "center", mt: 3.5 }}>
        Pas encore de compte ?{" "}
        <Link
          onClick={() => navigate("/signup")}
          sx={{
            fontWeight: 600, color: PRIMARY_COLOR, cursor: "pointer",
            textDecoration: "none", "&:hover": { textDecoration: "underline" },
          }}
        >
          S'inscrire
        </Link>
      </Typography>
    </AuthLayout>
  );
}