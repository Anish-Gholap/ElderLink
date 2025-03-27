import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"
import { useNotificationsContext } from "../contexts/NotificationsContext"
import "../css/navbar.css"
import { Box } from "@mui/material"
import NotificationsDialog from "./NotificationsDialog"


const NavBar = () => {
  const { logout } = useAuthContext()
  const { notifications } = useNotificationsContext()
  const [openNotifications, setOpenNotifications] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [showSidebar, setShowSidebar] = useState(false)

  const toggleSidebar = () => setShowSidebar(!showSidebar)
  const closeSidebar = () => {
    setShowSidebar(false);
    setOpenNotifications(false);
  }

  // sample notification only for testing
  /*const notifications = [
    {
      userId: "123",
      eventId: "456",
      message: "Event has been amended",
      createdAt: new Date().toDateString(),
      read: false
    },
    {
      userId: "123",
      eventId: "456",
      message: "Event has been deleted",
      createdAt: new Date().toDateString(),
      read: true
    }
  ]
    */

  return (
    <>
      <nav className="navbar">
        <button className="burger-btn" onClick={toggleSidebar}>☰</button>
        <div className="logo">
          <Box display="flex" alignItems="center">
            <img src="/image 28.png" alt="ElderLink Logo" style={{
              width: 40,
              height: 40,
              marginRight: 10
            }} />
            ElderLink
          </Box>
        </div>
        <ul className="nav-links">
          {location.pathname !== "/event-discovery" && (
            <li>
              <Link to={-1}>Go Back</Link>
            </li>
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
              <li >
                <div onClick={() => { console.log("open notif"); setOpenNotifications(true) }}>
                  Notifications
                </div>
                <NotificationsDialog
                  notifications={[...notifications].reverse()}  // Reverse the notifications array before passing
                  open={openNotifications}
                  onClose={() => {
                    console.log("close notif");
                    setOpenNotifications(false)
                  }}
                />
              </li>
              <hr />
              <li onClick={() => { navigate("/profile"); closeSidebar() }}>
                Profile Page
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default NavBar
