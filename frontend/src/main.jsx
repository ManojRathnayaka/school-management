// React imports
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Style imports
import './index.css'

// Component imports
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
