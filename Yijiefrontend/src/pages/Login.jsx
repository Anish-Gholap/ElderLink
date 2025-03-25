import { useState, useEffect } from "react"
import LoginForm from "../components/LoginForm"
import loginService from "../services/login"
import { useAuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuthContext() // access login helper function from AuthContext
  const navigate = useNavigate()

  // clear localStorage to force login if LoginPage was loaded outside of app flow
  useEffect(() => {
    window.localStorage.clear()
    console.log("local storage cleared")
  }, [])


  // handle login form submission
  const handleLogin = async (event) => {
    event.preventDefault()

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
      console.log(exception)
    }
  }


  return (
    <div>
      <h2> Login Page </h2>
      <LoginForm
        handleSubmit={handleLogin}
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
      />

    </div>
  )
}

export default Login