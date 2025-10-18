import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Fade,
} from "@mui/material";
import axios from "axios";
import SuccessImg from "../assets/icons/success.png"; // à créer ou récupérer
import ErrorImg from "../assets/icons/error.png"; // à créer ou récupérer
import { PRIMARY_COLOR, SECONDARY_COLOR } from "../constants";

const EmailVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const hasCalled = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (hasCalled.current) return;
      hasCalled.current = true;

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACK_URL}/verify/${token}`
        );
        // Optionnel : petite pause pour transition douce
        setTimeout(() => setStatus("success"), 500);
      } catch (err) {
        setTimeout(() => setStatus("error"), 500);
      }
    };

    verifyToken();
  }, [token]);

  const handleGoToLogin = () => navigate("/login");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: SECONDARY_COLOR,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 4,
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        {status === "loading" && (
          <>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Vérification en cours...
            </Typography>
          </>
        )}

        <Fade in={status === "success"}>
          <Box display={status === "success" ? "block" : "none"}>
            <Box
              width={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <img
                src={SuccessImg}
                alt="Success"
                style={{ width: "150px", marginBottom: "20px" }}
              />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="green">
              Email vérifié avec succès !
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Tu peux maintenant te connecter à SunuChat.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={handleGoToLogin}
            >
              Se connecter
            </Button>
          </Box>
        </Fade>

        <Fade in={status === "error"}>
          <Box display={status === "error" ? "block" : "none"}>
            <Box
              width={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <img
                src={ErrorImg}
                alt="Erreur"
                style={{ width: "150px", marginBottom: "20px" }}
              />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="error">
              Lien invalide ou expiré
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Le lien de vérification n’est pas valide ou a déjà été utilisé.
            </Typography>
          </Box>
        </Fade>
      </Paper>
    </Box>
  );
};

export default EmailVerificationPage;
