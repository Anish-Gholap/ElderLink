import { Button, TextField } from '@mui/material'

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
        <Button
          variant="contained"
          color="warning"
          type="submit"
          id="login-button"
          style={{ marginTop: 10 }}
        >
          Login
        </Button>
      </form>
    )
}

export default LoginForm