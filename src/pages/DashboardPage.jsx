import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import KPICards from "../components/KPICards";
import MapView from "../components/MapView";
import TrendCharts from "../components/TrendCharts";
import RegionModal from "../components/RegionModal";
import FilterBar from "../components/FilterBar";
import { Box } from "@mui/material";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("Toutes");
  const [disease, setDisease] = useState("Toutes");
  const [month, setMonth] = useState("Tous");

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
              // Conversion de la date au format jj/mm/aaaa

              const [day, month, year] = row?.Date?.split("/");
              const date = new Date(`${year}-${month}-${day}`);

              return {
                ...row,
                Annee: date.getFullYear().toString(),
                Mois: (date.getMonth() + 1).toString().padStart(2, "0"),
                Cas_confirmes: parseInt(row.Cas_confirmes) || 0,
                Morts: parseInt(row.Morts) || 0,
                Temperature_moy: parseFloat(row.Temperature_moy) || 0,
                Humidite_moy: parseFloat(row.Humidite_moy) || 0,
                Vent_vit_moy: parseFloat(row.Vent_vit_moy) || 0,
                Densite: parseFloat(row.Densite) || 0,
              };
            });

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
      <div className="main-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "1.5rem",
            color: "#374151",
          }}
        >
          Chargement des données....
        </div>
      </div>
    );
  }

  const filteredData = data.filter((d) => {
    const yearMatch = year === "Toutes" || d.Annee === year;
    const diseaseMatch = disease === "Toutes" || d.Maladie === disease;
    const monthMatch = month === "Tous" || d.Mois === month;
    return yearMatch && diseaseMatch && monthMatch;
  });

  const selectedData = filteredData
    .slice()
    .reverse()
    .find((d) => d.Region === selectedRegion);

  return (
    <Box paddingX={5}>
      <div className="main-container">
        <FilterBar
          data={data}
          selectedYear={year}
          setSelectedYear={setYear}
          selectedDisease={disease}
          setSelectedDisease={setDisease}
          selectedMonth={month}
          setSelectedMonth={setMonth}
        />
        <KPICards
          data={filteredData}
          selectedYear={year}
          selectedDisease={disease}
          selectedMonth={month}
        />
        <MapView
          data={filteredData}
          selectedYear={year}
          selectedDisease={disease}
          selectedMonth={month}
          onRegionClick={setSelectedRegion}
        />
        <TrendCharts
          data={filteredData}
          selectedYear={year}
          selectedDisease={disease}
        />
        {selectedRegion && (
          <RegionModal
            data={selectedData}
            onClose={() => setSelectedRegion(null)}
          />
        )}
      </div>
    </Box>
  );
};

export default Dashboard;
