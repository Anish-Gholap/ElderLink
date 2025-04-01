import { useState, useEffect } from "react"
import LoginForm from "../components/LoginForm"
import loginService from "../services/login"
import { useAuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { TextField, Box, Typography } from "@mui/material"
import { FaArrowLeft } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const { login } = useAuthContext() // access login helper function from AuthContext
  const navigate = useNavigate()

  // clear localStorage to force login if LoginPage was loaded outside of app flow
  useEffect(() => {
    window.localStorage.clear()
    console.log("local storage cleared")
  }, [])

  const validateDetails = () => {
    if (username === "") {
      setErrorMessage("Username cannot be empty")
      return false
    }
    if (password === "") {
      setErrorMessage("Password cannot be empty")
      return false
    }
    return true
  }


  // handle login form submission
  const handleLogin = async (event) => {
    event.preventDefault()
    if (!validateDetails()) return

    try {
      const user = await loginService.login({
        username,
        password
      })

      // save user in Auth Context
      login(user)

      // clear input fields
      setUsername("")
      setPassword("")

      // navigate to event discovery page
      navigate("/event-discovery")

      console.log(user)
    } catch (exception) {
      // show error message if login fails
      if (exception.response.status === 401) {
        setErrorMessage("Invalid username or password")
      }
      else {
        setErrorMessage("An unexpected error occurred")
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
        errorMessage={errorMessage}
      />
      <Typography mt={2}>
        Don't have an account? <a href="/signup">Sign Up</a>
      </Typography>
    </Box>
  )
}

export default Login