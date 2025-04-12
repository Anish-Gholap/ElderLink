import React from 'react';
import { Snackbar, Alert } from '@mui/material';

/**
 * Reusable Snackbar component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Snackbar component
 */
const SnackbarComponent = ({
                             open,
                             message,
                             severity,
                             autoHideDuration,
                             handleClose,
                             anchorOrigin = { vertical: 'top', horizontal: 'center' }
                           }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;