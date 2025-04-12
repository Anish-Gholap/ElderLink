/* eslint-disable react-refresh/only-export-components */
// Context to save currently logged in user amongst all required pages if refreshed

/* 
  User object: {
    token,
    username,
    name,
    id,
    token expiry time
  }
*/

import { createContext, useState, useEffect, useContext } from "react";
import {useNavigate} from "react-router-dom"

const AuthContext = createContext()

/**
 * Custom hook to access the AuthContext.
 * @returns {Object} The context value containing the user, login, and logout functions.
 */
export const useAuthContext = () => useContext(AuthContext)

/**
 * AuthProvider component to manage authentication state and provide it to child components.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will have access to the AuthContext.
 * @returns {JSX.Element} The AuthContext provider component.
 */
export const AuthProvider = ({children}) => {
  const navigate = useNavigate()

  /**
   * The currently logged-in user.
   * @type {Object|null}
   * @property {string} token - The authentication token.
   * @property {string} username - The username of the user.
   * @property {string} name - The full name of the user.
   * @property {string} id - The user ID.
   * @property {number} tokenExpiresAt - The timestamp when the token expires.
   */
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null
  })

  // load user from local storage when the app starts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    
    if(storedUser) {
      setUser(storedUser)
    }
  }, [])

  // save user to local storage whenever user storage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      // when user logs out
      localStorage.removeItem("user")
    }
  }, [user])

  // logout user if token has expired
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && user.tokenExpiresAt < Date.now()) {
        window.alert("Session Expired! Please Login Again")
        logout()
      }
    }, 5000) // run every 5 seconds

    return () => clearInterval(interval)
    
  },[user])

  /**
   * Log in a user and update the user state.
   * @param {Object} userData - The user data to set.
   */
  const login = (userData) => {
    setUser(userData)
    console.log(user)
  }
  /**
   * Log out the current user, clear the user state, and navigate to the home page.
   */
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    navigate("/")
  }

  const value = {
    user, 
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )

}