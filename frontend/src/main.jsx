import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#0d1f3c',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Site Under Maintenance</h1>
      <p style={{ fontSize: '1.2rem', color: '#a0aec0' }}>We are making some upgrades. We will be back shortly!</p>
    </div>
  </StrictMode>,
)

