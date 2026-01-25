import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Fade,
  Link,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import coverImage from "../assets/images/coverImage.avif";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  //const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const isFormValid = () => {
    return (
      firstName &&
      lastName &&
      email &&
      //phoneNumber &&
      password &&
      confirmPassword &&
      termsAccepted
    );
  };

  const isPasswordValid = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (!isPasswordValid(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      );
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/signup`,
        {
          email: email,
          password: password,
          firstname: firstName,
          lastname: lastName,
        },
      );

      setSuccessMessage(
        "Veuillez vérifier votre boite mail pour confirmer votre inscription svp !",
      );
      setShowResend(true);
    } catch (err) {
      setError(err.response?.data.detail);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setResendMessage("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/resend-verification`,
        { email },
      );
      setResendMessage(response.data.message);
    } catch (err) {
      setResendMessage("Impossible de renvoyer l'email pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        px: 2,
        py: 4,
      }}
    >
      <Fade in timeout={600}>
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            width: "100%",
            maxWidth: 700,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#333",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Création de compte 🚀
          </Typography>

          <Typography
            variant="body2"
            align="center"
            gutterBottom
            sx={{ color: "#666" }}
          >
            Remplis les champs pour t’inscrire
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  placeholder="Prénom"
                  variant="outlined"
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  placeholder="Nom"
                  variant="outlined"
                  fullWidth
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  placeholder="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  placeholder="Mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  placeholder="Confirmer le mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <label>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                J’accepte les{" "}
                <Link href="/terms" target="_blank">
                  conditions d’utilisation
                </Link>
              </label>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!isFormValid() || loading}
              sx={{
                mt: 3,
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "16px",
                borderRadius: "10px",
                padding: "10px 0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                ":hover": {
                  background: "linear-gradient(to right, #5c0ed1, #1d60f4)",
                },
                opacity: isFormValid() && !loading ? 1 : 0.6,
                cursor: isFormValid() && !loading ? "pointer" : "not-allowed",
              }}
            >
              {loading ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={1}
                >
                  <CircularProgress size={20} color="inherit" />
                  <span>Création...</span>
                </Box>
              ) : (
                "S'inscrire"
              )}
            </Button>
            {showResend && (
              <Button
                onClick={handleResend}
                variant="outlined"
                fullWidth
                sx={{ mt: 2, textTransform: "none" }}
                disabled={loading}
              >
                {loading
                  ? "Envoi en cours..."
                  : "Renvoyer l'email de confirmation"}
              </Button>
            )}

            {resendMessage && (
              <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
                {resendMessage}
              </Typography>
            )}

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, color: "#555" }}
            >
              Tu as déjà un compte ?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/login")}
                sx={{ fontWeight: "bold", color: "#2575fc" }}
              >
                Connecte-toi ici
              </Link>
            </Typography>
          </form>
        </Paper>
      </Fade>
      <Snackbar open={!!successMessage} onClose={() => setSuccessMessage("")}>
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SignUpPage;
