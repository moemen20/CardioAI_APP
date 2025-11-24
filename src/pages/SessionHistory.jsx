import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import {
  History as HistoryIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import sessionHistoryService from '../services/sessionHistoryService';

function SessionHistory() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [globalStats, setGlobalStats] = useState({});

  useEffect(() => {
    // Charger les sessions et statistiques
    const loadData = () => {
      setSessions(sessionHistoryService.getAllSessions());
      setGlobalStats(sessionHistoryService.getGlobalStats());
    };

    loadData();

    // S'abonner aux changements
    const unsubscribe = sessionHistoryService.addListener(loadData);
    return unsubscribe;
  }, []);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('fr-FR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'interrupted': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'active': return 'En cours';
      case 'interrupted': return 'Interrompue';
      default: return 'Inconnue';
    }
  };

  const handleViewSession = (session) => {
    setSelectedSession(session);
    setDialogOpen(true);
  };

  const handleDeleteSession = (sessionId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
      sessionHistoryService.deleteSession(sessionId);
    }
  };

  const handleExportSession = (sessionId) => {
    const csv = sessionHistoryService.exportSessionToCSV(sessionId);
    if (csv) {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `session_${sessionId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <Box sx={{ width: '100%', margin: 0, maxWidth: 'none' }}>
      <Box sx={{ py: 2, px: 2 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <HistoryIcon fontSize="large" />
          Historique des Sessions
        </Typography>

        {/* Statistiques globales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {globalStats.totalSessions || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sessions totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {formatDuration(globalStats.totalDuration || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Durée totale
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {globalStats.totalReadings || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mesures totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {globalStats.totalAlerts || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Alertes totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Liste des sessions */}
        {sessions.length === 0 ? (
          <Alert severity="info" sx={{ mt: 4 }}>
            Aucune session enregistrée. Démarrez un monitoring IoT pour créer votre première session.
          </Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID Session</TableCell>
                  <TableCell>Date/Heure</TableCell>
                  <TableCell>Durée</TableCell>
                  <TableCell>Mesures</TableCell>
                  <TableCell>Alertes</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {session.id.substring(0, 12)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatDateTime(session.startTime)}
                    </TableCell>
                    <TableCell>
                      {session.status === 'completed' ? formatDuration(session.duration) : '-'}
                    </TableCell>
                    <TableCell>
                      {session.summary.totalReadings}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {session.summary.alertsCount}
                        {session.summary.alertsCount > 0 && <WarningIcon color="warning" fontSize="small" />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(session.status)}
                        color={getStatusColor(session.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewSession(session)}
                          title="Voir détails"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleExportSession(session.id)}
                          title="Exporter CSV"
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteSession(session.id)}
                          title="Supprimer"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Dialog de détails de session */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Détails de la Session
              </Typography>
              <IconButton onClick={() => setDialogOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedSession && (
              <Box>
                {/* Informations générales */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">ID Session:</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {selectedSession.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Statut:</Typography>
                    <Chip
                      label={getStatusLabel(selectedSession.status)}
                      color={getStatusColor(selectedSession.status)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Début:</Typography>
                    <Typography variant="body2">
                      {formatDateTime(selectedSession.startTime)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Fin:</Typography>
                    <Typography variant="body2">
                      {selectedSession.endTime ? formatDateTime(selectedSession.endTime) : 'En cours'}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Résumé des données */}
                <Typography variant="h6" gutterBottom>
                  Résumé des Mesures
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2">Fréquence cardiaque moyenne:</Typography>
                    <Typography variant="body1">{selectedSession.summary.avgHeartRate} BPM</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2">Température moyenne:</Typography>
                    <Typography variant="body1">{selectedSession.summary.avgTemperature}°C</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2">SpO₂ moyenne:</Typography>
                    <Typography variant="body1">{selectedSession.summary.avgOxygenSaturation}%</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2">Tension moyenne:</Typography>
                    <Typography variant="body1">
                      {selectedSession.summary.avgBloodPressure.systolic}/
                      {selectedSession.summary.avgBloodPressure.diastolic}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Alertes */}
                {selectedSession.alerts.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Alertes ({selectedSession.alerts.length})
                    </Typography>
                    <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                      {selectedSession.alerts.map((alert, index) => (
                        <Alert key={index} severity={alert.severity} sx={{ mb: 1 }}>
                          <Typography variant="subtitle2">{alert.title}</Typography>
                          <Typography variant="body2">{alert.message}</Typography>
                          <Typography variant="caption">
                            {formatDateTime(alert.timestamp)}
                          </Typography>
                        </Alert>
                      ))}
                    </Box>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>
              Fermer
            </Button>
            {selectedSession && (
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => handleExportSession(selectedSession.id)}
              >
                Exporter CSV
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default SessionHistory;
