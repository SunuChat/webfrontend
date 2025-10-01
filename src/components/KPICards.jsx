import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KPICards = ({ data, selectedYear, selectedDisease, selectedMonth }) => {
  // Utilisation de useMemo pour optimiser les calculs
  const metrics = useMemo(() => {
    // Filtrage des données selon les critères sélectionnés
    const filteredData = data.filter((d) => {
      const yearMatch = selectedYear === "Toutes" || d.Annee === selectedYear;
      const diseaseMatch =
        selectedDisease === "Toutes" || d.Maladie === selectedDisease;
      const monthMatch = selectedMonth === "Tous" || d.Mois === selectedMonth;
      return yearMatch && diseaseMatch && monthMatch;
    });

    const validData_cases = filteredData.filter((d) => !isNaN(d.Cas_confirmes));
    const validData_death = filteredData.filter((d) => !isNaN(d.Morts));

    // Calcul des cas totaux
    const totalCases = validData_cases.reduce(
      (sum, d) => sum + d.Cas_confirmes,
      0
    );

    // Calcul des Morts totaux
    const totalDeath = validData_death.reduce((sum, d) => sum + d.Morts, 0);

    // Calcul des cas par maladie
    const malariaCases = validData_cases
      .filter((d) => d.Maladie === "Paludisme")
      .reduce((s, d) => s + d.Cas_confirmes, 0);

    const dengueCases = validData_cases
      .filter((d) => d.Maladie === "Dengue")
      .reduce((s, d) => s + d.Cas_confirmes, 0);

    // 1. Fonction pour filtrer les valeurs numériques valides
    const getValidValues = (data, field) => {
      return data
        .filter((d) => d != null) // Élimine les éléments null/undefined
        .map((d) => d[field]) // Extrait le champ souhaité (ex: "Temperature_moy")
        .filter((val) => typeof val === "number" && !isNaN(val)); // Garde uniquement les nombres valides
    };

    // 2. Calcul des moyennes (en ignorant les valeurs invalides)
    const validTempValues = getValidValues(validData_cases, "Temperature_moy");
    const avgTemp = validTempValues.length
      ? (
          validTempValues.reduce((s, val) => s + val, 0) /
          validTempValues.length
        ).toFixed(1)
      : "N/A"; // Ou 0 si vous préférez

    const validHumidityValues = getValidValues(validData_cases, "Humidite_moy");
    const avgHumidity = validHumidityValues.length
      ? (
          validHumidityValues.reduce((s, val) => s + val, 0) /
          validHumidityValues.length
        ).toFixed(1)
      : "N/A";

    const validWindValues = getValidValues(validData_cases, "Vent_vit_moy");
    const avgWind = validWindValues.length
      ? (
          validWindValues.reduce((s, val) => s + val, 0) /
          validWindValues.length
        ).toFixed(1)
      : "N/A";

    return {
      totalCases,
      totalDeath,
      malariaCases,
      dengueCases,
      avgTemp,
      avgHumidity,
      avgWind,
    };
  }, [data, selectedYear, selectedDisease, selectedMonth]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const Card = ({ title, value, borderColor, icon }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: 16,
        padding: "1.25rem 1.25rem",
        boxShadow: "0 6px 16px rgba(0,0,0,.08)",
        border: `1px solid rgba(0,0,0,.06)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "0.75rem",
        overflow: "hidden",
        outline: "none",
      }}
    >
      {/* Barre d’accent en haut */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: 4,
          width: "100%",
          background: `linear-gradient(90deg, ${borderColor}, ${borderColor}55)`,
        }}
      />

      {/* Motif décoratif doux */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: 0.08,
          background: `radial-gradient(160px 160px at 110% -20%, ${borderColor}, transparent 70%)`,
        }}
      />

      {/* Icône */}
      <div
        style={{
          fontSize: "2rem",
          color: borderColor,
          background: `${borderColor}15`,
          borderRadius: 12,
          padding: "0.5rem",
          zIndex: 1,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,.12))",
        }}
      >
        {icon}
      </div>

      {/* Titre */}
      <h3
        style={{
          fontSize: "0.85rem",
          color: "#6b7280",
          margin: 0,
          zIndex: 1,
          fontWeight: 600,
          letterSpacing: "0.3px",
          textTransform: "uppercase",
        }}
      >
        {title}
      </h3>

      {/* Valeur */}
      <p
        style={{
          fontSize: "2rem",
          fontWeight: "800",
          margin: 0,
          zIndex: 1,
          background: `linear-gradient(45deg, ${borderColor}, #111827)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1.2,
        }}
      >
        {value}
      </p>
    </motion.div>
  );

  return (
    <AnimatePresence>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <Card
          title="Total des Cas Confirmés"
          value={metrics.totalCases.toLocaleString()}
          borderColor="#3b82f6"
          icon="🏥"
        />
        <Card
          title="Total de Decès"
          value={metrics.totalDeath.toLocaleString()}
          borderColor="#ef77f6"
          icon="🕊️"
        />
        <Card
          title="Cas Paludisme"
          value={metrics.malariaCases.toLocaleString()}
          borderColor="#10b981"
          icon="🦟"
        />
        <Card
          title="Cas Dengue"
          value={metrics.dengueCases.toLocaleString()}
          borderColor="#ef4444"
          icon="🦠"
        />
        <Card
          title="Température Moy. (°C)"
          value={metrics.avgTemp}
          borderColor="#facc15"
          icon="🌡️"
        />
        <Card
          title="Humidité Moy. (%)"
          value={metrics.avgHumidity}
          borderColor="#8b5cf6"
          icon="💧"
        />
        <Card
          title="Vitesse du vent Moy.(m/s)"
          value={metrics.avgWind}
          borderColor="#ec4899"
          icon="🌪️"
        />
      </div>
    </AnimatePresence>
  );
};

export default React.memo(KPICards);
