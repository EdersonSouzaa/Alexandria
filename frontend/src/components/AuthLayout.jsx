import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { IconEstrela } from './AuthIcons'
import './AuthLayout.css'

export default function AuthLayout({ active, title, subtitle, children }) {
  return (
    <div className="auth-shell">
      <div className="auth-shell__blob auth-shell__blob--a" aria-hidden="true" />
      <div className="auth-shell__blob auth-shell__blob--b" aria-hidden="true" />

      <main className="auth-shell__main">
        <div className="auth-shell__inner">
          <div className="auth-shell__brand">
            <img src={logo} alt="Alexandria" className="auth-shell__logo" />
            <p>Sua estante digital</p>
          </div>

          <div className="auth-shell__card">
            <div className="auth-shell__card-edge" aria-hidden="true" />

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

            {title && <h2 className="auth-shell__title">{title}</h2>}
            {subtitle && <p className="auth-shell__subtitle">{subtitle}</p>}

            {children}
          </div>

          <div className="auth-shell__deco">
            <div className="auth-shell__stars" aria-hidden="true">
              <IconEstrela />
              <IconEstrela />
              <IconEstrela />
            </div>
            <p>ALEXANDRIA · EST. MMXXIV</p>
          </div>
        </div>
      </main>
    </div>
  )
}
