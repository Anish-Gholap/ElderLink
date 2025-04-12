import { Box, Button, Typography } from '@mui/material'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

/**
 * Home component for the ElderLink application.
 * Serves as the landing page, providing options to log in or sign up.
 * Clears local storage to ensure a fresh session when accessed outside the app flow.
 * @component
 * @returns {JSX.Element} The Home page component.
 */
const Home = () => {

  /**
   * Clears local storage on component mount to force login if the Home page is loaded outside the app flow.
   * @useEffect
   */
  useEffect(() => {
    window.localStorage.clear()
    console.log("local storage cleared")
  }, [])

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <img src="\image 28.png" alt="ElderLink" />
      <Typography variant="h3" fontWeight={600} mt={2}>
        ElderLink
      </Typography>
      <Typography fontSize='1rem' fontStyle='italic'>
        Connecting Seniors to the Community
      </Typography>
      <Link to="/login">
        <Button variant="contained" color="warning" style={{ marginTop: 40, width: "8rem" }}>
          Login
        </Button>
      </Link>
      <Link to="/signup">
        <Button variant="outlined" color="info" style={{ marginTop: 20, width: "8rem" }}>
          Sign Up
        </Button>
      </Link>
    </Box>
  )
}

export default Home