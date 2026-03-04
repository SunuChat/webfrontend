// EmailVerificationPage.jsx — SunuChat · Editorial Clean
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Link, Stack, Button,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon       from "@mui/icons-material/ErrorOutlineRounded";
import HomeOutlinedIcon              from "@mui/icons-material/HomeOutlined";
import ChatBubbleOutlineRoundedIcon  from "@mui/icons-material/ChatBubbleOutlineRounded";
import axios from "axios";
import { Logo } from "../components/AuthLayout";
import {
  PRIMARY_COLOR, SECONDARY_COLOR, ACCENT_HOVER,
  BG_PAGE, BG_WHITE, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, FONT_SANS, FONT_SERIF,
} from "../constants";

// Page standalone (pas de split — full centre)
export default function EmailVerificationPage() {
  const { token }  = useParams();
  const navigate   = useNavigate();
  const hasCalled  = useRef(false);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    const verify = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_BACK_URL}/verify/${token}`);
        setTimeout(() => setStatus("success"), 500);
      } catch {
        setTimeout(() => setStatus("error"), 500);
      }
    };
    verify();
  }, [token]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: BG_PAGE,
        display: "flex",
        flexDirection: "column",
      }}
    >
      

      {/* Centre */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 2, py: 6 }}>
        <Box
          sx={{
            maxWidth: 460, width: "100%",
            bgcolor: BG_WHITE,
            border: `1px solid ${BORDER_COLOR}`,
            borderRadius: "16px",
            p: { xs: 3.5, md: 5 },
            textAlign: "center",
          }}
        >
          {/* Loading */}
          {status === "loading" && (
            <Stack spacing={2.5} alignItems="center">
              <CircularProgress size={40} sx={{ color: PRIMARY_COLOR }} />
              <Typography
                sx={{ fontFamily: FONT_SERIF, fontWeight: 600, fontSize: "1.2rem", color: TEXT_PRIMARY }}
              >
                Vérification en cours…
              </Typography>
              <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED }}>
                Merci de patienter quelques instants.
              </Typography>
            </Stack>
          )}

          {/* Success */}
          {status === "success" && (
            <Stack spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 72, height: 72, borderRadius: "50%",
                  bgcolor: "#f0fdf4", border: "1px solid #bbf7d0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <CheckCircleOutlineRoundedIcon sx={{ color: "#16a34a", fontSize: 36 }} />
              </Box>

              <Typography
                sx={{ fontFamily: FONT_SERIF, fontWeight: 600, fontSize: "1.5rem", color: TEXT_PRIMARY }}
              >
                Email vérifié !
              </Typography>
              <Typography
                sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED, lineHeight: 1.7, maxWidth: 320 }}
              >
                Ton compte SunuChat est maintenant actif.
                Tu peux te connecter et accéder à l'assistant santé.
              </Typography>

              <Stack spacing={1.5} sx={{ width: "100%", pt: 1 }}>
                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => navigate("/login")}
                  sx={{
                    fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.9rem",
                    textTransform: "none", borderRadius: "8px", py: 1.15,
                    bgcolor: PRIMARY_COLOR, "&:hover": { bgcolor: ACCENT_HOVER },
                  }}
                >
                  Se connecter
                </Button>
                <Button
                  variant="text"
                  onClick={() => navigate("/chatbot")}
                  startIcon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 17 }} />}
                  sx={{
                    fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.875rem",
                    textTransform: "none", color: TEXT_MUTED, borderRadius: "8px",
                    "&:hover": { color: PRIMARY_COLOR, bgcolor: "transparent" },
                  }}
                >
                  Accéder directement au chatbot
                </Button>
              </Stack>
            </Stack>
          )}

          {/* Error */}
          {status === "error" && (
            <Stack spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 72, height: 72, borderRadius: "50%",
                  bgcolor: "#fef2f2", border: "1px solid #fecaca",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <ErrorOutlineRoundedIcon sx={{ color: "#dc2626", fontSize: 36 }} />
              </Box>

              <Typography
                sx={{ fontFamily: FONT_SERIF, fontWeight: 600, fontSize: "1.5rem", color: TEXT_PRIMARY }}
              >
                Lien invalide
              </Typography>
              <Typography
                sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED, lineHeight: 1.7, maxWidth: 320 }}
              >
                Ce lien de vérification est invalide ou a déjà expiré.
                Connecte-toi pour en demander un nouveau.
              </Typography>

              <Stack spacing={1.5} sx={{ width: "100%", pt: 1 }}>
                <Button
                  variant="outlined"
                  disableElevation
                  onClick={() => navigate("/login")}
                  sx={{
                    fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.9rem",
                    textTransform: "none", borderRadius: "8px", py: 1.15,
                    borderColor: BORDER_COLOR, color: TEXT_SECONDARY,
                    "&:hover": { borderColor: TEXT_SECONDARY, bgcolor: "transparent", color: TEXT_PRIMARY },
                  }}
                >
                  Retour à la connexion
                </Button>
                <Button
                  variant="text"
                  onClick={() => navigate("/")}
                  sx={{
                    fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.875rem",
                    textTransform: "none", color: TEXT_MUTED,
                    "&:hover": { color: TEXT_PRIMARY, bgcolor: "transparent" },
                  }}
                >
                  Retour à l'accueil
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}