/**
 * @file aiController.js
 * @description Handles AI chatbot interaction by forwarding requests to the Python backend.
 */

// server/controllers/aiController.js
const axios = require('axios');
const logger = require('../utils/logger');


// The URL where your Python backend is running
const CHATBOT_BACKEND_URL = 'http://localhost:3000';

/**
 * Sends a chat query to the Python-based AI backend and returns the response.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Object} JSON response from AI backend or error details.
 */
const chat = async (request, response) => {
  try {
    // Extract and validate request body
    const { query, systemPrompt, modelSettings } = request.body;

    if (!query) {
      return response.status(400).json({ error: 'Query is required' });
    }

    // Prepare request for Python backend
    const botRequest = {
      model_name: modelSettings?.model || "llama-3.3-70b-versatile",
      model_provider: modelSettings?.provider || "Groq",
      messages: [query],
      system_prompt: systemPrompt || "You are a helpful assistant",
      allow_search: modelSettings?.allowSearch || true,
      tts_enabled: modelSettings?.ttsEnabled || false,
      voice: modelSettings?.voice || "en-SG-female-1"
    };

    // Forward request to Python backend
    const botResponse = await axios.post(`${CHATBOT_BACKEND_URL}/chat`, botRequest);

    // Return the response from Python backend
    return response.json(botResponse.data);
  } catch (error) {
    logger.error('Error in AI chat endpoint:', error);

    // Check if it's an axios error with response
    if (error.response) {
      return response.status(error.response.status).json({
        error: 'AI backend error',
        details: error.response.data
      });
    }

    // Handle connection errors
    if (error.code === 'ECONNREFUSED') {
      return response.status(503).json({
        error: 'AI backend is not available',
        details: 'The AI service is currently offline'
      });
    }

    // Generic error
    return response.status(500).json({
      error: 'Failed to process AI request',
      details: error.message
    });
  }
};

module.exports = { chat };