import { Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

function FloatingIcons() {
  const icons = [
    { Icon: FavoriteIcon, color: '#f44336', delay: '0s', top: '10%', left: '5%' },
    { Icon: HealthAndSafetyIcon, color: '#3f51b5', delay: '1s', top: '20%', right: '10%' },
    { Icon: PsychologyIcon, color: '#00bcd4', delay: '2s', top: '60%', left: '8%' },
    { Icon: MonitorHeartIcon, color: '#9c27b0', delay: '3s', top: '70%', right: '5%' },
    { Icon: LocalHospitalIcon, color: '#4caf50', delay: '4s', top: '40%', left: '3%' },
  ];

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0
      }}
    >
      {icons.map(({ Icon, color, delay, ...position }, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            ...position,
            animation: `float 6s ease-in-out infinite`,
            animationDelay: delay,
            opacity: 0.1,
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translateY(0px) rotate(0deg)',
              },
              '33%': {
                transform: 'translateY(-20px) rotate(120deg)',
              },
              '66%': {
                transform: 'translateY(-10px) rotate(240deg)',
              }
            }
          }}
        >
          <Icon
            sx={{
              fontSize: 40,
              color: color,
              filter: 'blur(1px)'
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

export default FloatingIcons;
