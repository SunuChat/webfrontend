import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import KPICards from "../components/KPICards";
import MapView from "../components/MapView";
import TrendCharts from "../components/TrendCharts";
import MapLayerControls from "../components/MapLayerControls";
import FilterBar from "../components/FilterBar";
import { Box, CircularProgress } from "@mui/material";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("Toutes");
  const [disease, setDisease] = useState("Toutes");
  const [month, setMonth] = useState("Tous");
  
  // État pour la couche administrative de la carte
  // L'état 'infraLayer' est supprimé car la couche d'infrastructure est maintenant gérée statiquement.
  const [adminLayer, setAdminLayer] = useState('regions');
  const [isMapLoading, setIsMapLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Chargement du fichier CSV depuis le dossier public
        const response = await fetch("/data_epi_final.csv");
        const text = await response.text();

        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (result) => {
            const enrichedData = result.data.map((row) => {
              let date, annee, mois;

              // Sécurisation du traitement de la date
              if (row && typeof row.Date === 'string' && row.Date.includes('/')) {
                const parts = row.Date.split("/");
                if (parts.length === 3) {
                  const [day, month, year] = parts;
                  // Vérifier si les parties sont valides avant de créer la date
                  if (day && month && year) {
                     date = new Date(`${year}-${month}-${day}`);
                     // Vérifie si la date est valide
                     if (!isNaN(date.getTime())) { 
                        annee = date.getFullYear().toString();
                        mois = (date.getMonth() + 1).toString().padStart(2, "0");
                     }
                  }
                }
              }

              return {
                ...row,
                Annee: annee || null, // Mettre null si la date est invalide
                Mois: mois || null,
                Cas_confirmes: parseInt(row.Cas_confirmes) || 0,
                Morts: parseInt(row.Morts) || 0,
                Temperature_moy: parseFloat(row.Temperature_moy) || 0,
                Humidite_moy: parseFloat(row.Humidite_moy) || 0,
                Vent_vit_moy: parseFloat(row.Vent_vit_moy) || 0,
                Densite: parseFloat(row.Densite) || 0,
              };
            }).filter(d => d.Annee !== null); // On ne garde que les lignes avec une date valide

            setData(enrichedData);
            setLoading(false);
          },
          error: (error) => {
            console.error("Erreur lors du parsing CSV :", error);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Erreur de chargement des données :", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const filteredData = data.filter((d) => {
    const yearMatch = year === "Toutes" || d.Annee === year;
    const diseaseMatch = disease === "Toutes" || d.Maladie === disease;
    const monthMatch = month === "Tous" || d.Mois === month;
    return yearMatch && diseaseMatch && monthMatch;
  });
  return (
    <Box paddingX={5}>
      <div className="main-container">
        <FilterBar
          data={data}
          year={year}
          setYear={setYear}
          disease={disease}
          setDisease={setDisease}
          month={month}
          setMonth={setMonth}
        />
        <KPICards
          data={filteredData}
          selectedYear={year}
          selectedDisease={disease}
          selectedMonth={month}
        />
        <MapLayerControls
          adminLayer={adminLayer}
          setAdminLayer={setAdminLayer}
          isLoading={isMapLoading}
        />
        <MapView
          data={filteredData}
          adminLayer={adminLayer}
          isLoading={isMapLoading}
          setIsLoading={setIsMapLoading}
        />
        <TrendCharts
          data={filteredData}
          selectedYear={year}
          selectedDisease={disease}
        />
      </div>
    </Box>
  );
};

export default Dashboard;
