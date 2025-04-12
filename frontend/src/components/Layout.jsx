import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import ChatWindow from "./ChatWindow";

/**
 * Layout component for wrapping the application's pages.
 * Conditionally renders the NavBar and ChatWindow components based on the current route.
 * Ensures that certain pages (e.g., login, signup) do not display the NavBar or ChatWindow.
 * @component
 * @param {Object} props - The component props.
 * @param {JSX.Element} props.children - The child components to render within the layout.
 * @returns {JSX.Element} The Layout component.
 */
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