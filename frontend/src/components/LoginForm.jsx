import { Button, TextField, Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const LoginForm = ({ handleSubmit, handleUsernameChange, handlePasswordChange, username, password }) => {

  return (
    <form onSubmit={handleSubmit}>
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
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
        />
      </div>
      <Link to='/'> {/* Add this line */}
        <Typography fontSize='0.8rem' >
          Forgot password?
        </Typography>
      </Link>
      <Box display="flex" justifyContent="center">

        <Button
          variant="contained"
          color="warning"
          type="submit"
          id="login-button"
          style={{ marginTop: 10, width: "8rem" }}
        >
          Login
        </Button>
      </Box>
    </form>
  )
}

export default LoginForm