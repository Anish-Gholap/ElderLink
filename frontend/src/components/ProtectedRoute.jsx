// Component checks if a user is logged in before redirecting to page otherwise it redirects to home page

import { useAuthContext } from "../contexts/AuthContext";
import {Navigate} from "react-router-dom"

/**
 * ProtectedRoute component for protecting routes that require authentication.
 * Checks if a user is logged in before rendering the child components.
 * If the user is not logged in, redirects to the home page.
 * @component
 * @param {Object} props - The component props.
 * @param {JSX.Element} props.children - The child components to render if the user is authenticated.
 * @returns {JSX.Element} The ProtectedRoute component.
 */
const ProtectedRoute = ({children}) => {
  const {user} = useAuthContext()

  if (!user) {
    return <Navigate to="/" replace />
  }

  //renders protected page since user is logged in
  return children
}

export default ProtectedRoute