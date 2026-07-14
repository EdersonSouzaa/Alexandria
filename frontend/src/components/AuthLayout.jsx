import { Link } from 'react-router-dom'
import './AuthLayout.css'

export default function AuthLayout({ active, children }) {
  return (
    <div className="auth-split">
      <div className="auth-split__left">
        <div className="auth-split__brand">
          <span className="auth-split__badge" aria-hidden="true">🦉</span>
          <span className="auth-split__brand-name">Alexandria</span>
        </div>

        <h1 className="auth-split__headline">Cada leitura é um novo capítulo da sua história.</h1>
        <p className="auth-split__text">
          Entre para continuar sua jornada de leitura e acompanhar sua evolução.
        </p>
      </div>

      <div className="auth-split__right">
        <div className="auth-split__card">
          <div className="auth-tabs">
            <Link
              to="/login"
              className={`auth-tabs__item${active === 'login' ? ' auth-tabs__item--active' : ''}`}
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className={`auth-tabs__item${active === 'register' ? ' auth-tabs__item--active' : ''}`}
            >
              Criar conta
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
