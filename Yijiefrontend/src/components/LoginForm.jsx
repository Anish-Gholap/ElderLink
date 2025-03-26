const LoginForm = ({ handleSubmit, handleUsernameChange, handlePasswordChange, username, password }) => {

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type='submit'>
          login
        </button>
      </form>
    )
  }
  
  export default LoginForm