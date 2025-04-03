import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for managing snackbar notifications
 * @returns {Object} Snackbar state and control functions
 */

export const useSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [redirectPath, setRedirectPath] = useState(null);
  const [autoHideDuration, setAutoHideDuration] = useState(3000);

  const navigate = useNavigate();

  /**
   * Show a snackbar message
   * @param {string} msg - Message to display
   * @param {string} type - Message type (info, success, error, warning)
   * @param {string|null} redirect - Path to redirect to after snackbar closes
   * @param {number} duration - How long to show the message in ms
   */
  const showMessage = (msg, type = 'info', redirect = null, duration = 3000) => {
    setMessage(msg);
    setSeverity(type);
    setRedirectPath(redirect);
    setAutoHideDuration(duration);
    setOpen(true);
  };

  /**
   * Handle closing the snackbar
   * @param {Event} event - The event that triggered the close
   * @param {string} reason - Reason for closing
   */
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);

    // If redirectPath is set, navigate after snackbar closes
    if (redirectPath) {
      setTimeout(() => {
        navigate(redirectPath);
        setRedirectPath(null);
      }, 100);
    }
  };

  return {
    // State
    open,
    message,
    severity,
    autoHideDuration,

    // Methods
    showMessage,
    handleClose,

    // Utility methods for common cases
    showSuccess: (msg, redirect = null) => showMessage(msg, 'success', redirect),
    showError: (msg) => showMessage(msg, 'error'),
    showInfo: (msg) => showMessage(msg, 'info'),
    showWarning: (msg) => showMessage(msg, 'warning')
  };
};