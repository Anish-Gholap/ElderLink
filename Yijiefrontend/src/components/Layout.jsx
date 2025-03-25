import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = ({children}) => {
  const location = useLocation()

  // hide navbar on home and login pages
  const hideNavBar = location.pathname === "/" || location.pathname === "/login"

  return (
    <div className="layout">
      {/*Conditional Rendering*/}
      {!hideNavBar && <NavBar />}
      {children}
    </div>
  )
}

export default Layout