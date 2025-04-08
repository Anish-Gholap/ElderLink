import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Typography,
    Box,
    TextField,
    IconButton,
    Paper,
} from '@mui/material'
import { FaPaperPlane, FaComments, FaTimes, FaPlay } from 'react-icons/fa';
import React, { useRef, useEffect } from 'react'
import { GiRobotAntennas } from 'react-icons/gi';
import { getChatbotResponse } from '../services/chatbot';

function ChatWindow() {
    const [showChat, setShowChat] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [messages, setMessages] = React.useState([
        {
            authorIsUser: false,
            text: "Hi there! I'm JOJO, your friendly chat assistant. How can I help you today?",
            datetime: new Date(),
            audio: null
        }
    ]);
    const [isTyping, setIsTyping] = React.useState(false);
    const [audioPlayer, setAudioPlayer] = React.useState(null);
    const [playingMessageId, setPlayingMessageId] = React.useState(null);

    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Function to toggle audio playback from base64 string
    const toggleAudio = (base64Audio, messageId) => {
        // If clicking the currently playing message, pause it
        if (playingMessageId === messageId && audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            setPlayingMessageId(null);
            return;
        }

        // Stop any currently playing audio
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }

        // Create a new audio element
        const audio = new Audio();
        audio.src = `data:audio/mp3;base64,${base64Audio}`;

        // Set up event listeners
        audio.onplay = () => setPlayingMessageId(messageId);
        audio.onended = () => setPlayingMessageId(null);
        audio.onpause = () => setPlayingMessageId(null);

        // Play the audio
        audio.play().catch(err => console.error("Error playing audio:", err));

        // Save the audio player reference
        setAudioPlayer(audio);
    };

    // Handle sending a message
    const handleSendMessage = async () => {
        if (inputValue.trim() === "") return;

        // Add user message
        const userMessage = {
            authorIsUser: true,
            text: inputValue,
            datetime: new Date(),
            audio: null // Users don't have audio responses
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");

        // Set typing indicator
        setIsTyping(true);

        try {
            const aiResponse = await getChatbotResponse(inputValue, messages.map(msg => msg.text));

            // Create AI message with the response
            const aiMessage = {
                authorIsUser: false,
                text: aiResponse.text,
                datetime: new Date(),
                audio: aiResponse.audio || null // Use the audio from the response if available
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [
                ...prev,
                {
                    authorIsUser: false,
                    text: "Sorry, I couldn't process your request. Please try again.",
                    datetime: new Date(),
                    audio: null
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Sort messages by date
    const sortedMessages = [...messages].sort(
        (a, b) => a.datetime - b.datetime
    );

    return (
        <>
            <Fab
                style={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    backgroundColor: "#4CAF50",
                    color: "white",
                    zIndex: 1000,
                }}
                onClick={() => setShowChat(true)}
                variant="extended"
            >
                <FaComments style={{ marginRight: '8px' }} />
                <span>Chat with JOJO</span>
            </Fab>
            <Dialog
                open={showChat}
                onClose={() => setShowChat(false)}
                scroll="paper"
                PaperProps={{
                    sx: {
                        minWidth: '300px',
                        maxWidth: '600px',
                        height: '70vh',
                        maxHeight: '800px',
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: '#f5f5f5',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                        <Typography variant="h6" >
                            Chat with JOJO
                        </Typography>
                        <GiRobotAntennas style={{ fontSize: '2rem', color: 'maroon' }} />
                    </Box>
                    <IconButton onClick={() => setShowChat(false)}>
                        <FaTimes />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    overflow: 'auto'
                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        flexGrow: 1,
                        overflowY: 'auto',
                        pb: 2
                    }}>
                        {sortedMessages.map((message, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: message.authorIsUser ? 'flex-end' : 'flex-start',
                                    width: '100%'
                                }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        maxWidth: '80%',
                                        backgroundColor: message.authorIsUser ? '#1976d2' : '#e91e63',
                                        color: 'white',
                                    }}
                                >
                                    <Typography variant="body1">{message.text}</Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 0.5
                                    }}>
                                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                            {message.datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>

                                        {!message.authorIsUser && message.audio && (
                                            <IconButton
                                                size="small"
                                                onClick={() => toggleAudio(message.audio, index)}
                                                sx={{
                                                    color: 'white',
                                                    opacity: 0.8,
                                                    backgroundColor: playingMessageId === index ? 'rgba(255,255,255,0.3)' : 'transparent',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255,255,255,0.2)'
                                                    }
                                                }}
                                            >
                                                {playingMessageId === index ? <FaTimes size={12} /> : <FaPlay size={12} />}
                                            </IconButton>
                                        )}
                                    </Box>
                                </Paper>
                            </Box>
                        ))}

                        {isTyping && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        backgroundColor: '#e91e63',
                                        color: 'white',
                                    }}
                                >
                                    <Typography variant="body2">JOJO is typing...</Typography>
                                </Paper>
                            </Box>
                        )}

                        <div ref={messagesEndRef} />
                    </Box>
                </DialogContent>

                <DialogActions sx={{
                    p: 2,
                    borderTop: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <TextField
                        label="Type a message..."
                        variant="outlined"
                        fullWidth
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        multiline
                        maxRows={3}
                        sx={{ mr: 1 }}
                    />
                    <IconButton
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        sx={{
                            bgcolor: inputValue.trim() && !isTyping ? '#1976d2' : '#e0e0e0',
                            color: 'white',
                            '&:hover': {
                                bgcolor: inputValue.trim() && !isTyping ? '#1565c0' : '#e0e0e0',
                            }
                        }}
                    >
                        <FaPaperPlane />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ChatWindow