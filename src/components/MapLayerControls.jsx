import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import PropTypes from "prop-types";

/**
 * Configuration centralisée pour les différentes couches de la carte.
 * Chaque couche a un nom, un chemin vers son fichier GeoJSON, un type (polygone ou point),
 * et des propriétés pour faire la liaison avec les données CSV.
 * - keyProp: La propriété dans le GeoJSON utilisée comme identifiant unique.
 * - nameProp: La propriété dans le GeoJSON qui contient le nom affichable de la zone.
 * - dataCol: Le nom de la colonne dans le fichier CSV qui correspond à cette couche.
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
    departments: {
      name: "Départements",
      path: "/delimitations_sen/Sen_departements.geojson",
      type: "polygon",
      keyProp: "NOM",
      nameProp: "NOM",
      dataCol: "Departement",
    },
    districts: {
      name: "Districts",
      path: "/delimitations_sen/Sen_districts.geojson",
      type: "polygon",
      keyProp: "NAME",
      nameProp: "NAME",
      dataCol: "District",
    },
    communes: {
      name: "Communes",
      path: "/delimitations_sen/Sen_communes.geojson",
      type: "polygon",
      keyProp: "NAME_4",
      nameProp: "NAME_4",
      dataCol: "Commune",
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
 * de choisir la couche administrative à afficher (Régions, Départements, etc.).
 *
 * @param {string} adminLayer - La clé de la couche administrative actuellement sélectionnée (ex: 'regions').
 * @param {function} setAdminLayer - La fonction pour mettre à jour la couche administrative.
 * @param {boolean} isLoading - Indique si une couche de la carte est en cours de chargement, pour désactiver les contrôles.
 */
const MapLayerControls = ({ adminLayer, setAdminLayer, isLoading }) => {
  /**
   * Gère le changement de la couche administrative.
   * La valeur provient de l'événement du `Select` de Material-UI.
   * @param {object} event - L'événement de changement du sélecteur.
   */
  const handleAdminLayerChange = (event) => {
    setAdminLayer(event.target.value);
  };

  return (
    <Paper
      elevation={2}
      sx={{ p: 2, mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}
    >
      <Box sx={{ flexBasis: "100%" }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Options de la Carte
        </Typography>
      </Box>

      {/* Sélecteur pour la couche de découpage administratif */}
      <FormControl sx={{ minWidth: 240, flexGrow: 1 }} disabled={isLoading}>
        <InputLabel id="admin-layer-select-label">
          Niveau d'analyse géographique
        </InputLabel>
        <Select
          labelId="admin-layer-select-label"
          value={adminLayer}
          onChange={handleAdminLayerChange}
          label="Niveau d'analyse géographique"
        >
          {/*
           * Itération sur les clés de l'objet `LAYER_CONFIG.admin` pour créer dynamiquement
           * les options (MenuItem) du sélecteur.
           * `Object.entries` renvoie un tableau de paires [clé, valeur].
           * Par exemple : ['regions', { name: 'Régions', ... }]
           */}
          {Object.entries(LAYER_CONFIG.admin).map(([key, config]) => (
            <MenuItem key={key} value={key}>
              {config.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

/**
 * Définition des PropTypes pour le composant MapLayerControls.
 * Cela permet de s'assurer que les props passées au composant sont du bon type,
 * ce qui aide à la détection précoce des bugs et à la documentation du composant.
 * - adminLayer: Doit être une chaîne de caractères et est requis.
 * - setAdminLayer: Doit être une fonction et est requise.
 * - isLoading: Doit être un booléen et est requis.
 */
MapLayerControls.propTypes = {
  adminLayer: PropTypes.string.isRequired,
  setAdminLayer: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

// Exporte le composant pour qu'il puisse être utilisé dans d'autres parties de l'application.
export default MapLayerControls;
