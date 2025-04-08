import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import ChatWindow from "./ChatWindow";



const Layout = ({children}) => {
  const location = useLocation()

  const pagesWithoutNavBar = ["/", "/login", "/signup", "/forgot-password"]

  // hide navbar on home and login pages
  const hideNavBar = pagesWithoutNavBar.includes(location.pathname)
  
  return (
    <div className="layout" style={{
      position: "relative",
    }}>
      {/*Conditional Rendering*/}
      {!hideNavBar && <NavBar />}
      {!hideNavBar && <ChatWindow/>}
      {children}
    </div>
  )
}


export default Layout