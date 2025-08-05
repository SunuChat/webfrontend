import React, { useMemo } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TrendCharts = ({ data }) => {
  const chartData = useMemo(() => {
    const monthlyData = data.reduce((acc, curr) => {
      const month = curr.Mois;
      if (!acc[month]) {
        acc[month] = {
          cases: 0,
          deaths: 0,
          temperature: [],
          humidity: [],
        };
      }
      acc[month].cases += curr.Cas_confirmes;
      acc[month].deaths += curr.Morts;
      acc[month].temperature.push(curr.Temperature_moy);
      acc[month].humidity.push(curr.Humidite_moy);
      return acc;
    }, {});

    const regionalData = data.reduce((acc, curr) => {
      const region = curr.Region;
      if (!acc[region]) {
        acc[region] = { cases: 0, deaths: 0 };
      }
      acc[region].cases += curr.Cas_confirmes;
      acc[region].deaths += curr.Morts;
      return acc;
    }, {});

    return { monthly: monthlyData, regional: regionalData };
  }, [data]);

  const months = Object.keys(chartData.monthly).sort();
  const regions = Object.keys(chartData.regional);

  const monthlyCasesData = {
    labels: months,
    datasets: [
      {
        label: "Cas confirmés",
        data: months.map((m) => chartData.monthly[m].cases),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const environmentalFactorsData = {
    labels: months,
    datasets: [
      {
        label: "Température moyenne (°C)",
        data: months.map(
          (m) =>
            chartData.monthly[m].temperature.reduce((a, b) => a + b, 0) /
            chartData.monthly[m].temperature.length
        ),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "Humidité moyenne (%)",
        data: months.map(
          (m) =>
            chartData.monthly[m].humidity.reduce((a, b) => a + b, 0) /
            chartData.monthly[m].humidity.length
        ),
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  };

  const regionalComparisonData = {
    labels: regions,
    datasets: [
      {
        label: "Cas confirmés",
        data: regions.map((r) => chartData.regional[r].cases),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const regionalDeathsData = {
    labels: regions,
    datasets: [
      {
        label: "Décès",
        data: regions.map((r) => chartData.regional[r].deaths),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const baseOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: title },
    },
    scales: {
      y: { beginAtZero: true },
    },
  });

  return (
    <div
      style={{
        margin: "2rem auto",
        padding: "1rem",
        backgroundColor: "white",
        borderRadius: "1rem",
        boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
        maxWidth: "1300px",
      }}
    >
      {/* Première ligne */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          marginBottom: "2rem",
          justifyContent: "center",
        }}
      >
        <div style={chartStyle}>
          <Line
            options={baseOptions("Tendance mensuelle des cas confirmés")}
            data={monthlyCasesData}
          />
        </div>
        <div style={chartStyle}>
          <Line
            options={baseOptions("Facteurs environnementaux moyens par mois")}
            data={environmentalFactorsData}
          />
        </div>
      </div>

      {/* Deuxième ligne */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        <div style={chartStyle}>
          <Bar
            options={baseOptions("Comparaison des cas par région")}
            data={regionalComparisonData}
          />
        </div>
        <div style={chartStyle}>
          <Bar
            options={baseOptions("Comparaison des décès par région")}
            data={regionalDeathsData}
          />
        </div>
      </div>
    </div>
  );
};

const chartStyle = {
  flex: "1 1 450px",
  minWidth: "300px",
  height: "400px",
  padding: "1rem",
  backgroundColor: "#f9fafb",
  borderRadius: "12px",
};

export default TrendCharts;
