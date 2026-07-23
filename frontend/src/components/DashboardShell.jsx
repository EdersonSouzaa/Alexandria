import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGamificacao } from '../context/GamificacaoContext'
import OwlLogo from './OwlLogo'
import { IconUsuario } from './AuthIcons'
import {
  IconBusca,
  IconSino,
  IconEstante,
  IconPessoas,
  IconEstrela,
  IconTrofeu,
  IconInicio,
  IconMenu,
  IconClose,
  IconSair,
  IconSetaCima,
  iniciais,
} from './DashboardIcons'
import '../styles/dashboard.css'

const SIDEBAR_LINKS = [
  { to: '/inicio', label: 'Início', icon: IconInicio },
  { to: '/explorar', label: 'Explorar', icon: IconBusca },
  { to: '/biblioteca', label: 'Biblioteca', icon: IconEstante },
  { to: '/avaliacoes', label: 'Avaliações', icon: IconEstrela },
  { to: '/comunidade', label: 'Comunidade', icon: IconPessoas },
  { to: '/conquistas', label: 'Conquistas', icon: IconTrofeu },
]

export default function DashboardShell({
  active,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Buscar…',
  children,
}) {
  const { user, logout } = useAuth()
  const { status } = useGamificacao()
  const navigate = useNavigate()

  const [sidebarAberta, setSidebarAberta] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const [mostrarFab, setMostrarFab] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuAberto) return
    function handleClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAberto(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuAberto])

  useEffect(() => {
    function onScroll() {
      setMostrarFab(window.scrollY > 400)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="dash__shell">
        {sidebarAberta && <div className="dash__sidebar-backdrop" onClick={() => setSidebarAberta(false)} />}

        <aside className={`dash__sidebar${sidebarAberta ? ' dash__sidebar--open' : ''}`}>
          <Link to="/inicio" className="dash__sidebar-brand" onClick={() => setSidebarAberta(false)}>
            <span className="dash__sidebar-brand-badge">
              <OwlLogo size={20} />
            </span>
            <span>Alexandria</span>
          </Link>

          <nav className="dash__sidebar-nav">
            {SIDEBAR_LINKS.map((link) => {
              const Icone = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`dash__sidebar-link${link.to === active ? ' dash__sidebar-link--active' : ''}`}
                  onClick={() => setSidebarAberta(false)}
                >
                  <Icone />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="dash__sidebar-foot">
            <div className="dash__sidebar-user">
              <div className="dash__sidebar-user-top">
                <span className="dash__sidebar-user-avatar">{iniciais(user?.name)}</span>
                <div className="dash__sidebar-user-text">
                  <p className="dash__sidebar-user-name">{user?.name}</p>
                  <p className="dash__sidebar-user-level">Nível {status?.nivel ?? 1}</p>
                </div>
              </div>
              <div className="dash__sidebar-user-bar">
                <div
                  className="dash__sidebar-user-bar-fill"
                  style={{ width: `${Math.min(100, Math.max(0, 100 - (status?.xpParaProximoNivel ?? 100)))}%` }}
                />
              </div>
              <Link to="/conquistas" className="dash__sidebar-user-link" onClick={() => setSidebarAberta(false)}>
                Ver conquistas
              </Link>
            </div>

            <div className="dash__sidebar-foot-links">
              <Link to="/perfil" className="dash__sidebar-foot-link" onClick={() => setSidebarAberta(false)}>
                <IconUsuario width={18} height={18} />
                <span>Meu perfil</span>
              </Link>
              <button type="button" className="dash__sidebar-foot-link" onClick={handleLogout}>
                <IconSair />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="dash__main">
          <header className="dash__header">
            <div className="dash__header-inner">
              <button
                type="button"
                className="dash__menu-toggle"
                aria-label="Abrir menu"
                onClick={() => setSidebarAberta(true)}
              >
                <IconMenu />
              </button>

              {onSearchSubmit && (
                <form className="dash__search" onSubmit={onSearchSubmit}>
                  <IconBusca />
                  <input
                    type="text"
                    aria-label={searchPlaceholder}
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                  />
                </form>
              )}

              <div className="dash__header-actions">
                <Link to="/comunidade" className="dash__icon-btn" aria-label="Novidades da comunidade">
                  <IconSino />
                </Link>

                <Link to="/conquistas" className="dash__icon-btn" aria-label="Minhas conquistas">
                  <IconTrofeu />
                </Link>

                <div className="dash__avatar-wrap" ref={menuRef}>
                  <button
                    type="button"
                    className="dash__avatar"
                    onClick={() => setMenuAberto((open) => !open)}
                    aria-haspopup="true"
                    aria-expanded={menuAberto}
                  >
                    {iniciais(user?.name)}
                  </button>
                  {menuAberto && (
                    <div className="dash__avatar-menu">
                      <div className="dash__avatar-menu-name">{user?.name}</div>
                      <Link to="/perfil" onClick={() => setMenuAberto(false)}>
                        Meu perfil
                      </Link>
                      <Link to="/biblioteca" onClick={() => setMenuAberto(false)}>
                        Minha estante
                      </Link>
                      <Link to="/conquistas" onClick={() => setMenuAberto(false)}>
                        Conquistas
                      </Link>
                      <button type="button" onClick={handleLogout}>
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="dash__inner">{children}</div>
        </div>
      </div>

      <button
        type="button"
        className="dash__fab"
        aria-label="Voltar ao topo"
        onClick={scrollToTop}
        style={{ opacity: mostrarFab ? 1 : 0, pointerEvents: mostrarFab ? 'auto' : 'none' }}
      >
        <IconSetaCima />
      </button>
    </>
  )
}
