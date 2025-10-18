import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";

const ProfilePage = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setForm(response.data);
    } catch (err) {
      console.error(err);
      setErrorMessage("Erreur lors de la récupération du profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACK_URL}/me`,
        {
          firstname: form.firstname,
          lastname: form.lastname,
          phone: form.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage("Profil mis à jour avec succès !");
    } catch (err) {
      console.error(err);
      setErrorMessage("Erreur lors de la mise à jour du profil.");
    } finally {
      setUpdating(false);
    }
  };
  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Tous les champs sont requis.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage(
        "Le nouveau mot de passe doit contenir au moins 8 caractères."
      );
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACK_URL}/me/password`,
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage("Mot de passe mis à jour avec succès !");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.detail ||
          "Erreur lors de la mise à jour du mot de passe."
      );
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        px: 2,
        py: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 1100,
          borderRadius: 3,
          p: { xs: 2, md: 4 },
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
        >
          Mon profil 👤
        </Typography>

        <Box component="form">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4,
            }}
          >
            {/* Bloc infos profil */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                Informations personnelles
              </Typography>

              <TextField
                label="Prénom"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Nom"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Téléphone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                name="email"
                value={form.email}
                disabled
                fullWidth
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
                  fontWeight: "bold",
                }}
                onClick={handleUpdate}
                disabled={updating}
              >
                {updating ? "Mise à jour..." : "Enregistrer les modifications"}
              </Button>
            </Box>

            {/* Bloc mot de passe */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                Changer le mot de passe 🔒
              </Typography>

              <TextField
                label="Ancien mot de passe"
                type="password"
                fullWidth
                sx={{ mb: 2 }}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <TextField
                label="Nouveau mot de passe"
                type="password"
                fullWidth
                sx={{ mb: 2 }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                label="Confirmer le nouveau mot de passe"
                type="password"
                fullWidth
                sx={{ mb: 2 }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: PRIMARY_COLOR,
                  color: PRIMARY_COLOR,
                  fontWeight: "bold",
                }}
                onClick={handlePasswordChange}
              >
                Mettre à jour le mot de passe
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Notifications */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={() => setSuccessMessage("")}
        >
          <Alert severity="success">{successMessage}</Alert>
        </Snackbar>

        <Snackbar
          open={!!errorMessage}
          autoHideDuration={4000}
          onClose={() => setErrorMessage("")}
        >
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
