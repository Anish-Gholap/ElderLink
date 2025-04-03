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

export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider = ({children}) => {
  const navigate = useNavigate()

  // initialise user state from localStorage to persist login after Refresh
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

  // Helper functions
  const login = (userData) => {
    setUser(userData)
    console.log(user)
  }

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