import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {

  // clear localStorage to force login if HomePage was loaded outside of app flow
  useEffect(() => {
    window.localStorage.clear()
    console.log("local storage cleared")
  }, [])
  
  return (
    <div>
      <h2> Welcome to ElderLink </h2>
      <p> Login To Begin </p>
      <Link to="/login">
        <button>
          Login
        </button>
      </Link>
    </div>
  )
}

export default Home