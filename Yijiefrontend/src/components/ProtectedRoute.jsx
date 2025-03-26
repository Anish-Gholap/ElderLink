// Component checks if a user is logged in before redirecting to page otherwise it redirects to home page

import { useAuthContext } from "../contexts/AuthContext";
import {Navigate} from "react-router-dom"


const ProtectedRoute = ({children}) => {
  const {user} = useAuthContext()

  if (!user) {
    return <Navigate to="/" replace />
  }

  //renders protected page since user is logged in
  return children
}

export default ProtectedRoute