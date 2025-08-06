import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Fade,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACK_URL}/reset-password/${token}`,
        {
          new_password: newPassword,
        }
      );
      setMessage("Mot de passe mis à jour !");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("Lien invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1500&q=80')`,
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
            sx={{ fontWeight: "bold", color: "#333" }}
          >
            Nouveau mot de passe 🔐
          </Typography>

          <Typography
            variant="body2"
            align="center"
            gutterBottom
            sx={{ color: "#666" }}
          >
            Choisis ton nouveau mot de passe
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              placeholder="Nouveau mot de passe"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              placeholder="Confirmer le mot de passe"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!newPassword || !confirmPassword || loading}
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
                opacity: newPassword && confirmPassword && !loading ? 1 : 0.6,
                cursor:
                  newPassword && confirmPassword && !loading
                    ? "pointer"
                    : "not-allowed",
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
                  <span>Réinitialisation...</span>
                </Box>
              ) : (
                "Réinitialiser"
              )}
            </Button>
          </form>
        </Paper>
      </Fade>
      <Snackbar
        open={!!message}
        autoHideDuration={4000}
        onClose={() => setMessage("")}
      >
        <Alert severity="info">{message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPasswordPage;
