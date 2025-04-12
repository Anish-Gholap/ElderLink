import { useState, useEffect } from "react"
import LoginForm from "../components/LoginForm"
import authService from "../services/auth.js"
import { useAuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { TextField, Box, Typography } from "@mui/material"
import { FaArrowLeft } from "react-icons/fa"
import {useSnackbar} from "../hooks/useSnackbar.js"
import SnackbarComponent from "../components/SnackbarComponent.jsx"

/**
 * Login component for the ElderLink application.
 * Provides a form for users to log in and handles authentication logic.
 * Clears local storage to ensure a fresh session when accessed outside the app flow.
 * @component
 * @returns {JSX.Element} The Login page component.
 */
const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuthContext() // access login helper function from AuthContext
  const navigate = useNavigate()
  const snackbar = useSnackbar()

  /**
   * Clears local storage on component mount to force login if the Login page is loaded outside the app flow.
   * @useEffect
   */
  useEffect(() => {
    window.localStorage.clear()
    console.log("local storage cleared")
  }, [])

  /**
   * Validates the login details entered by the user.
   * @returns {boolean} Returns `true` if the details are valid, otherwise `false`.
   */
  const validateDetails = () => {
    if (username === "") {
      snackbar.showError("Username cannot be empty")
      return false
    }
    if (password === "") {
      snackbar.showError("Password cannot be empty")
      return false
    }
    return true
  }


  /**
   * Handles the login form submission.
   * Validates the input, sends the login request, and updates the AuthContext on success.
   * @async
   * @param {Object} event - The form submission event.
   */
  const handleLogin = async (event) => {
    event.preventDefault()
    if (!validateDetails()) return

    try {
      const user = await authService.login({
        username,
        password
      })

      // save user in Auth Context
      login(user)

      // clear input fields
      setUsername("")
      setPassword("")

      // navigate to event discovery page
      snackbar.showSuccess("Login successful! Loading...", "/event-discovery")

      console.log(user)
    } catch (exception) {
      // show error message if login fails
      if (exception.response.status === 401) {
        snackbar.showError("Invalid username or password")
      }
      else {
        snackbar.showError("An unexpected error occurred")
      }
      console.log(exception)
    }
  }


  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Box position="fixed" display='flex' alignItems='center' top={0} left={0} p={2} onClick={() => navigate('/')} sx={{ cursor: "pointer" }}>
        <FaArrowLeft fontSize="2rem" />
      </Box>
      <Typography variant="h4">
        Login
      </Typography>
      <LoginForm
        handleSubmit={handleLogin}
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
      />
      <Typography mt={2}>
        Don't have an account? <a href="/signup">Sign Up</a>
      </Typography>
      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        autoHideDuration={snackbar.autoHideDuration}
        handleClose={snackbar.handleClose}
      />
    </Box>
  )
}

export default Login