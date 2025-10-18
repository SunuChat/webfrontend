import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";

/**
 * Configuration centralisée pour les différentes couches de la carte.
 * MODIFIÉ : La liste des couches administratives a été réduite à Régions et Districts.
 */
export const LAYER_CONFIG = {
  admin: {
    regions: {
      name: "Régions",
      path: "/delimitations_sen/Sen_regions.geojson",
      type: "polygon",
      keyProp: "NOMREG",
      nameProp: "NOMREG",
      dataCol: "Region",
    },
    districts: {
      name: "Districts",
      path: "/delimitations_sen/Sen_districts.geojson",
      type: "polygon",
      keyProp: "NAME",
      nameProp: "NAME",
      dataCol: "District",
    },
  },
  infra: {
    health: {
      name: "Infrastructures sanitaires",
      path: "/delimitations_sen/Sen_infrastructures_san.geojson",
      type: "point",
      nameProp: "Structure",
    },
  },
};
/**
 * Composant pour les contrôles de la carte, permettant à l'utilisateur
 * de choisir la couche à afficher (administrative ou infrastructures) et le niveau d'analyse.
 *
 * @param {string} adminLayer - La clé de la couche administrative sélectionnée (ex: 'regions').
 * @param {function} setAdminLayer - La fonction pour mettre à jour la couche administrative.
 * @param {string} visibleLayerType - La clé de la couche principale active ('admin' ou 'infra').
 * @param {function} setVisibleLayerType - La fonction pour changer la couche principale.
 * @param {boolean} isLoading - Indique si une couche est en cours de chargement.
 */
const MapLayerControls = ({
  adminLayer,
  setAdminLayer,
  visibleLayerType,
  setVisibleLayerType,
  isLoading,
}) => {
  /**
   * Gère le changement de la couche administrative (Régions, Districts).
   * La valeur provient de l'événement du `Select` de Material-UI.
   * @param {object} event - L'événement de changement du sélecteur.
   */
  const handleAdminLayerChange = (event) => {
    setAdminLayer(event.target.value);
  };

  /**
   * Gère le changement du type de couche principale à afficher (Analyse ou Infrastructures).
   * @param {object} event - L'événement de changement du ToggleButtonGroup.
   * @param {string} newLayerType - La nouvelle valeur ('admin' ou 'infra').
   */
  const handleVisibleLayerTypeChange = (event, newLayerType) => {
    // Le ToggleButtonGroup de MUI peut renvoyer null si on reclique sur le bouton actif.
    // On s'assure que la valeur n'est jamais nulle pour qu'un choix soit toujours actif.
    if (newLayerType !== null) {
      setVisibleLayerType(newLayerType);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        flexDirection: "column", // Organise les éléments verticalement
        gap: 2,
      }}
    >
      {/* Sélecteur pour le type de vue (Analyse vs Infrastructures) */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Type de vue
        </Typography>
        <ToggleButtonGroup
          color="primary"
          value={visibleLayerType}
          exclusive
          onChange={handleVisibleLayerTypeChange}
          aria-label="Type de couche à afficher"
          fullWidth
        >
          <ToggleButton value="admin" disabled={isLoading}>
            Analyse (par zone)
          </ToggleButton>
          <ToggleButton value="infra" disabled={isLoading}>
            Infrastructures
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Affiche le sélecteur de niveau géographique uniquement si la vue 'admin' est active */}
      {visibleLayerType === "admin" && (
        <>
          <Divider />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Niveau d'analyse géographique
            </Typography>
            <FormControl fullWidth disabled={isLoading}>
              <InputLabel id="admin-layer-select-label">
                Niveau d'analyse
              </InputLabel>
              <Select
                labelId="admin-layer-select-label"
                value={adminLayer}
                onChange={handleAdminLayerChange}
                label="Niveau d'analyse"
              >
                {/* Itération sur les clés de l'objet `LAYER_CONFIG.admin` pour créer les options */}
                {Object.entries(LAYER_CONFIG.admin).map(([key, config]) => (
                  <MenuItem key={key} value={key}>
                    {config.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </>
      )}
    </Paper>
  );
};

/**
 * Définition des PropTypes pour le composant MapLayerControls.
 * Cela permet de s'assurer que les props passées au composant sont du bon type,
 * ce qui aide à la détection précoce des bugs et à la documentation du composant.
 */
MapLayerControls.propTypes = {
  adminLayer: PropTypes.string.isRequired,
  setAdminLayer: PropTypes.func.isRequired,
  visibleLayerType: PropTypes.string.isRequired,
  setVisibleLayerType: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

// Exporte le composant pour qu'il puisse être utilisé dans d'autres parties de l'application.
export default MapLayerControls;
