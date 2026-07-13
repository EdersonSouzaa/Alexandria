import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/global.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { GamificacaoProvider } from './context/GamificacaoContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GamificacaoProvider>
          <App />
        </GamificacaoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
