// authFormStyles.js — Styles et composants partagés pour les formulaires auth
import React, { useState } from "react";
import {
  TextField, Button, Typography, Box, Stack, InputAdornment, IconButton,
} from "@mui/material";
import VisibilityOutlinedIcon    from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CircularProgress          from "@mui/material/CircularProgress";
import {
  PRIMARY_COLOR, ACCENT_HOVER, SECONDARY_COLOR,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_COLOR, BG_PAGE, FONT_SANS, FONT_SERIF,
} from "../constants";

// ── Page title ─────────────────────────────────────────────────────────────
export function AuthTitle({ children }) {
  return (
    <Typography
      sx={{
        fontFamily: FONT_SERIF, fontWeight: 600,
        fontSize: { xs: "1.6rem", md: "1.9rem" },
        letterSpacing: "-0.02em", color: TEXT_PRIMARY,
        lineHeight: 1.2, mb: 0.75,
      }}
    >
      {children}
    </Typography>
  );
}

// ── Page subtitle ──────────────────────────────────────────────────────────
export function AuthSubtitle({ children }) {
  return (
    <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.875rem", color: TEXT_MUTED, mb: 4, lineHeight: 1.6 }}>
      {children}
    </Typography>
  );
}

// ── Field label ────────────────────────────────────────────────────────────
export function FieldLabel({ children, required }) {
  return (
    <Typography
      component="label"
      sx={{
        display: "block", fontFamily: FONT_SANS,
        fontWeight: 500, fontSize: "0.8rem",
        color: TEXT_SECONDARY, mb: 0.6,
      }}
    >
      {children}
      {required && <Box component="span" sx={{ color: PRIMARY_COLOR, ml: 0.4 }}>*</Box>}
    </Typography>
  );
}

// ── Styled input ──────────────────────────────────────────────────────────
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: FONT_SANS,
    fontSize: "0.9rem",
    borderRadius: "8px",
    bgcolor: BG_PAGE,
    "& fieldset": { borderColor: BORDER_COLOR },
    "&:hover fieldset": { borderColor: `${PRIMARY_COLOR}55` },
    "&.Mui-focused fieldset": { borderColor: PRIMARY_COLOR, borderWidth: "1.5px" },
    "&.Mui-error fieldset": { borderColor: "#d32f2f" },
  },
  "& input": { py: "10px", px: "13px" },
  "& input::placeholder": { color: TEXT_MUTED, opacity: 1 },
};

export function AuthField({ label, required, type = "text", ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <Box>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      <TextField
        fullWidth
        variant="outlined"
        type={isPassword ? (show ? "text" : "password") : type}
        sx={fieldSx}
        InputProps={
          isPassword
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShow((v) => !v)}
                      edge="end"
                      sx={{ color: TEXT_MUTED, mr: 0.25 }}
                    >
                      {show
                        ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                        : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : undefined
        }
        {...props}
      />
    </Box>
  );
}

// ── Primary submit button ──────────────────────────────────────────────────
export function AuthButton({ loading, disabled, children, ...props }) {
  return (
    <Button
      type="submit"
      variant="contained"
      fullWidth
      disableElevation
      disabled={disabled || loading}
      sx={{
        fontFamily: FONT_SANS, fontWeight: 600, fontSize: "0.9rem",
        textTransform: "none", borderRadius: "8px", py: 1.15,
        bgcolor: PRIMARY_COLOR,
        "&:hover": { bgcolor: ACCENT_HOVER },
        "&:disabled": { bgcolor: `${PRIMARY_COLOR}55`, color: "rgba(255,255,255,0.7)" },
        transition: "background .18s",
      }}
      {...props}
    >
      {loading ? (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <CircularProgress size={17} sx={{ color: "rgba(255,255,255,0.8)" }} />
          <span>{loading}</span>
        </Stack>
      ) : children}
    </Button>
  );
}

// ── Secondary/ghost button ─────────────────────────────────────────────────
export function AuthButtonOutlined({ loading, children, ...props }) {
  return (
    <Button
      variant="outlined"
      fullWidth
      disableElevation
      disabled={!!loading}
      sx={{
        fontFamily: FONT_SANS, fontWeight: 500, fontSize: "0.875rem",
        textTransform: "none", borderRadius: "8px", py: 1,
        borderColor: BORDER_COLOR, color: TEXT_SECONDARY,
        "&:hover": { borderColor: TEXT_SECONDARY, bgcolor: "transparent", color: TEXT_PRIMARY },
      }}
      {...props}
    >
      {loading ? (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <CircularProgress size={16} color="inherit" />
          <span>{loading}</span>
        </Stack>
      ) : children}
    </Button>
  );
}

// ── Inline error ───────────────────────────────────────────────────────────
export function AuthError({ message }) {
  if (!message) return null;
  return (
    <Box
      sx={{
        px: 1.75, py: 1,
        borderRadius: "7px",
        bgcolor: "#fef2f2",
        border: "1px solid #fecaca",
      }}
    >
      <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.82rem", color: "#b91c1c", lineHeight: 1.5 }}>
        {message}
      </Typography>
    </Box>
  );
}

// ── Inline success ─────────────────────────────────────────────────────────
export function AuthSuccess({ message }) {
  if (!message) return null;
  return (
    <Box
      sx={{
        px: 1.75, py: 1,
        borderRadius: "7px",
        bgcolor: "#f0fdf4",
        border: "1px solid #bbf7d0",
      }}
    >
      <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.82rem", color: "#15803d", lineHeight: 1.5 }}>
        {message}
      </Typography>
    </Box>
  );
}

// ── Divider text ──────────────────────────────────────────────────────────
export function AuthDivider({ children }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box sx={{ flex: 1, height: "1px", bgcolor: BORDER_COLOR }} />
      {children && (
        <Typography sx={{ fontFamily: FONT_SANS, fontSize: "0.75rem", color: TEXT_MUTED, whiteSpace: "nowrap" }}>
          {children}
        </Typography>
      )}
      <Box sx={{ flex: 1, height: "1px", bgcolor: BORDER_COLOR }} />
    </Stack>
  );
}
