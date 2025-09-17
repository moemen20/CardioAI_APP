import { Box, Typography, useTheme } from '@mui/material';

function SimpleChart({ 
  data, 
  title, 
  color, 
  unit, 
  height = 200 
}) {
  const theme = useTheme();
  
  // Vérifier que les données existent et sont valides
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

  // Calculer les valeurs min/max pour la mise à l'échelle
  const values = safeData.map(d => d?.value || 0);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  return (
    <Box sx={{ height, position: 'relative', p: 1 }}>
      {/* Titre du graphique */}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        {title} ({unit})
      </Typography>
      
      {/* Graphique simple avec SVG */}
      <Box
        sx={{
          height: height - 40,
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderRadius: 1,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Grille de fond */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Ligne du graphique */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={safeData.map((point, index) => {
              const x = (index / (safeData.length - 1)) * 100;
              const y = 100 - ((point?.value || 0) - minValue) / range * 80 - 10;
              return `${x},${y}`;
            }).join(' ')}
            style={{
              vectorEffect: 'non-scaling-stroke'
            }}
          />
          
          {/* Points sur la ligne */}
          {safeData.map((point, index) => {
            const x = (index / (safeData.length - 1)) * 100;
            const y = 100 - ((point?.value || 0) - minValue) / range * 80 - 10;
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {/* Valeurs min/max */}
        <Box
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            fontSize: '0.7rem',
            color: 'text.secondary'
          }}
        >
          <div>Max: {maxValue.toFixed(1)}</div>
          <div>Min: {minValue.toFixed(1)}</div>
        </Box>
        
        {/* Dernière valeur */}
        <Box
          sx={{
            position: 'absolute',
            left: 8,
            bottom: 8,
            fontSize: '0.8rem',
            fontWeight: 600,
            color: color
          }}
        >
          {safeData.length > 0 ? `${(safeData[safeData.length - 1]?.value || 0).toFixed(1)} ${unit}` : ''}
        </Box>
      </Box>
    </Box>
  );
}

export default SimpleChart;
