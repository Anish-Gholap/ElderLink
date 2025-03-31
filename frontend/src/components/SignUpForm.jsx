import React, { useState } from 'react'
import { Button, TextField, Box, Typography } from '@mui/material'

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
        // check if any field is empty
        console.log(username, name, phoneNumber, password, confirmPassword)
        if (!username || !name || !phoneNumber || !password || !confirmPassword) {
            return "Please fill in all fields"
        }
        // check if username has minimum 4 characters
        if (username.length < 4) {
            return "Username must be at least 4 characters long"
        }
        // check if password has minimum 6 characters
        if (password.length < 6) {
            return "Password must be at least 6 characters long"
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
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={handleNameChange}
                        fullWidth
                        margin="normal"
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
