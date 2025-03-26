import React from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SignUpForm from '../components/SignUpForm'


function SignUp() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()


  useEffect(() => {
    window.localStorage.clear()
    console.log("local storage cleared")
  }, [])


  const handleSignUp = async (event) => {
    // TODO: implement sign up logic
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
        password={password}
        email={email}
        confirmPassword={confirmPassword}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleEmailChange={({ target }) => setEmail(target.value)}
        handleConfirmPasswordChange={({ target }) => setConfirmPassword(target.value)}
      />
    </Box>
  )
}


export default SignUp