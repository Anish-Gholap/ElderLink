import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = ({children}) => {
  const location = useLocation()

  const pagesWithoutNavBar = ["/", "/login", "/signup", "/forgot-password"]

  // hide navbar on home and login pages
  const hideNavBar = pagesWithoutNavBar.includes(location.pathname)
  
  return (
    <div className="layout">
      {/*Conditional Rendering*/}
      {!hideNavBar && <NavBar />}
      {children}
    </div>
  )
}

export default Layout