import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"
import "../css/navbar.css"

const BackButton = () => {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate(-1)}>
      return
    </button>
  )
}

const NavBar = () => {
  const { logout } = useAuthContext()
  const location = useLocation()
  const navigate = useNavigate()
  const [showSidebar, setShowSidebar] = useState(false)

  const toggleSidebar = () => setShowSidebar(!showSidebar)
  const closeSidebar = () => setShowSidebar(false)

  return (
    <>
      <nav className="navbar">
        <button className="burger-btn" onClick={toggleSidebar}>☰</button>
        <div className="logo">ElderLink</div>
        <ul className="nav-links">
          {location.pathname !== "/event-discovery" && (
            <li><BackButton /></li>
          )}
          <li><Link to="/events-management">Manage Events</Link></li>
          <li><button className="logout-btn" onClick={logout}>Logout</button></li>
        </ul>
      </nav>

      {showSidebar && (
        <div className="sidebar-overlay" onClick={closeSidebar}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
              <h2 className="sidebar-title">ElderLink</h2>
              <button onClick={closeSidebar}>❌</button>
            </div>
            <ul className="sidebar-links">
              <li onClick={() => { navigate("/event-discovery"); closeSidebar() }}>
                Events Discovery
              </li>
              <hr />
              <li onClick={() => { navigate("/events-management"); closeSidebar() }}>
                Events Management 
              </li>
              <hr />
              <li onClick={() => { navigate("/notifictions"); closeSidebar() }}>
                Notifications
                (To Implement)
              </li>
              <hr />
              <li onClick={() => { navigate("/profile"); closeSidebar() }}>
                Profile Page 
                (To Implement)
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default NavBar
