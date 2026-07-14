import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import OwlLogo from '../components/OwlLogo'
import '../styles/landing.css'

const estatisticas = [
  { valor: '48 mil+', rotulo: 'livros catalogados' },
  { valor: '12 mil+', rotulo: 'leitores ativos' },
  { valor: '96 mil+', rotulo: 'resenhas escritas' },
]

const livrosDestaque = [
  { titulo: 'Marés de Ferro', autor: 'Rodrigo Vasconcelos', cor: 'tan' },
  { titulo: 'Cidade de Sal', autor: 'Ana Beatriz Prado', cor: 'green', badge: 'Novo' },
  { titulo: 'Reino de Cinzas', autor: 'Luiza Monteiro', cor: 'blue' },
  { titulo: 'A Sombra do Farol', autor: 'Camila Rezende', cor: 'red' },
  { titulo: 'O Jardim de Vidro', autor: 'Helena Duarte', cor: 'brown' },
]

const recursos = [
  {
    titulo: 'Organize sua estante',
    descricao: 'Classifique cada livro por quero ler, lendo, lido ou abandonado.',
    icon: <IconEstante />,
  },
  {
    titulo: 'Avalie e comente',
    descricao: 'Dê nota, escreva resenhas e compartilhe com a comunidade.',
    icon: <IconEstrela />,
  },
  {
    titulo: 'Evolua lendo',
    descricao: 'Ganhe XP, suba de nível e desbloqueie conquistas a cada leitura.',
    icon: <IconRaio />,
  },
]

const passos = [
  {
    titulo: 'Crie sua conta',
    descricao: 'Cadastro rápido e gratuito — leve menos de um minuto para começar.',
  },
  {
    titulo: 'Monte sua estante',
    descricao: 'Adicione os livros que já leu, está lendo ou ainda quer conhecer.',
  },
  {
    titulo: 'Evolua e compartilhe',
    descricao: 'Ganhe XP, conquiste medalhas e troque ideias com outros leitores.',
  },
]

const navLinks = [
  { to: '/explorar', label: 'Descobrir' },
  { to: '/comunidade', label: 'Comunidade' },
]

function IconBusca() {
  return (
    <svg className="home__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconEstante() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="4" height="18" rx="1" fill="currentColor" />
      <rect x="10" y="3" width="4" height="18" rx="1" fill="currentColor" opacity="0.55" />
      <rect x="17" y="3" width="4" height="18" rx="1" fill="currentColor" />
    </svg>
  )
}

function IconEstrela() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.8L12 2.5z" />
    </svg>
  )
}

function IconRaio() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  )
}

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function LandingPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [termo, setTermo] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleBuscar(event) {
    event.preventDefault()
    if (user) {
      navigate(`/explorar?termo=${encodeURIComponent(termo)}`)
    } else {
      navigate('/cadastro')
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="home">
      <header className={`home__nav${scrolled ? ' home__nav--scrolled' : ''}`}>
        <div className="home__nav-inner">
          <Link to="/" className="home__brand">
            <span className="home__brand-badge">
              <OwlLogo size={22} />
            </span>
            <span>Alexandria</span>
          </Link>

          <nav className="home__nav-links">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
            <a href="#recursos">Recursos</a>
          </nav>

          <div className="home__nav-actions">
            <span className="home__nav-actions-auth">
              {user ? (
                <>
                  <Link to="/perfil" className="home__nav-user">
                    {user.name}
                  </Link>
                  <button type="button" className="home__btn home__btn--dark" onClick={handleLogout}>
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="home__btn home__btn--ghost">
                    Entrar
                  </Link>
                  <Link to="/cadastro" className="home__btn home__btn--primary">
                    Criar conta
                  </Link>
                </>
              )}
            </span>

            <button
              type="button"
              className="home__nav-toggle"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>

        <div className="home__mobile-menu" hidden={!menuOpen}>
          <nav className="home__mobile-links">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <a href="#recursos" onClick={() => setMenuOpen(false)}>
              Recursos
            </a>
          </nav>
          <div className="home__mobile-actions">
            {user ? (
              <>
                <Link to="/perfil" className="home__btn home__btn--ghost home__btn--block" onClick={() => setMenuOpen(false)}>
                  Meu perfil
                </Link>
                <button
                  type="button"
                  className="home__btn home__btn--dark home__btn--block"
                  onClick={() => {
                    setMenuOpen(false)
                    handleLogout()
                  }}
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="home__btn home__btn--ghost home__btn--block" onClick={() => setMenuOpen(false)}>
                  Entrar
                </Link>
                <Link to="/cadastro" className="home__btn home__btn--primary home__btn--block" onClick={() => setMenuOpen(false)}>
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="home__hero">
        <div className="home__hero-inner">
          <div className="home__hero-copy">
            <span className="home__eyebrow">
              <span className="home__eyebrow-dot" />
              Sua biblioteca, sua jornada
            </span>
            <h1>
              Organize suas leituras com a alma da <em>antiga Alexandria</em>
            </h1>
            <p>
              Pesquise livros, monte sua estante pessoal, acompanhe seu progresso e evolua a cada
              página lida — junto de uma comunidade de leitores.
            </p>

            <form className="home__search" onSubmit={handleBuscar}>
              <IconBusca />
              <input
                type="text"
                aria-label="Buscar um livro"
                placeholder="Busque por título, autor ou gênero…"
                value={termo}
                onChange={(event) => setTermo(event.target.value)}
              />
              <button type="submit" className="home__btn home__btn--primary">
                Buscar
              </button>
            </form>

            <div className="home__hero-actions">
              <Link to={user ? '/explorar' : '/cadastro'} className="home__btn home__btn--dark home__btn--lg">
                {user ? 'Ir para o catálogo' : 'Criar conta grátis'}
              </Link>
              <a href="#recursos" className="home__btn home__btn--ghost home__btn--lg">
                Ver como funciona
              </a>
            </div>

            <div className="home__stats">
              {estatisticas.map((item) => (
                <div className="home__stat" key={item.rotulo}>
                  <strong>{item.valor}</strong>
                  <span>{item.rotulo}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="home__hero-visual" aria-hidden="true">
            <div className="home__cover-stack">
              <div className="home__cover-card home__cover-card--back" />
              <div className="home__cover-card home__cover-card--main">
                <span className="home__cover-status">Lendo agora</span>
                <span className="home__cover-title">Ecos de Alexandria</span>
                <span className="home__cover-author">Nuno Barreto</span>
                <div className="home__cover-progress">
                  <span />
                </div>
              </div>
              <div className="home__float-chip home__float-chip--rating">
                <IconEstrela />
                <div>
                  <strong>4.9 / 5</strong>
                  <span>avaliação média</span>
                </div>
              </div>
              <div className="home__float-chip home__float-chip--xp">
                <IconRaio />
                <div>
                  <strong>+120 XP</strong>
                  <span>a cada livro concluído</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home__shelf-section">
        <div className="home__section-head">
          <div>
            <span className="home__eyebrow">Catálogo</span>
            <h2>Em destaque agora</h2>
          </div>
          <Link to="/explorar">Ver tudo →</Link>
        </div>

        <div className="home__shelf">
          {livrosDestaque.map((livro) => (
            <div className={`home__spine home__spine--${livro.cor}`} key={livro.titulo}>
              {livro.badge && <span className="home__spine-badge">{livro.badge}</span>}
              <span className="home__spine-title">{livro.titulo}</span>
              <span className="home__spine-author">{livro.autor}</span>
            </div>
          ))}
        </div>
        <div className="home__shelf-bar" aria-hidden="true" />
      </section>

      <section className="home__features-section" id="recursos">
        <div className="home__section-center">
          <span className="home__eyebrow">Por que a Alexandria</span>
          <h2>Tudo que você precisa para ler mais</h2>
          <p>Uma estante digital completa, pensada para quem gosta de acompanhar cada capítulo da própria jornada leitora.</p>
        </div>

        <div className="home__features">
          {recursos.map((item) => (
            <div className="home__feature-card" key={item.titulo}>
              <span className="home__feature-icon">{item.icon}</span>
              <h3>{item.titulo}</h3>
              <p>{item.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home__steps-section" id="como-funciona">
        <div className="home__section-center">
          <span className="home__eyebrow">Como funciona</span>
          <h2>Comece em três passos simples</h2>
        </div>

        <div className="home__steps">
          {passos.map((passo, index) => (
            <div className="home__step" key={passo.titulo}>
              <span className="home__step-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{passo.titulo}</h3>
              <p>{passo.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home__cta-banner">
        <div className="home__cta-inner">
          <div className="home__cta-text">
            <h2>Pronto para organizar sua próxima leitura?</h2>
            <p>Crie sua conta gratuita e comece a montar sua estante em poucos minutos.</p>
          </div>
          <Link to={user ? '/explorar' : '/cadastro'} className="home__btn home__btn--gold home__btn--lg">
            {user ? 'Explorar catálogo' : 'Criar conta grátis'}
          </Link>
        </div>
      </section>

      <footer className="home__footer">
        <div className="home__footer-inner">
          <div className="home__footer-brand-col">
            <span className="home__footer-brand">
              <span className="home__footer-brand-badge">
                <OwlLogo size={20} />
              </span>
              Alexandria
            </span>
            <p className="home__footer-tagline">
              Sua biblioteca pessoal, com a alma da antiga Alexandria — organize, avalie e evolua a cada leitura.
            </p>
          </div>

          <div className="home__footer-links">
            <div className="home__footer-col">
              <h4>Produto</h4>
              <Link to="/explorar">Descobrir</Link>
              <Link to="/comunidade">Comunidade</Link>
              <a href="#recursos">Recursos</a>
              <a href="#como-funciona">Como funciona</a>
            </div>
            <div className="home__footer-col">
              <h4>Conta</h4>
              <Link to="/login">Entrar</Link>
              <Link to="/cadastro">Criar conta</Link>
            </div>
          </div>
        </div>

        <div className="home__footer-bottom">
          <div className="home__footer-bottom-inner">
            <span>© {new Date().getFullYear()} Alexandria. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
