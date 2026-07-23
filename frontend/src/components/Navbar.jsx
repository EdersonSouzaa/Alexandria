import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'
import './Navbar.css'

const linksAutenticado = [
  { to: '/inicio', label: 'Início' },
  { to: '/explorar', label: 'Explorar' },
  { to: '/biblioteca', label: 'Biblioteca' },
  { to: '/avaliacoes', label: 'Avaliações' },
  { to: '/comunidade', label: 'Comunidade' },
  { to: '/conquistas', label: 'Conquistas' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to={user ? '/inicio' : '/'} className="navbar__brand">
          <img src={logo} alt="Alexandria" className="navbar__brand-logo" />
        </Link>

        {user && (
          <nav className="navbar__links">
            {linksAutenticado.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="navbar__actions">
          {user ? (
            <>
              <Link to="/perfil" className="navbar__user">
                {user.name}
              </Link>
              <button className="navbar__logout" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__login">
                Entrar
              </Link>
              <Link to="/cadastro" className="navbar__cta">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
