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
  SmartToy as BotIcon,
  Person as PersonIcon,
  Clear as ClearIcon,
  AutoAwesome as AIIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import superIntelligentAI from '../services/superIntelligentAI';

// Composant pour rendre le markdown/formatage
function FormattedMessage({ content }) {
  const formatContent = (text) => {
    // Remplacer les éléments de formatage par des composants React
    const lines = text.split('\n');
    const elements = [];
    
    lines.forEach((line, index) => {
      if (line.trim() === '') {
        elements.push(<br key={index} />);
        return;
      }
      
      // Titres avec émojis
      if (line.includes('**') && (line.includes('🚨') || line.includes('⚠️') || line.includes('🔬') || line.includes('📊'))) {
        const cleanLine = line.replace(/\*\*/g, '');
        let severity = 'info';
        let icon = <InfoIcon />;
        
        if (line.includes('🚨')) {
          severity = 'error';
          icon = <ErrorIcon />;
        } else if (line.includes('⚠️')) {
          severity = 'warning';
          icon = <WarningIcon />;
        } else if (line.includes('✅') || line.includes('🎯')) {
          severity = 'success';
          icon = <SuccessIcon />;
        }
        
        elements.push(
          <Alert 
            key={index} 
            severity={severity} 
            icon={icon}
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            {cleanLine}
          </Alert>
        );
        return;
      }
      
      // Titres normaux en gras
      if (line.includes('**') && !line.startsWith('•') && !line.startsWith('➡️')) {
        const cleanLine = line.replace(/\*\*/g, '');
        elements.push(
          <Typography 
            key={index} 
            variant="h6" 
            sx={{ fontWeight: 'bold', color: 'primary.main', mt: 2, mb: 1 }}
          >
            {cleanLine}
          </Typography>
        );
        return;
      }
      
      // Étapes numérotées
      if (line.match(/^\*\*Étape \d+\*\*/)) {
        const cleanLine = line.replace(/\*\*/g, '');
        elements.push(
          <Card key={index} variant="outlined" sx={{ mb: 1, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent sx={{ py: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {cleanLine}
              </Typography>
            </CardContent>
          </Card>
        );
        return;
      }
      
      // Listes à puces
      if (line.startsWith('•')) {
        elements.push(
          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5, ml: 2 }}>
            <Typography variant="body2" sx={{ mr: 1, color: 'primary.main', fontWeight: 'bold' }}>
              •
            </Typography>
            <Typography variant="body2">
              {line.substring(1).trim()}
            </Typography>
          </Box>
        );
        return;
      }
      
      // Actions importantes
      if (line.startsWith('➡️')) {
        elements.push(
          <Box 
            key={index} 
            sx={{ 
              bgcolor: 'error.light', 
              color: 'error.contrastText', 
              p: 2, 
              borderRadius: 2, 
              mb: 2,
              border: '2px solid',
              borderColor: 'error.main'
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {line}
            </Typography>
          </Box>
        );
        return;
      }
      
      // Numérotation d'actions
      if (line.match(/^\d+\./)) {
        elements.push(
          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <Chip 
              label={line.split('.')[0]} 
              size="small" 
              color="secondary" 
              sx={{ mr: 1, minWidth: '24px' }}
            />
            <Typography variant="body2">
              {line.substring(line.indexOf('.') + 1).trim()}
            </Typography>
          </Box>
        );
        return;
      }
      
      // Texte normal
      if (line.trim()) {
        // Gérer le texte en italique
        if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
          elements.push(
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ fontStyle: 'italic', color: 'text.secondary', mb: 1 }}
            >
              {line.replace(/^\*|\*$/g, '')}
            </Typography>
          );
        } else {
          elements.push(
            <Typography key={index} variant="body2" sx={{ mb: 1 }}>
              {line}
            </Typography>
          );
        }
      }
    });
    
    return elements;
  };

  return (
    <Box>
      {formatContent(content)}
    </Box>
  );
}

function AdvancedChatbot() {
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // S'abonner aux changements de la super IA
    const unsubscribe = superIntelligentAI.addListener((data) => {
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
      console.log('Starting SUPER AI conversation...');
      superIntelligentAI.startConversation();
      setIsFirstOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        console.log('Sending message to SUPER AI:', message.trim());
        await superIntelligentAI.processUserMessage(message.trim());
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        superIntelligentAI.addMessage('bot', '🔧 Désolé, j\'ai rencontré un problème technique. Pouvez-vous réessayer ?');
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const cleanSuggestion = suggestion.replace('💡 ', '');
    superIntelligentAI.processUserMessage(cleanSuggestion);
  };

  const handleQuickQuestion = (question) => {
    superIntelligentAI.processUserMessage(question);
  };

  const handleClearConversation = () => {
    superIntelligentAI.clearConversation();
    superIntelligentAI.startConversation();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickQuestions = superIntelligentAI.getFrequentQuestions();

  return (
    <>
      {/* Bouton flottant avec animation */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: 'linear-gradient(45deg, #6a1b9a, #3f51b5)',
          '&:hover': {
            background: 'linear-gradient(45deg, #4a148c, #303f9f)',
            transform: 'scale(1.1)',
            boxShadow: '0 8px 25px rgba(106, 27, 154, 0.4)'
          },
          transition: 'all 0.3s ease',
          animation: 'pulse 2s infinite'
        }}
        onClick={handleOpen}
      >
        <AIIcon />
      </Fab>

      {/* Dialog du chatbot avancé */}
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
            background: 'linear-gradient(45deg, #6a1b9a, #3f51b5)',
            color: 'white',
            py: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AIIcon sx={{ animation: 'rotate 2s linear infinite' }} />
            <Typography variant="h6">Assistant CardioAI Super-Intelligent</Typography>
            <Chip
              label="🧠 SUPER IA"
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
                animation: 'pulse 2s infinite'
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
                <AIIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  🧠 Assistant Super-Intelligent
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Compréhension contextuelle • NLP avancé • Réponses personnalisées
                </Typography>
                
                {/* Questions rapides avec style */}
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Questions fréquentes :
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 1 }}>
                  {quickQuestions.slice(0, 4).map((question, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuickQuestion(question)}
                      sx={{ 
                        textTransform: 'none',
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: 'primary.light',
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
                      bgcolor: conv.sender === 'user' ? 'primary.main' : 'secondary.main',
                      boxShadow: 2
                    }}
                  >
                    {conv.sender === 'user' ? <PersonIcon /> : <AIIcon />}
                  </Avatar>
                  
                  {conv.type === 'suggestion' ? (
                    <Chip
                      label={conv.content}
                      onClick={() => handleSuggestionClick(conv.content)}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: 'info.light',
                        color: 'info.contrastText',
                        '&:hover': { 
                          bgcolor: 'info.main',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ) : (
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
                        '&::before': conv.sender === 'bot' ? {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: -8,
                          width: 0,
                          height: 0,
                          borderTop: '8px solid white',
                          borderLeft: '8px solid transparent'
                        } : {}
                      }}
                    >
                      {conv.sender === 'user' ? (
                        <Typography variant="body1">
                          {conv.content}
                        </Typography>
                      ) : (
                        <FormattedMessage content={conv.content} />
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
                  )}
                </Box>
              </Box>
            ))}

            {/* Indicateur de frappe avancé */}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}>
                  <AIIcon />
                </Avatar>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 3,
                    borderTopLeftRadius: 0.5
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                      IA en train d'analyser et de formuler une réponse...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Zone de saisie améliorée */}
          <Box sx={{ p: 2, bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Posez votre question à l'IA..."
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
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 48,
                  height: 48,
                  '&:hover': { 
                    bgcolor: 'primary.dark',
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

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(106, 27, 154, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(106, 27, 154, 0); }
          100% { box-shadow: 0 0 0 0 rgba(106, 27, 154, 0); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export default AdvancedChatbot;
