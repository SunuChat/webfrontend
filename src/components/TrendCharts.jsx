import React, { useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
} from 'chart.js';

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

const TrendCharts = ({ data, selectedYear, selectedDisease }) => {
  // Préparation des données pour les graphiques
  const chartData = useMemo(() => {
    // Tendance mensuelle des cas
    const monthlyData = data.reduce((acc, curr) => {
      const month = curr.Mois;
      if (!acc[month]) {
        acc[month] = {
          cases: 0,
          deaths: 0,
          temperature: [],
          humidity: []
        };
      }
      acc[month].cases += curr.Cas_confirmes;
      acc[month].deaths += curr.Morts;
      acc[month].temperature.push(curr.Temperature_moy);
      acc[month].humidity.push(curr.Humidite_moy);
      return acc;
    }, {});

    // Tendance par région
    const regionalData = data.reduce((acc, curr) => {
      const region = curr.Region;
      if (!acc[region]) {
        acc[region] = {
          cases: 0,
          deaths: 0,
          density: curr.Densite
        };
      }
      acc[region].cases += curr.Cas_confirmes;
      acc[region].deaths += curr.Morts;
      return acc;
    }, {});

    return {
      monthly: monthlyData,
      regional: regionalData
    };
  }, [data]);

  // Configuration des graphiques
  const monthlyCasesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tendance mensuelle des cas confirmés',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre de cas'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Mois'
        }
      }
    }
  };

  const monthlyCasesData = {
    labels: Object.keys(chartData.monthly).sort(),
    datasets: [
      {
        label: 'Cas confirmés',
        data: Object.keys(chartData.monthly).sort().map(month => chartData.monthly[month].cases),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const regionalComparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Comparaison des cas par région',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre de cas'
        }
      }
    }
  };

  const regionalComparisonData = {
    labels: Object.keys(chartData.regional),
    datasets: [
      {
        label: 'Cas confirmés',
        data: Object.values(chartData.regional).map(region => region.cases),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ]
  };

  const regionalDeathsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Comparaison des décès par région',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre de décès'
        }
      }
    }
  };

  const regionalDeathsData = {
    labels: Object.keys(chartData.regional),
    datasets: [
      {
        label: 'Décès',
        data: Object.values(chartData.regional).map(region => region.deaths),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  };

  const environmentalFactorsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Facteurs environnementaux moyens par mois',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valeur'
        }
      }
    }
  };

  const environmentalFactorsData = {
    labels: Object.keys(chartData.monthly).sort(),
    datasets: [
      {
        label: 'Température moyenne (°C)',
        data: Object.keys(chartData.monthly).sort().map(month => {
          const temps = chartData.monthly[month].temperature;
          return temps.reduce((a, b) => a + b, 0) / temps.length;
        }),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'Humidité moyenne (%)',
        data: Object.keys(chartData.monthly).sort().map(month => {
          const hums = chartData.monthly[month].humidity;
          return hums.reduce((a, b) => a + b, 0) / hums.length;
        }),
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      }
    ]
  };

  const containerStyle = {
    width: '95%',
    margin: '2rem auto',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const rowStyle = {
    display: 'flex',
    gap: '2rem',
    marginBottom: '2rem'
  };

  const chartContainerStyle = {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.5rem',
    height: '400px'
  };

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        <div style={chartContainerStyle}>
          <Line options={monthlyCasesOptions} data={monthlyCasesData} />
        </div>
        <div style={chartContainerStyle}>
          <Line options={environmentalFactorsOptions} data={environmentalFactorsData} />
        </div>
      </div>
      <div style={rowStyle}>
        <div style={chartContainerStyle}>
          <Bar options={regionalComparisonOptions} data={regionalComparisonData} />
        </div>
        <div style={chartContainerStyle}>
          <Bar options={regionalDeathsOptions} data={regionalDeathsData} />
        </div>
      </div>
    </div>
  );
};

export default TrendCharts; 