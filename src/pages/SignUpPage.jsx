// SignUpPage.jsx — SunuChat · Editorial Clean
import React, { useState } from "react";
import {
  Box, Typography, Link, Stack, Grid, Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";
import {
  AuthTitle, AuthSubtitle, AuthField, AuthButton,
  AuthButtonOutlined, AuthError, AuthSuccess, AuthDivider,
} from "../components/Authformstyles";
import {
  PRIMARY_COLOR, SECONDARY_COLOR, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS,
} from "../constants";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,}$/;

export default function SignUpPage() {
  const [firstName,      setFirstName]      = useState("");
  const [lastName,       setLastName]       = useState("");
  const [email,          setEmail]          = useState("");
  const [password,       setPassword]       = useState("");
  const [confirmPassword,setConfirmPassword]= useState("");
  const [terms,          setTerms]          = useState(false);
  const [error,          setError]          = useState("");
  const [success,        setSuccess]        = useState("");
  const [loading,        setLoading]        = useState(false);
  const [showResend,     setShowResend]     = useState(false);
  const [resendLoading,  setResendLoading]  = useState(false);
  const [resendMsg,      setResendMsg]      = useState("");

  const navigate    = useNavigate();
  const isFormValid = firstName && lastName && email && password && confirmPassword && terms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      setError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACK_URL}/signup`, {
        email,
        password,
        firstname: firstName,
        lastname: lastName,
      });
      setSuccess("Compte créé ! Vérifie ta boîte mail pour confirmer ton inscription.");
      setShowResend(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Une erreur est survenue.");
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

  // Indicateur de force du mot de passe
  const pwStrength = (() => {
    if (!password) return null;
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[^a-zA-Z\d]/.test(password),
    ];
    const score = checks.filter(Boolean).length;
    if (score <= 2) return { label: "Faible",  color: "#ef4444", width: "33%" };
    if (score <= 3) return { label: "Moyen",   color: "#f59e0b", width: "66%" };
    return              { label: "Fort",    color: "#22c55e", width: "100%" };
  })();

  return (
    <AuthLayout>
      <AuthTitle>Créer un compte</AuthTitle>
      <AuthSubtitle>Rejoins SunuChat et accède à l'assistant santé en wolof et français.</AuthSubtitle>

      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.5}>
          <Grid container spacing={2}>
            <Grid item xs={6} sx={{paddingLeft: "0 !important"}}>
              <AuthField
                label="Prénom" required
                placeholder="Aminata"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
              />
            </Grid>
            <Grid item xs={6}>
              <AuthField
                label="Nom" required
                placeholder="Diallo"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </Grid>
          </Grid>

          <AuthField
            label="Adresse email" required
            type="email"
            placeholder="toi@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Box>
            <AuthField
              label="Mot de passe" required
              type="password"
              placeholder="8 caractères minimum"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {/* Force du mot de passe */}
            {pwStrength && (
              <Box sx={{ mt: 0.75 }}>
                <Box sx={{ height: 3, borderRadius: 2, bgcolor: BORDER_COLOR, overflow: "hidden" }}>
                  <Box sx={{ height: "100%", width: pwStrength.width, bgcolor: pwStrength.color, borderRadius: 2, transition: "width .3s ease" }} />
                </Box>
                <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.72rem", color: pwStrength.color, mt: 0.4 }}>
                  Mot de passe {pwStrength.label}
                </Typography>
              </Box>
            )}
          </Box>

          <AuthField
            label="Confirmer le mot de passe" required
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          {/* CGU */}
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Checkbox
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              size="small"
              sx={{
                mt: "-2px", p: 0,
                color: BORDER_COLOR,
                "&.Mui-checked": { color: PRIMARY_COLOR },
              }}
            />
            <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.82rem", color: TEXT_MUTED, lineHeight: 1.6 }}>
              J'accepte les{" "}
              <Link
                href="/terms" target="_blank"
                sx={{ color: PRIMARY_COLOR, fontWeight: 500, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
              >
                conditions d'utilisation
              </Link>{" "}
              et la{" "}
              <Link
                href="/privacy" target="_blank"
                sx={{ color: PRIMARY_COLOR, fontWeight: 500, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
              >
                politique de confidentialité
              </Link>
            </Typography>
          </Stack>

          <AuthError message={error} />
          {success && <AuthSuccess message={success} />}

          {showResend && (
            <>
              <AuthButtonOutlined
                onClick={handleResend}
                loading={resendLoading ? "Envoi en cours..." : null}
              >
                Renvoyer l'email de confirmation
              </AuthButtonOutlined>
              {resendMsg && <AuthSuccess message={resendMsg} />}
            </>
          )}

          <AuthButton loading={loading ? "Création du compte..." : null} disabled={!isFormValid}>
            Créer mon compte
          </AuthButton>
        </Stack>
      </form>

      <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED, textAlign: "center", mt: 3.5 }}>
        Déjà inscrit ?{" "}
        <Link
          onClick={() => navigate("/login")}
          sx={{ fontWeight: 600, color: PRIMARY_COLOR, cursor: "pointer", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
        >
          Se connecter
        </Link>
      </Typography>
    </AuthLayout>
  );
}