import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    Typography,
    Box,
    TextField,
    IconButton,
    Paper,
} from '@mui/material'
import { FaPaperPlane } from 'react-icons/fa';
import { FaComments } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import React, { useRef, useEffect } from 'react'
import { GiRobotAntennas } from 'react-icons/gi';

function ChatWindow() {
    const [showChat, setShowChat] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [messages, setMessages] = React.useState([
        {
            authorIsUser: false,
            text: "Hi there! I'm JOJO, your friendly chat assistant. How can I help you today?",
            datetime: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = React.useState(false);


    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Handle sending a message
    const handleSendMessage = async () => {
        if (inputValue.trim() === "") return;

        // Add user message
        const userMessage = {
            authorIsUser: true,
            text: inputValue,
            datetime: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");

        // Set typing indicator
        setIsTyping(true);

        try {
            // For demo, wrap the setTimeout in a Promise
            await new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    try {
                        const aiMessage = {
                            authorIsUser: false,
                            text: `Thanks for your message: "${userMessage.text}". This is a simulated response. In a real implementation, this would be replaced with an actual API call to a chatbot service.`,
                            datetime: new Date()
                        };

                        setMessages(prev => [...prev, aiMessage]);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                }, 1500);

                // Add a way to cancel the timer if needed
                return () => clearTimeout(timer);
            });
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [
                ...prev,
                {
                    authorIsUser: false,
                    text: "Sorry, I couldn't process your request. Please try again.",
                    datetime: new Date()
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
                <FaComments sx={{ mr: 1 }} />
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
                    <Typography variant="h6">
                        Chat with JOJO
                        <GiRobotAntennas fontSize={'2rem'} color='maroon'/>
                    </Typography>
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
                                    <Typography variant="caption" sx={{ display: 'block', opacity: 0.8, mt: 0.5 }}>
                                        {message.datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
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
                            bgcolor: inputValue.trim() ? '#1976d2' : '#e0e0e0',
                            color: 'white',
                            '&:hover': {
                                bgcolor: inputValue.trim() ? '#1565c0' : '#e0e0e0',
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