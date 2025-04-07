import './App.css'
import {Route, Routes} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import {EventsProvider} from './contexts/EventsContext'
import Home from './pages/Home'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import EventDiscovery from './pages/EventDiscovery'
import { NotificationsProvider } from './contexts/NotificationsContext'
import Layout from './components/Layout'
import ManageEvents from './pages/ManageEvents'
import CreateEvent from './pages/CreateEvent'
import EventDetails from './pages/EventDetails'
import EditEvent from './pages/EditEvent'
import SignUp from './pages/SignUp'
import EventAttendance from './pages/EventAttendance'
import Profile from './pages/Profile'
import { UsersProvider } from './contexts/UsersContext'
import { Typography } from '@mui/material'
import ForgotPassword from './pages/ForgotPassword'

const App = () => {
  return (
    <AuthProvider>
      <UsersProvider>
      <EventsProvider>
      <NotificationsProvider>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            {/* Protected Route for Pages only accessible after login */}
            <Route path='/event-discovery' element= {
              <ProtectedRoute>
                <EventDiscovery />
              </ProtectedRoute>
            } />
            <Route path='/events-management' element= {
              <ProtectedRoute>
                <ManageEvents />
              </ProtectedRoute>
            } />
            <Route path='/create-event' element= {
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            } />
            <Route path='/events/:eventId' element= {
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            } />
            <Route path='/events/:eventId/edit' element= {
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            } />
            <Route path='/attending-events' element= {
              <ProtectedRoute>
                <EventAttendance />
              </ProtectedRoute>
            } />
            <Route path='/profile' element= {
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            {/* 404 Route */}
            <Route path='*' element={<Typography variant="h5" textAlign="center" mt={5} fontWeight={400}>
              Oops! That URL doesn't seem to exist. Please check the address!
            </Typography>} />
          </Routes>
        </Layout>
        </NotificationsProvider>
      </EventsProvider>
      </UsersProvider>
    </AuthProvider>
  )
}

export default App