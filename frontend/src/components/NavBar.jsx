import { useState, useMemo } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"
import { useNotificationsContext } from "../contexts/NotificationsContext"
import "../css/navbar.css"
import { Box, IconButton } from "@mui/material"
import NotificationsDialog from "./NotificationsDialog"
import { FaBell } from "react-icons/fa6"




const NavBar = () => {
  const { user, logout } = useAuthContext()
  const { notifications, removeNotification } = useNotificationsContext()
  const [openNotifications, setOpenNotifications] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [showSidebar, setShowSidebar] = useState(false)

  const toggleSidebar = () => setShowSidebar(!showSidebar)
  const closeSidebar = () => {
    setShowSidebar(false);
    setOpenNotifications(false);
  }

  const handleDelete = (UserId, notificationId) => {
    if (notificationId) {
      removeNotification(UserId, notificationId)
    }
  }

  const notificationsArray = useMemo(() => {
    return Array.isArray(notifications) ? [...notifications].reverse() : []
  }, [notifications])



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
        <Box>
          <IconButton size="large" color="inherit">
            <FaBell  onClick={() => setOpenNotifications(true)} />
              <span style={{ 
                position: 'absolute', 
                top: 5, 
                right: 1, 
                color: 'white', 
                backgroundColor:"red", 
                borderRadius: '50%', 
                padding: '2px 6px', 
                fontSize: '12px'
                 }}>
                {String(notificationsArray.length)}
              </span>
          </IconButton>
          <NotificationsDialog
                  notifications={notificationsArray.reverse()}  // Reverse the notifications array before passing
                  open={openNotifications}
                  handleDelete={handleDelete}
                  userId={user.id}
                  onClose={() => {
                    console.log("close notif");
                    setOpenNotifications(false)
                  }}
                />
          <button style={{ marginLeft: 6 }} className="logout-btn" onClick={logout}>Logout</button>
        </Box>
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
