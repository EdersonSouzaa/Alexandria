import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import XPToast from './components/XPToast'
import AppRoutes from './routes/AppRoutes'

function App() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <>
      {!isHome && <Navbar />}
      <AppRoutes />
      <XPToast />
    </>
  )
}

export default App
