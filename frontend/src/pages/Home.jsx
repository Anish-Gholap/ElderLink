import { Box, Button, Typography } from '@mui/material'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {

  // clear localStorage to force login if HomePage was loaded outside of app flow
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