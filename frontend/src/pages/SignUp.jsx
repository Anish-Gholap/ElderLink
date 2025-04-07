import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';
import { useUsersContext } from "../contexts/UsersContext";
import { useSnackbar } from '../hooks/useSnackbar';
import SnackbarComponent from '../components/SnackbarComponent';
import authService from "../services/auth.js"

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { createUserHandler } = useUsersContext();
  const snackbar = useSnackbar();

  useEffect(() => {
    window.localStorage.clear();
    console.log("local storage cleared");
  }, []);

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (!username || !name || !phoneNumber || !password || !confirmPassword) {
      snackbar.showError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      snackbar.showError("Passwords do not match.");
      return;
    }

    try {
      // Call createUserHandler with the required fields
      // await createUserHandler({ username, name, phoneNumber, password });

      const newUser = {
        username,
        name,
        phoneNumber,
        password
      }

      await authService.createUser(newUser)

      // Show success message and redirect to login
      snackbar.showSuccess("Registration successful, redirecting to Login", "/login");

    } catch (error) {
      console.error("Sign-up failed:", error);
      snackbar.showError(`Sign-up failed. ${error}` );
    }
  };

  const handlePhoneChange = (event) => {
    let inputValue = event.target.value;
    if (inputValue.startsWith('+65')) {
      inputValue = inputValue.substring(3);
    }
    setPhoneNumber(inputValue);
  }

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Box position="fixed" display='flex' alignItems='center' top={0} left={0} p={2} onClick={() => navigate('/')} sx={{ cursor: "pointer" }}>
        <FaArrowLeft fontSize="2rem" />
      </Box>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      <SignUpForm
        handleSubmit={handleSignUp}
        username={username}
        name={name}
        phoneNumber={phoneNumber}
        password={password}
        confirmPassword={confirmPassword}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handleNameChange={({ target }) => setName(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handlePhoneChange={handlePhoneChange}
        handleConfirmPasswordChange={({ target }) => setConfirmPassword(target.value)}
      />

      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        autoHideDuration={snackbar.autoHideDuration}
        handleClose={snackbar.handleClose}
      />
    </Box>
  );
}

export default SignUp;