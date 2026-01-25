import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Fade,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import coverImage from "../assets/images/coverImage.avif";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const navigate = useNavigate();
  const isFormValid = () => {
    return email && password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowResend(false);
    setResendMessage("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/login`,
        { email, password },
      );
      localStorage.setItem("token", response.data.access_token);
      navigate("/");
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("Email ou mot de passe incorrect.");
            break;
          case 403:
            setError("Compte non vérifié. Vérifie ta boîte mail !");
            setShowResend(true); // montrer le bouton pour renvoyer le mail
            break;
          default:
            setError("Une erreur est survenue. Réessaie plus tard.");
        }
      } else {
        setError("Impossible de se connecter au serveur.");
      }
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
        backgroundImage: `url(${coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Fade in timeout={600}>
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            width: 350,
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
            Bienvenue 👋
          </Typography>

          <Typography
            variant="body2"
            align="center"
            gutterBottom
            sx={{ color: "#666" }}
          >
            Connecte-toi pour accéder à ton espace
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              placeholder="Email"
              variant="outlined"
              fullWidth
              autoComplete="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              placeholder="Mot de passe"
              type="password"
              variant="outlined"
              fullWidth
              autoComplete="current-password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            {showResend && (
              <Button
                onClick={handleResend}
                variant="outlined"
                fullWidth
                sx={{ mt: 1, textTransform: "none" }}
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
                  <span>Connexion...</span>
                </Box>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 3, color: "#666" }}
          >
            Pas encore de compte ?{" "}
            <Link
              onClick={() => navigate("/signup")}
              sx={{
                cursor: "pointer",
                color: "#2575fc",
                fontWeight: "bold",
                textDecoration: "none",
                ":hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Inscris-toi
            </Link>
          </Typography>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Typography align="right" sx={{ mt: 1 }}>
              <Button onClick={() => navigate("/forgot-password")}>
                Mot de passe oublié ?
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default LoginPage;
