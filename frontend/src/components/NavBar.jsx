import { Link } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"
import "../css/navbar.css"
import { useNavigate, useLocation } from "react-router-dom"

const BackButton = () => {
  const navigate = useNavigate()

  return (
    <button onClick={() => navigate(-1)}>
      return
    </button>
  )
}

const NavBar = () => {
  const {logout} = useAuthContext()

  const currentPage = useLocation()
  console.log("Current Page: ", currentPage)

  return (
    <nav className="navbar">
      <div className="logo">ElderLink</div>
      <ul className='nav-links'>
        {location.pathname !== "/event-discovery" && <li><BackButton /></li>}
        <li><Link to="/events-management">Manage Events</Link></li>
        <li><button onClick={logout}>Logout</button></li>
      </ul>
    </nav>
  )
}

export default NavBar