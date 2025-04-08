// server/services/aiBackendService.js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
require('dotenv').config()

let backendProcess = null;

const startAIBackend = async () => {
  if (backendProcess) {
    logger.info('AI backend is already running');
    return;
  }

  // Determine platform-specific executable
  let backendPath;
  let command;
  let args = [];

  if (process.platform === 'win32') {
    // For Windows - use Windows executable
    command = path.join(__dirname, '..', 'python_backend', 'ai_chatbot_backend', 'ai_chatbot_backend.exe');
    backendPath = command;
  } else if (process.platform === 'darwin') {
    // For macOS - use macOS executable
    command = path.join(__dirname, '..', 'python_backend', 'ai_chatbot_backend', 'ai_chatbot_backend');
    backendPath = command;
    // Make sure the file is executable
    fs.chmodSync(backendPath, '755');
  } else {
    // For Linux - use Linux executable
    command = path.join(__dirname, '..', 'python_backend', 'ai_chatbot_backend', 'ai_chatbot_backend');
    backendPath = command;
    // Make sure the file is executable
    fs.chmodSync(backendPath, '755');
  }

  // Check if backend file exists
  if (!fs.existsSync(backendPath)) {
    logger.error(`AI backend file not found at: ${backendPath}`);
    throw new Error('AI backend file not found');
  }

  logger.info(`Starting AI backend from: ${backendPath}`);

  // Working directory should be the directory containing the backend
  backendProcess = spawn(command, args, {
    cwd: path.dirname(backendPath)
  });

  backendProcess.stdout.on('data', (data) => {
    logger.info(`AI backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    logger.error(`AI backend error: ${data}`);
  });

  backendProcess.on('close', (code) => {
    logger.info(`AI backend process exited with code ${code}`);
    backendProcess = null;
  });

  // Wait for backend to initialize
  return new Promise((resolve, reject) => {
    // Listen for the first stdout message as an indicator that the server is ready
    const onStartup = (data) => {
      if (data.toString().includes('Application startup complete')) {
        backendProcess.stdout.removeListener('data', onStartup);
        resolve(true);
      }
    };

    // Set a timeout in case the server doesn't start properly
    const timeout = setTimeout(() => {
      backendProcess.stdout.removeListener('data', onStartup);
      // Don't reject - the backend might still be starting up without logging the expected message
      resolve(true);
    }, 5000);

    backendProcess.stdout.on('data', onStartup);
  });
};

const stopAIBackend = () => {
  if (backendProcess) {
    logger.info('Stopping AI backend...');
    backendProcess.kill();
    backendProcess = null;
    return true;
  }
  logger.info('No AI backend process to stop');
  return false;
};

// Initialize AI backend on module load
const initialize = async () => {
  try {
    await startAIBackend();
    logger.info('AI backend started successfully');
  } catch (error) {
    logger.error('Failed to start AI backend:', error);
  }
};

module.exports = {
  startAIBackend,
  stopAIBackend,
  initialize
};