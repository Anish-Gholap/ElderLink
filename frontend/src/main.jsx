import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import withErrorBoundary from './contexts/withErrorBoundary.jsx'

const AppWithErrorBoundary = withErrorBoundary(App)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppWithErrorBoundary />
    </BrowserRouter>
  </StrictMode>,
)