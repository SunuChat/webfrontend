import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" py={4} bgcolor="#f5f5f5" textAlign="center">
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} SunuChat – Tous droits réservés.
      </Typography>
    </Box>
  );
}
