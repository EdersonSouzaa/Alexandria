import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGamificacao } from '../context/GamificacaoContext'
import OwlLogo from '../components/OwlLogo'
import RatingStars from '../components/RatingStars'
import logo from '../assets/logo.png'
import heroBookCover from '../assets/hero-book-cover.jpg'
import capaCemAnos from '../assets/shelf-cem-anos-de-solidao.jpg'
import capaGrandeSertao from '../assets/shelf-grande-sertao-veredas.jpg'
import capa1984 from '../assets/shelf-1984.jpg'
import capaDomQuixote from '../assets/shelf-dom-quixote.jpg'
import capaDivinaComedia from '../assets/shelf-divina-comedia.jpg'
import '../styles/landing.css'

const estatisticas = [
  { valor: '48 mil+', rotulo: 'Livros catalogados' },
  { valor: '12 mil+', rotulo: 'Leitores ativos' },
  { valor: '96 mil+', rotulo: 'Resenhas escritas' },
]

const livrosDestaque = [
  { titulo: 'Cem Anos de Solidão', autor: 'Gabriel García Márquez', capa: capaCemAnos },
  { titulo: 'Grande Sertão: Veredas', autor: 'Guimarães Rosa', capa: capaGrandeSertao },
  { titulo: '1984', autor: 'George Orwell', capa: capa1984 },
  { titulo: 'Dom Quixote', autor: 'Miguel de Cervantes', capa: capaDomQuixote },
  { titulo: 'A Divina Comédia', autor: 'Dante Alighieri', capa: capaDivinaComedia },
]

const navLinks = [
  { to: '/explorar', label: 'Descobrir' },
  { to: '/comunidade', label: 'Comunidade' },
]

function IconBusca(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconEstante(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="4" height="18" rx="1" fill="currentColor" />
      <rect x="10" y="3" width="4" height="18" rx="1" fill="currentColor" opacity="0.55" />
      <rect x="17" y="3" width="4" height="18" rx="1" fill="currentColor" />
    </svg>
  )
}

function IconEstrela(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.8L12 2.5z" />
    </svg>
  )
}

function IconTrofeu(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 4h10v4a5 5 0 01-5 5 5 5 0 01-5-5V4z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M7 5H4a3 3 0 003 3M17 5h3a3 3 0 01-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 13v3M9 20h6M10 20v-2a2 2 0 012-2 2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconGrupo(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M15 14.3c2.6.4 4.5 2.6 4.5 5.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconConta(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20c0-3.6 3.1-6.4 7-6.4s7 2.8 7 6.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconMais(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function IconSetaDiagonal(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconSeta(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconMenu(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconClose(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function LandingPage() {
  const { user, logout } = useAuth()
  const { status } = useGamificacao()
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
    setMenuOpen(false)
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
            <img src={logo} alt="Alexandria" className="home__brand-logo" />
          </Link>

          <nav className="home__nav-links">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
            <a href="#sobre">Sobre</a>
          </nav>

          <form className="home__nav-search" onSubmit={handleBuscar}>
            <IconBusca />
            <input
              type="text"
              aria-label="Buscar um livro"
              placeholder="Título, autor, gênero…"
              value={termo}
              onChange={(event) => setTermo(event.target.value)}
            />
            <button type="submit" aria-label="Buscar">
              <IconSeta />
            </button>
          </form>

          <div className="home__nav-actions">
            <span className="home__nav-actions-auth">
              {user ? (
                <>
                  {status && (
                    <Link to="/conquistas" className="home__nav-level">
                      <IconTrofeu width={16} height={16} />
                      Nível {status.nivel}
                    </Link>
                  )}
                  <Link to="/perfil" className="home__nav-icon" aria-label="Meu perfil">
                    <IconConta />
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
          <form className="home__mobile-search" onSubmit={handleBuscar}>
            <IconBusca />
            <input
              type="text"
              aria-label="Buscar um livro"
              placeholder="Busque por título, autor ou gênero…"
              value={termo}
              onChange={(event) => setTermo(event.target.value)}
            />
            <button type="submit" aria-label="Buscar">
              <IconSeta />
            </button>
          </form>

          <nav className="home__mobile-links">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <a href="#sobre" onClick={() => setMenuOpen(false)}>
              Sobre
            </a>
          </nav>
          <div className="home__mobile-actions">
            {user ? (
              <>
                <Link to="/perfil" className="home__btn home__btn--ghost home__btn--block" onClick={() => setMenuOpen(false)}>
                  Meu perfil
                </Link>
                <Link to="/conquistas" className="home__btn home__btn--ghost home__btn--block" onClick={() => setMenuOpen(false)}>
                  Minhas conquistas
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

            <div className="home__hero-actions">
              <Link to={user ? '/inicio' : '/cadastro'} className="home__btn home__btn--primary home__btn--lg">
                Começar a ler
                <IconSetaDiagonal />
              </Link>
              <Link to="/explorar" className="home__btn home__btn--ghost home__btn--lg">
                Explorar catálogo
              </Link>
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

          <div className="home__hero-visual">
            <div className="home__cover-stack">
              <div
                className="home__cover-card home__cover-card--main"
                style={{ backgroundImage: `url(${heroBookCover})` }}
                role="img"
                aria-label="Capa do livro Dom Casmurro, de Machado de Assis"
              />
            </div>
            <div className="home__cover-badge" aria-hidden="true">
              <div className="home__cover-badge-head">
                <IconTrofeu width={18} height={18} />
                Destaque da semana
              </div>
              <h4>Dom Casmurro</h4>
              <p>Machado de Assis</p>
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
          <Link to="/explorar">
            Ver tudo <IconSeta />
          </Link>
        </div>

        <div className="home__shelf">
          {livrosDestaque.map((livro) => (
            <Link
              to={user ? '/explorar' : '/cadastro'}
              className="home__book"
              key={livro.titulo}
            >
              <div className="home__book-cover">
                <div className="home__book-image" style={{ backgroundImage: `url(${livro.capa})` }} />
                <div className="home__book-overlay">
                  <span className="home__book-add">
                    <IconMais />
                  </span>
                </div>
              </div>
              <h4>{livro.titulo}</h4>
              <span>{livro.autor}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home__features-section" id="sobre">
        <div className="home__section-center">
          <span className="home__eyebrow">Por que a Alexandria</span>
          <h2>Tudo que você precisa para ler mais</h2>
          <p>Uma estante digital completa, pensada para quem gosta de acompanhar cada capítulo da própria jornada leitora.</p>
        </div>

        <div className="home__bento">
          <div className="home__bento-card home__bento-card--lg home__bento-card--surface">
            <IconEstante width={140} height={140} className="home__bento-decor" />
            <span className="home__bento-icon">
              <IconEstante />
            </span>
            <h3>Sua estante pessoal</h3>
            <p>Classifique cada livro por quero ler, lendo, lido ou abandonado e nunca perca o fio da sua jornada de leitura.</p>
            <Link to={user ? '/biblioteca' : '/cadastro'} className="home__bento-link">
              Ver minha estante <IconSeta />
            </Link>
          </div>

          <div className="home__bento-card home__bento-card--sm home__bento-card--dark">
            <span className="home__bento-icon">
              <IconGrupo />
            </span>
            <h3>Círculo de leitores</h3>
            <p>Comente, troque indicações e acompanhe o que a comunidade Alexandria está lendo agora.</p>
          </div>

          <div className="home__bento-card home__bento-card--sm home__bento-card--tint">
            <span className="home__bento-icon">
              <IconTrofeu />
            </span>
            <h3>Suba de nível</h3>
            <p>Ganhe XP a cada leitura e resenha, desbloqueie conquistas e evolua como leitor.</p>
          </div>

          <div className="home__bento-card home__bento-card--lg home__bento-card--surface">
            <span className="home__bento-icon">
              <IconEstrela />
            </span>
            <h3>Avalie e compartilhe</h3>
            <p>Dê nota, escreva resenhas completas e veja o que outros leitores acharam de cada obra.</p>
            <div className="home__bento-stars">
              <RatingStars value={5} readOnly />
            </div>
            <Link to={user ? '/avaliacoes' : '/cadastro'} className="home__bento-link">
              Ver avaliações <IconSeta />
            </Link>
          </div>
        </div>
      </section>

      <section className="home__cta">
        <div className="home__cta-inner">
          <div className="home__cta-owl" aria-hidden="true">
            <OwlLogo size={340} />
          </div>
          <div className="home__cta-content">
            <span className="home__eyebrow">Comece hoje</span>
            <h2>Preserve sua própria jornada de leitura.</h2>
            <p>Crie sua conta gratuita e monte sua biblioteca pessoal em poucos minutos — sem custo, sem complicação.</p>
            <Link to={user ? '/inicio' : '/cadastro'} className="home__btn home__btn--gold home__btn--lg">
              {user ? 'Ir para minha estante' : 'Criar minha conta grátis'}
              <IconSetaDiagonal />
            </Link>
          </div>
        </div>
      </section>

      <footer className="home__footer">
        <div className="home__footer-inner">
          <div className="home__footer-brand-col">
            <span className="home__footer-brand-chip">
              <img src={logo} alt="Alexandria" className="home__footer-brand-logo" />
            </span>
            <p className="home__footer-tagline">
              Dedicada à organização e à celebração da leitura, uma estante digital de cada vez.
            </p>
          </div>

          <div className="home__footer-cols">
            <div className="home__footer-col">
              <h5>Explorar</h5>
              <ul>
                <li>
                  <Link to="/explorar">Catálogo</Link>
                </li>
                <li>
                  <Link to="/comunidade">Comunidade</Link>
                </li>
                <li>
                  <Link to="/conquistas">Conquistas</Link>
                </li>
              </ul>
            </div>
            <div className="home__footer-col">
              <h5>Minha conta</h5>
              <ul>
                <li>
                  <Link to={user ? '/biblioteca' : '/login'}>Minha biblioteca</Link>
                </li>
                <li>
                  <Link to={user ? '/avaliacoes' : '/login'}>Minhas avaliações</Link>
                </li>
                <li>
                  <Link to={user ? '/perfil' : '/cadastro'}>{user ? 'Meu perfil' : 'Criar conta'}</Link>
                </li>
              </ul>
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
