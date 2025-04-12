import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Paper, Stepper, Step, StepLabel } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import { useSnackbar } from "../hooks/useSnackbar";
import SnackbarComponent from "../components/SnackbarComponent";
import authService from '../services/auth.js'

/**
 * ForgotPassword component for resetting a user's password.
 * Guides the user through a three-step process: phone number verification, OTP verification, and password reset.
 * @component
 * @returns {JSX.Element} The ForgotPassword page component.
 */
const ForgotPassword = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [user, setUser] = useState(null); // To store the user object after fetching
    const [isLoading, setIsLoading] = useState(false); // To manage loading state
    const navigate = useNavigate();
    const snackbar = useSnackbar();

    const steps = ["Phone Number", "Verify OTP", "Reset Password"];

    /**
     * Validates the phone number and fetches the user data.
     * @async
     * @returns {Promise<boolean>} Returns `true` if the phone number is valid, otherwise `false`.
     */
    const validatePhoneNumber = async () => {
        // Simple validation - check if phone number is entered

        if (!phoneNumber.trim()) {
            snackbar.showError("Please enter your phone number");
            return false;
        }

        try {
            setIsLoading(true); // Set loading state to true
            const user = await authService.findUserWithPhoneNumber(phoneNumber);
            setUser(user); // Store the user object for later use
        }
        catch (error) {
            console.error("Error fetching user:", error.response.data.error);
            snackbar.showError("User not found " + error.response.data.error);
            return false;
        } finally {
            setIsLoading(false); // Reset loading state
        }

        return true;
    };

    /**
     * Validates the OTP entered by the user.
     * @returns {boolean} Returns `true` if the OTP is valid, otherwise `false`.
     */
    const validateOtp = () => {
        // Hardcoded OTP is 1234
        if (otp !== "1234") {
            snackbar.showError("Invalid OTP. Please try again.");
            return false;
        }
        return true;
    };

    /**
     * Validates the new password and confirms the password reset.
     * @async
     * @returns {Promise<boolean>} Returns `true` if the password reset is successful, otherwise `false`.
     */
    const validatePasswords = async () => {

        if (!newPassword) {
            snackbar.showError("Please enter a new password");
            return false;
        }
    
        if (newPassword !== confirmPassword) {
            snackbar.showError("Passwords do not match");
            return false;
        }

        try {
            setIsLoading(true); // Set loading state to true
            await authService.changePassword({
                username: user.username,
                password: newPassword,
                confirmPassword: confirmPassword,
                otp: otp
            });
            snackbar.showSuccess("Password changed successfully!");
            navigate("/login"); // Redirect to login page after successful password change
        }
        catch (error) {
            console.error("Error changing password:", error);
            snackbar.showError("Failed to change password. Please try again. " + error.response.data.error);
            return false;
        } finally {
            setIsLoading(false); // Reset loading state
        }
            
        return true;
    };

    /**
     * Handles the "Next" button click, validating the current step and moving to the next step if valid.
     * @async
     */
    const handleNext = async () => {
        let isValid = false;

        switch (activeStep) {
            case 0:
                isValid = await validatePhoneNumber();
                // In a real app, we would send an OTP to the phone number here
                break;
            case 1:
                isValid = validateOtp();
                break;
            case 2:
                isValid = await validatePasswords();
                if (isValid) {
                    // In a real app, we would submit the new password to the backend here
                    snackbar.showSuccess("Password has been reset successfully!", "/login");
                    return; // Don't increment the step, we're navigating away
                }
                break;
            default:
                break;
        }

        if (isValid) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    /**
     * Handles the "Back" button click, moving to the previous step.
     */
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    /**
     * Renders the content for each step in the password reset process.
     * @param {number} step - The current step index.
     * @returns {JSX.Element} The content for the current step.
     */
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="body1" mb={2}>
                            Please enter your phone number to receive a verification code.
                        </Typography>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            InputProps={{
                                startAdornment: <span>+65</span>, // Add country code prefix
                            }}
                            margin="normal"
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <Typography variant="h5" mb={2}>
                            Welcome, <span style={{ fontWeight: "bold" }}>{user?.username}</span>! 
                        </Typography>
                        <Typography variant="body1" mb={2}>
                            We've sent a 4-digit verification code to your phone. Please enter it below.
                            (Hint: Use 1234 for this demo)
                        </Typography>
                        <TextField
                            fullWidth
                            label="OTP Code"
                            variant="outlined"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            margin="normal"
                        />
                        <Link>
                            <Typography fontSize="0.8rem" mt={2} color="primary" onClick={() => snackbar.showSuccess("OTP resent!")}>
                                Didn't receive the code? Resend OTP
                            </Typography>
                        </Link>
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="body1" mb={2}>
                            Create a new password for your account.
                        </Typography>
                        <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            variant="outlined"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            type="password"
                            variant="outlined"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            margin="normal"
                        />
                    </Box>
                );
            default:
                return "Unknown step";
        }
    };

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh">
            <Box position="fixed" display="flex" alignItems="center" top={0} left={0} p={2} onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
                <FaArrowLeft fontSize="2rem" />
            </Box>

            <Paper elevation={4} sx={{ p: 10, width: "50%", maxWidth: "500px" }}>
                <Typography variant="h4" textAlign="center" mb={4}>
                    Reset Password
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {getStepContent(activeStep)}

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                    <Button
                        variant="outlined"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color={activeStep === 2 ? "success" : "primary"}
                        onClick={handleNext}
                    >
                        {activeStep === steps.length - 1 ? "Reset Password" : "Next"}
                    </Button>
                </Box>
            </Paper>

            <SnackbarComponent
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                autoHideDuration={snackbar.autoHideDuration}
                handleClose={snackbar.handleClose}
            />
        </Box>
    );
};

export default ForgotPassword;