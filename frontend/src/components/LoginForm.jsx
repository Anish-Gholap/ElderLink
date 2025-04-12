import { Button, TextField, Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
/**
 * LoginForm component for rendering the login form.
 * Provides input fields for username and password, and a submit button.
 * Displays an error message if login fails and includes a link to the forgot password page.
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.handleSubmit - Function to handle form submission.
 * @param {Function} props.handleUsernameChange - Function to handle changes to the username input.
 * @param {Function} props.handlePasswordChange - Function to handle changes to the password input.
 * @param {string} props.username - The current value of the username input.
 * @param {string} props.password - The current value of the password input.
 * @param {string} [props.errorMessage] - The error message to display if login fails.
 * @returns {JSX.Element} The LoginForm component.
 */
const LoginForm = ({ handleSubmit, handleUsernameChange, handlePasswordChange, username, password, errorMessage }) => {

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
      <Typography color="error" variant="body2" align="center" gutterBottom >
        {errorMessage}
      </Typography>
      <Link to='/forgot-password'>
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