import { Box, Button, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Box>
        <ErrorOutlineIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />

        <Typography variant="h3" fontWeight="bold" gutterBottom>
          404
        </Typography>

        <Typography variant="h6" color="text.secondary" mb={3}>
          Oups… la page que vous cherchez n’existe pas.
        </Typography>

        <Button variant="contained" size="large" onClick={() => navigate("/")}>
          Retour à l’accueil
        </Button>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
