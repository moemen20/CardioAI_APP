import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Typography,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  Button,
  Divider,
  Tooltip,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  LocalHospital as HealthIcon,
  Person as PersonIcon,
  Clear as ClearIcon,
  HealthAndSafety as MedicalIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import enrichedChatbotService from '../services/enrichedChatbotService';

// Composant pour rendre les réponses médicales formatées
function MedicalMessage({ content }) {
  const formatMedicalContent = (text) => {
    const lines = text.split('\n');
    const elements = [];
    
    lines.forEach((line, index) => {
      if (line.trim() === '') {
        elements.push(<br key={index} />);
        return;
      }
      
      // Urgences médicales
      if (line.includes('🚨') || line.includes('URGENCE')) {
        elements.push(
          <Alert 
            key={index} 
            severity="error" 
            icon={<ErrorIcon />}
            sx={{ mb: 2, fontWeight: 'bold', bgcolor: '#ffebee' }}
          >
            {line.replace(/🚨/g, '')}
          </Alert>
        );
        return;
      }
      
      // Actions immédiates
      if (line.includes('➡️') || line.includes('APPELEZ')) {
        elements.push(
          <Card 
            key={index} 
            sx={{ 
              mb: 2, 
              bgcolor: 'error.main', 
              color: 'error.contrastText',
              border: '3px solid #d32f2f'
            }}
          >
            <CardContent sx={{ py: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {line.replace('➡️', '🚨')}
              </Typography>
            </CardContent>
          </Card>
        );
        return;
      }
      
      // Titres avec émojis médicaux
      if (line.includes('**') && (line.includes('🩺') || line.includes('💓') || line.includes('🫀') || line.includes('📊'))) {
        const cleanLine = line.replace(/\*\*/g, '');
        let severity = 'info';
        let bgcolor = 'primary.light';
        
        if (line.includes('🚨') || line.includes('🔴')) {
          severity = 'error';
          bgcolor = 'error.light';
        } else if (line.includes('⚠️') || line.includes('🟡')) {
          severity = 'warning';
          bgcolor = 'warning.light';
        } else if (line.includes('✅') || line.includes('🟢')) {
          severity = 'success';
          bgcolor = 'success.light';
        }
        
        elements.push(
          <Card 
            key={index} 
            variant="outlined" 
            sx={{ mb: 2, bgcolor, borderLeft: '4px solid', borderLeftColor: `${severity}.main` }}
          >
            <CardContent sx={{ py: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: `${severity}.dark` }}>
                {cleanLine}
              </Typography>
            </CardContent>
          </Card>
        );
        return;
      }
      
      // Étapes numérotées médicales
      if (line.match(/^\d+\./)) {
        elements.push(
          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <Chip 
              label={line.split('.')[0]} 
              size="small" 
              color="primary" 
              sx={{ mr: 1, minWidth: '32px', fontWeight: 'bold' }}
            />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {line.substring(line.indexOf('.') + 1).trim()}
            </Typography>
          </Box>
        );
        return;
      }
      
      // Listes à puces médicales
      if (line.startsWith('•')) {
        const content = line.substring(1).trim();
        let color = 'text.primary';
        let icon = '•';
        
        if (content.includes('URGENCE') || content.includes('APPELEZ')) {
          color = 'error.main';
          icon = '🚨';
        } else if (content.includes('Consultation') || content.includes('médecin')) {
          color = 'warning.main';
          icon = '👨‍⚕️';
        } else if (content.includes('Normal') || content.includes('Excellent')) {
          color = 'success.main';
          icon = '✅';
        }
        
        elements.push(
          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5, ml: 1 }}>
            <Typography variant="body2" sx={{ mr: 1, color, fontWeight: 'bold', minWidth: '20px' }}>
              {icon}
            </Typography>
            <Typography variant="body2" sx={{ color }}>
              {content}
            </Typography>
          </Box>
        );
        return;
      }
      
      // Valeurs médicales avec couleurs
      if (line.includes('🟢') || line.includes('🟡') || line.includes('🔴')) {
        let severity = 'info';
        if (line.includes('🟢')) severity = 'success';
        if (line.includes('🟡')) severity = 'warning';
        if (line.includes('🔴')) severity = 'error';
        
        elements.push(
          <Alert 
            key={index} 
            severity={severity}
            sx={{ mb: 1, '& .MuiAlert-message': { fontWeight: 'medium' } }}
          >
            {line.replace(/🟢|🟡|🔴/g, '')}
          </Alert>
        );
        return;
      }
      
      // Texte normal
      if (line.trim()) {
        elements.push(
          <Typography key={index} variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
            {line}
          </Typography>
        );
      }
    });
    
    return elements;
  };

  return (
    <Box>
      {formatMedicalContent(content)}
    </Box>
  );
}

function AzureHealthChatbot() {
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // S'abonner aux changements du chatbot enrichi
    const unsubscribe = enrichedChatbotService.addListener((data) => {
      setConversations(data.conversations);
      setIsTyping(data.isTyping);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Auto-scroll vers le bas
    scrollToBottom();
  }, [conversations, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpen = () => {
    setOpen(true);
    if (isFirstOpen) {
      console.log('Starting Enriched Chatbot conversation...');
      enrichedChatbotService.startConversation();
      setIsFirstOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        console.log('Sending message to Enriched Chatbot:', message.trim());
        await enrichedChatbotService.processUserMessage(message.trim());
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        enrichedChatbotService.addMessage('bot', '🔧 Désolé, j\'ai rencontré un problème technique. Pouvez-vous réessayer ?');
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (question) => {
    enrichedChatbotService.processUserMessage(question);
  };

  const handleClearConversation = () => {
    enrichedChatbotService.clearConversation();
    enrichedChatbotService.startConversation();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickQuestions = enrichedChatbotService.getFrequentQuestions();

  return (
    <>
      {/* Bouton flottant médical */}
      <Fab
        color="primary"
        aria-label="health-chat"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: 'linear-gradient(45deg, #2e7d32, #1976d2)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1b5e20, #1565c0)',
            transform: 'scale(1.1)',
            boxShadow: '0 8px 25px rgba(46, 125, 50, 0.4)'
          },
          transition: 'all 0.3s ease',
          animation: 'heartbeat 2s infinite'
        }}
        onClick={handleOpen}
      >
        <MedicalIcon />
      </Fab>

      {/* Dialog du chatbot médical */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            maxHeight: '700px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(45deg, #2e7d32, #1976d2)',
            color: 'white',
            py: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MedicalIcon sx={{ animation: 'pulse 2s infinite' }} />
            <Typography variant="h6">Assistant Santé Cardiaque</Typography>
            <Chip
              label="📚 Base Enrichie"
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
          <Box>
            <Tooltip title="Nouvelle conversation">
              <IconButton
                color="inherit"
                onClick={handleClearConversation}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
            <IconButton color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
          {/* Zone de messages */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              bgcolor: 'grey.50'
            }}
          >
            {conversations.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <MedicalIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  📚 Assistant CardioAI Enrichi
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Base de connaissances validée • Réponses précises • Expertise cardiaque
                </Typography>

                {/* Exemple de conversation en gris */}
                <Box sx={{ mb: 4, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: 'grey.600', fontStyle: 'italic', mb: 1 }}>
                    💬 Exemple de conversation :
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.500', fontSize: '0.8rem', mb: 0.5 }}>
                    👤 Vous: "J'ai une douleur thoracique depuis 30 minutes, que faire ?"
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.500', fontSize: '0.8rem', mb: 0 }}>
                    🤖 Assistant: "🚨 URGENCE MÉDICALE - Appelez immédiatement le SAMU (15) ou les pompiers (18)."
                  </Typography>
                </Box>

                {/* Questions rapides médicales */}
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Questions fréquentes :
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1 }}>
                  {quickQuestions.slice(0, 4).map((question, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuickQuestion(question)}
                      sx={{ 
                        textTransform: 'none',
                        borderRadius: 2,
                        borderColor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'white'
                        }
                      }}
                    >
                      {question}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            {conversations.map((conv) => (
              <Box
                key={conv.id}
                sx={{
                  display: 'flex',
                  justifyContent: conv.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    maxWidth: '85%',
                    flexDirection: conv.sender === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: conv.sender === 'user' ? 'primary.main' : 'success.main',
                      boxShadow: 2
                    }}
                  >
                    {conv.sender === 'user' ? <PersonIcon /> : <MedicalIcon />}
                  </Avatar>
                  
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      bgcolor: conv.sender === 'user' ? 'primary.main' : 'white',
                      color: conv.sender === 'user' ? 'white' : 'text.primary',
                      borderRadius: 3,
                      borderTopLeftRadius: conv.sender === 'user' ? 3 : 0.5,
                      borderTopRightRadius: conv.sender === 'user' ? 0.5 : 3,
                      maxWidth: '100%',
                      position: 'relative',
                      border: conv.sender === 'bot' ? '1px solid #e0e0e0' : 'none'
                    }}
                  >
                    {conv.sender === 'user' ? (
                      <Typography variant="body1">
                        {conv.content}
                      </Typography>
                    ) : (
                      <MedicalMessage content={conv.content} />
                    )}
                    
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 1,
                        opacity: 0.7,
                        fontSize: '0.7rem',
                        textAlign: conv.sender === 'user' ? 'right' : 'left'
                      }}
                    >
                      {formatTime(conv.timestamp)}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))}

            {/* Indicateur de frappe médical */}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'success.main' }}>
                  <MedicalIcon />
                </Avatar>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 3,
                    borderTopLeftRadius: 0.5,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={20} color="success" />
                    <Typography variant="body2" color="text.secondary">
                      Assistant médical en train d'analyser...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Zone de saisie médicale */}
          <Box sx={{ p: 2, bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Décrivez vos symptômes ou posez votre question médicale..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                disabled={isTyping}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'grey.50'
                  }
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                sx={{
                  bgcolor: 'success.main',
                  color: 'white',
                  width: 48,
                  height: 48,
                  '&:hover': { 
                    bgcolor: 'success.dark',
                    transform: 'scale(1.1)'
                  },
                  '&:disabled': { 
                    bgcolor: 'grey.300',
                    transform: 'none'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Styles CSS pour les animations médicales */}
      <style jsx>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.1); }
          28% { transform: scale(1); }
          42% { transform: scale(1.1); }
          70% { transform: scale(1); }
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default AzureHealthChatbot;
