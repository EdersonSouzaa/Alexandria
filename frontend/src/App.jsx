import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import XPToast from './components/XPToast'
import AppRoutes from './routes/AppRoutes'

const FULL_BLEED_ROUTES = ['/', '/login', '/cadastro', '/inicio', '/explorar', '/biblioteca', '/avaliacoes', '/comunidade']

function App() {
  const { pathname } = useLocation()
  const hideNavbar = FULL_BLEED_ROUTES.includes(pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AppRoutes />
      <XPToast />
    </>
  )
}

export default App
