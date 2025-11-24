import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  Button,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Clear as ClearIcon,
  Settings as SettingsIcon,
  AutoAwesome as AIIcon
} from '@mui/icons-material';
import aiChatbotService from '../services/aiChatbotService';
import AIChatbotConfig from './AIChatbotConfig';

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [configOpen, setConfigOpen] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // S'abonner aux changements du chatbot IA
    const unsubscribe = aiChatbotService.addListener((data) => {
      setConversations(data.conversations);
      setIsTyping(data.isTyping);
    });

    // Vérifier si une clé API est configurée
    const savedApiKey = localStorage.getItem('cardioai_openai_key');
    if (savedApiKey) {
      aiChatbotService.setApiKey(savedApiKey);
      setIsAIMode(true);
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    scrollToBottom();
  }, [conversations, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpen = () => {
    setOpen(true);
    if (isFirstOpen) {
      console.log('Starting AI conversation...');
      aiChatbotService.startConversation();
      setIsFirstOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        console.log('Sending message to AI:', message.trim());
        await aiChatbotService.processUserMessage(message.trim());
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        aiChatbotService.addMessage('bot', 'Désolé, j\'ai rencontré un problème technique. Pouvez-vous réessayer ? 🔧');
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
    aiChatbotService.processUserMessage(cleanSuggestion);
  };

  const handleQuickQuestion = (question) => {
    aiChatbotService.processUserMessage(question);
  };

  const handleClearConversation = () => {
    aiChatbotService.clearConversation();
    aiChatbotService.startConversation();
  };

  const handleApiKeySet = (apiKey) => {
    if (apiKey) {
      aiChatbotService.setApiKey(apiKey);
      setIsAIMode(true);
      // Redémarrer la conversation avec l'IA
      aiChatbotService.clearConversation();
      aiChatbotService.startConversation();
    } else {
      aiChatbotService.setApiKey(null);
      setIsAIMode(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickQuestions = aiChatbotService.getFrequentQuestions();

  return (
    <>
      {/* Bouton flottant */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #303f9f, #1976d2)',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.3s ease'
        }}
        onClick={handleOpen}
      >
        <ChatIcon />
      </Fab>

      {/* Dialog du chatbot */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: '70vh',
            maxHeight: '600px',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
            color: 'white',
            py: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAIMode ? <AIIcon /> : <BotIcon />}
            <Typography variant="h6">
              Assistant CardioAI {isAIMode ? 'IA+' : 'Local'}
            </Typography>
            {isAIMode && (
              <Chip
                label="IA Avancée"
                size="small"
                color="secondary"
                sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}
              />
            )}
          </Box>
          <Box>
            <Tooltip title="Configuration IA">
              <IconButton
                color="inherit"
                onClick={() => setConfigOpen(true)}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
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
              gap: 2
            }}
          >
            {conversations.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <BotIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Bonjour ! Je suis votre assistant CardioAI
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Posez-moi des questions sur l'application !
                </Typography>
                
                {/* Questions rapides */}
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Questions fréquentes :
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuickQuestion(question)}
                      sx={{ textTransform: 'none' }}
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
                  mb: 1
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    maxWidth: '80%',
                    flexDirection: conv.sender === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: conv.sender === 'user' ? 'primary.main' : 'secondary.main'
                    }}
                  >
                    {conv.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                  </Avatar>
                  
                  {conv.type === 'suggestion' ? (
                    <Chip
                      label={conv.content}
                      onClick={() => handleSuggestionClick(conv.content)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                      }}
                    />
                  ) : (
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        bgcolor: conv.sender === 'user' ? 'primary.main' : 'grey.100',
                        color: conv.sender === 'user' ? 'white' : 'text.primary',
                        borderRadius: 2,
                        borderTopLeftRadius: conv.sender === 'user' ? 2 : 0.5,
                        borderTopRightRadius: conv.sender === 'user' ? 0.5 : 2
                      }}
                    >
                      <Typography variant="body2">
                        {conv.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.7,
                          fontSize: '0.7rem'
                        }}
                      >
                        {formatTime(conv.timestamp)}
                      </Typography>
                    </Paper>
                  )}
                </Box>
              </Box>
            ))}

            {/* Indicateur de frappe */}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  <BotIcon />
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                    borderTopLeftRadius: 0.5
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      Assistant en train d'écrire...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Zone de saisie */}
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="Tapez votre message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                disabled={isTyping}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&:disabled': { bgcolor: 'grey.300' }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Configuration IA */}
      <AIChatbotConfig
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        onApiKeySet={handleApiKeySet}
      />
    </>
  );
}

export default Chatbot;
