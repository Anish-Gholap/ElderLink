const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
require('dotenv').config()

let backendProcess = null;
/**
 * Start the AI backend process.
 * This function determines the platform (Windows, macOS, Linux) and starts the appropriate AI backend executable.
 * @async
 * @returns {Promise<boolean>} Resolves to `true` if the backend starts successfully.
 * @throws {Error} Throws an error if the backend file is not found or fails to start.
 */
const startAIBackend = async () => {
  if (backendProcess) {
    logger.info('AI backend is already running');
    return;
  }


  let backendPath;
  let command;
  let args = [];

  if (process.platform === 'win32') {
    // For Windows
    command = path.join(__dirname, '..', 'python_backend', 'ai_chatbot_backend', 'ai_chatbot_backend.exe');
    backendPath = command;
  } else if (process.platform === 'darwin') {
    // For macOS
    command = path.join(__dirname, '..', 'python_backend_mac', 'ai_chatbot_backend', 'ai_chatbot_backend');
    backendPath = command;

    fs.chmodSync(backendPath, '755');
  } else {
    // For Linux
    command = path.join(__dirname, '..', 'python_backend', 'ai_chatbot_backend', 'ai_chatbot_backend');
    backendPath = command;

    fs.chmodSync(backendPath, '755');
  }

  // Check if backend file exists
  if (!fs.existsSync(backendPath)) {
    logger.error(`AI backend file not found at: ${backendPath}`);
    throw new Error('AI backend file not found');
  }

  logger.info(`Starting AI backend from: ${backendPath}`);


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

      resolve(true);
    }, 5000);

    backendProcess.stdout.on('data', onStartup);
  });
};

/**
 * Stop the AI backend process.
 * Terminates the backend process if it is running.
 * @returns {boolean} Returns `true` if the backend process was stopped, `false` if no process was running.
 */
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

/**
 * Initialize the AI backend process.
 * Starts the backend process when the module is loaded.
 * @async
 * @returns {Promise<void>} Logs success or failure of the backend initialization.
 */
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