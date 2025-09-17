import { useEffect, useRef, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

// Import Chart.js avec gestion d'erreur
let Line = null;
let Chart = null;

try {
  const chartModule = require('react-chartjs-2');
  Line = chartModule.Line;

  const chartJsModule = require('chart.js');
  Chart = chartJsModule.Chart;

  // Enregistrer les composants Chart.js
  const {
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  } = chartJsModule;

  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
} catch (error) {
  console.warn('Chart.js non disponible, utilisation du graphique de fallback');
}

function RealTimeChart({
  data,
  title,
  color,
  unit,
  height = 200,
  showGrid = true,
  animated = true
}) {
  const theme = useTheme();
  const chartRef = useRef();
  const [chartError, setChartError] = useState(false);

  // Si Chart.js n'est pas disponible, utiliser le fallback
  if (!Line || !Chart) {
    return <SimpleFallbackChart data={data} title={title} color={color} unit={unit} height={height} />;
  }

  // Vérifier que les données existent et sont valides
  const safeData = Array.isArray(data) ? data : [];

  const chartData = {
    labels: safeData.map(d => d?.time || ''),
    datasets: [
      {
        label: title,
        data: safeData.map(d => d?.value || 0),
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 3,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: animated ? {
      duration: 750,
      easing: 'easeInOutQuart'
    } : false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: color,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return `${title} - ${context[0].label}`;
          },
          label: function(context) {
            return `${context.parsed.y} ${unit}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: showGrid,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11
          },
          maxTicksLimit: 6
        }
      },
      y: {
        display: showGrid,
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11
          },
          callback: function(value) {
            return `${value} ${unit}`;
          }
        }
      }
    },
    elements: {
      line: {
        borderCapStyle: 'round',
        borderJoinStyle: 'round'
      },
      point: {
        hoverBorderWidth: 3
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  useEffect(() => {
    // Animation d'entrée pour le graphique
    if (chartRef.current && animated) {
      const chart = chartRef.current;
      chart.update('active');
    }
  }, [data, animated]);

  return (
    <Box sx={{ height, position: 'relative' }}>
      {safeData.length === 0 ? (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: 2,
            border: '2px dashed rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="body2">
            Aucune donnée disponible
          </Typography>
        </Box>
      ) : (
        <Line
          ref={chartRef}
          data={chartData}
          options={options}
        />
      )}
    </Box>
  );
}

// Composant de fallback simple
function SimpleFallbackChart({ data, title, color, unit, height }) {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderRadius: 2,
          border: '2px dashed rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography variant="body2">
          Aucune donnée disponible
        </Typography>
      </Box>
    );
  }

  const values = safeData.map(d => d?.value || 0);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const lastValue = values[values.length - 1] || 0;

  return (
    <Box sx={{ height, position: 'relative', p: 1 }}>
      <Box
        sx={{
          height: height - 20,
          backgroundColor: `${color}10`,
          borderRadius: 1,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <Typography variant="h6" sx={{ color, fontWeight: 600 }}>
          {lastValue.toFixed(1)} {unit}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: 4,
            right: 8,
            color: 'text.secondary'
          }}
        >
          {safeData.length} points
        </Typography>
      </Box>
    </Box>
  );
}

export default RealTimeChart;
