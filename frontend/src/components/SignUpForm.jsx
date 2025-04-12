import React, { useState } from 'react'
import { Button, TextField, Box, Typography } from '@mui/material'

/**
 * SignUpForm component for rendering the sign-up form.
 * Provides input fields for username, full name, phone number, password, and confirm password.
 * Validates the input fields and displays error messages if validation fails.
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.handleSubmit - Function to handle form submission.
 * @param {Function} props.handleUsernameChange - Function to handle changes to the username input.
 * @param {Function} props.handlePasswordChange - Function to handle changes to the password input.
 * @param {Function} props.handleNameChange - Function to handle changes to the full name input.
 * @param {Function} props.handlePhoneChange - Function to handle changes to the phone number input.
 * @param {Function} props.handleConfirmPasswordChange - Function to handle changes to the confirm password input.
 * @param {string} props.username - The current value of the username input.
 * @param {string} props.password - The current value of the password input.
 * @param {string} props.name - The current value of the full name input.
 * @param {string} props.phoneNumber - The current value of the phone number input.
 * @param {string} props.confirmPassword - The current value of the confirm password input.
 * @returns {JSX.Element} The SignUpForm component.
 */
const SignUpForm = ({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    handleNameChange,
    handlePhoneChange,
    handleConfirmPasswordChange,
    username,
    password,
    name,
    phoneNumber,
    confirmPassword,
}) => {
    const [error, setError] = useState(null)

    const validateDetails = () => {

        if (!username || !name || !phoneNumber || !password || !confirmPassword) {
            return "Please fill in all fields"
        }
        // check if username has minimum 3 characters
        if (username.length < 3) {
            return "Username must be at least 3 characters long"
        }
        // check if password has minimum 5 characters
        if (password.length < 5) {
            return "Password must be at least 5 characters long"
        }
        // check if password and confirm password match
        if (password !== confirmPassword) {
            return "Passwords do not match"
        }
        return null
    }

    return (
        <>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={(e) => {
                e.preventDefault()
                const error = validateDetails()
                if (error) {
                    setError(error)
                    return
                }
                handleSubmit(e)
            }}>
                <div>
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={handleUsernameChange}
                        fullWidth
                        margin="normal"
                    />
                </div>

                <div>
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        value={name}
                        onChange={handleNameChange}
                        fullWidth
                        margin="normal"
                        helperText="Please enter your full name"
                    />
                </div>

                <div>
                    <TextField
                        label="Phone Number"
                        variant="outlined"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            startAdornment: <span>+65</span>, // Add country code prefix
                        }}
                    />
                </div>

                <div>
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        fullWidth
                        margin="normal"
                    />
                </div>
                <div>
                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        fullWidth
                        margin="normal"
                    />
                </div>

                <Box display="flex" justifyContent="center">
                    <Button
                        variant="contained"
                        color="success"
                        type="submit"
                        id="login-button"
                        style={{ marginTop: 10, width: "8rem" }}
                    >
                        Sign Up
                    </Button>
                </Box>
            </form>
        </>
    )
}

export default SignUpForm
