import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './App.css';

// Pages - Version hybride stable
import Home from './pages/Home';
import About from './pages/About';
import ModeSelection from './pages/ModeSelection';
import SimpleIoTMonitoring from './pages/SimpleIoTMonitoring';
import SimpleSettings from './pages/SimpleSettings';
import Test from './pages/Test';
import DiagnosticAI from './pages/DiagnosticAI';
import SessionHistory from './pages/SessionHistory';

// Components - Version hybride stable
import SimpleHeader from './components/SimpleHeader';
import SimpleFooter from './components/SimpleFooter';
import Layout from './components/Layout';
import TopNotificationBar from './components/TopNotificationBar';
import AzureHealthChatbot from './components/AzureHealthChatbot';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Indigo
      light: '#757de8',
      dark: '#002984',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00bcd4', // Cyan
      light: '#62efff',
      dark: '#008ba3',
      contrastText: '#000',
    },
    error: {
      main: '#f44336', // Rouge
    },
    warning: {
      main: '#ff9800', // Orange
    },
    info: {
      main: '#2196f3', // Bleu clair
    },
    success: {
      main: '#4caf50', // Vert
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #00bcd4 30%, #4dd0e1 90%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.05)',
        },
        elevation1: {
          boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.05)',
        },
        elevation3: {
          boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <div className="app">
            <TopNotificationBar />
            <SimpleHeader />
            <main className="main-content" style={{ width: '100vw', padding: 0, margin: 0, maxWidth: 'none' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mode-selection" element={<ModeSelection />} />
                <Route path="/diagnostic" element={<DiagnosticAI />} />
                <Route path="/iot-monitoring" element={<SimpleIoTMonitoring />} />
                <Route path="/session-history" element={<SessionHistory />} />
                <Route path="/settings" element={<SimpleSettings />} />
                <Route path="/about" element={<About />} />
                <Route path="/test" element={<Test />} />
              </Routes>
            </main>
            <SimpleFooter />
          </div>
          <AzureHealthChatbot />
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
