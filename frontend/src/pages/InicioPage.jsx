import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGamificacao } from '../context/GamificacaoContext'
import { bibliotecaService } from '../services/bibliotecaService'
import { comunidadeService } from '../services/comunidadeService'
import OwlLogo from '../components/OwlLogo'
import { IconUsuario } from '../components/AuthIcons'
import '../styles/inicio.css'

const SIDEBAR_LINKS = [
  { to: '/inicio', label: 'Início', icon: 'inicio' },
  { to: '/explorar', label: 'Explorar', icon: 'busca' },
  { to: '/biblioteca', label: 'Biblioteca', icon: 'estante' },
  { to: '/avaliacoes', label: 'Avaliações', icon: 'estrela' },
  { to: '/comunidade', label: 'Comunidade', icon: 'pessoas' },
  { to: '/conquistas', label: 'Conquistas', icon: 'trofeu' },
]

const TITULOS_NIVEL = [
  { min: 16, titulo: 'Lenda Literária' },
  { min: 11, titulo: 'Sábio de Alexandria' },
  { min: 7, titulo: 'Guardião dos Pergaminhos' },
  { min: 4, titulo: 'Leitor Dedicado' },
  { min: 1, titulo: 'Leitor Iniciante' },
]

const CORES_TILE = ['#c8934c', '#51637a', '#33241a', '#3f5940', '#8a3a2f', '#7c6f42', '#4a3524']

function tituloNivel(nivel) {
  return TITULOS_NIVEL.find((item) => nivel >= item.min)?.titulo ?? 'Leitor Iniciante'
}

function iniciais(nome) {
  if (!nome) return '?'
  const partes = nome.trim().split(/\s+/)
  const letras = partes.length > 1 ? [partes[0][0], partes[partes.length - 1][0]] : [partes[0][0]]
  return letras.join('').toUpperCase()
}

function descricaoPost(post) {
  const primeiraLinha = post.conteudo.split('\n')[0].trim()
  if (post.autorNome && primeiraLinha.startsWith(post.autorNome)) {
    const resto = primeiraLinha.slice(post.autorNome.length).trim()
    return resto || primeiraLinha
  }
  return primeiraLinha
}

function IconBusca() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconSino() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9a6 6 0 1112 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M10 19a2 2 0 004 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconEstante() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="4" height="18" rx="1" fill="currentColor" />
      <rect x="10" y="3" width="4" height="18" rx="1" fill="currentColor" opacity="0.55" />
      <rect x="17" y="3" width="4" height="18" rx="1" fill="currentColor" />
    </svg>
  )
}

function IconPessoas() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M15.5 5.3a3.2 3.2 0 010 6M20 20c0-2.8-1.9-5.1-4.5-5.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconLivro() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5c-.8 0-1.5-.7-1.5-1.5v-13z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5c.8 0 1.5-.7 1.5-1.5v-13z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconEstrela() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.8L12 2.5z" />
    </svg>
  )
}

function IconCoracao() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 20.5s-7.5-4.6-10-9.3C.4 7.8 2 4.5 5.3 4a4.9 4.9 0 016.7 2 4.9 4.9 0 016.7-2c3.3.5 4.9 3.8 3.3 7.2-2.5 4.7-10 9.3-10 9.3z" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconCadeado() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7.5a4 4 0 018 0V11" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function IconTrofeu() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 4h10v5a5 5 0 01-10 0V4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M5 6H3v1a4 4 0 003.5 4M19 6h2v1a4 4 0 01-3.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 15.5h4M12 15.5V19M9 20.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconInicio() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 11l8-7 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 001 1h10a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
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

function IconSair() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 4H6a1 1 0 00-1 1v14a1 1 0 001 1h9M11 12h9m0 0l-3.5-3.5M20 12l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconMais() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

const SIDEBAR_ICONS = {
  inicio: IconInicio,
  busca: IconBusca,
  estante: IconEstante,
  estrela: IconEstrela,
  pessoas: IconPessoas,
  trofeu: IconTrofeu,
}

function LivroTile({ item, index }) {
  const livro = item.livro
  const cor = CORES_TILE[index % CORES_TILE.length]
  return (
    <Link
      to={`/livros/${livro.identificadorExterno}`}
      className="dash__tile"
      style={{
        backgroundImage: livro.capa ? `url(${livro.capa})` : undefined,
        backgroundColor: cor,
      }}
    >
      <span className="dash__tile-title">{livro.titulo}</span>
      {livro.autor && <span className="dash__tile-author">{livro.autor}</span>}
    </Link>
  )
}

export default function InicioPage() {
  const { user, logout } = useAuth()
  const { status, refresh } = useGamificacao()
  const navigate = useNavigate()

  const [itens, setItens] = useState([])
  const [feed, setFeed] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [termoBusca, setTermoBusca] = useState('')
  const [menuAberto, setMenuAberto] = useState(false)
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const [itensResp, feedResp] = await Promise.all([
          bibliotecaService.listar({}),
          comunidadeService.listarFeed({ pagina: 0, tamanhoPagina: 3 }),
        ])
        setItens(itensResp)
        setFeed(feedResp)
      } catch {
        setErro('Não foi possível carregar seu painel agora. Tente novamente em instantes.')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handleBuscar(event) {
    event.preventDefault()
    navigate(`/explorar?termo=${encodeURIComponent(termoBusca)}`)
  }

  if (carregando && !feed) {
    return (
      <div className="dash">
        <div className="dash__loading">
          <span className="dash__spinner" />
          <span>Preparando sua estante…</span>
        </div>
      </div>
    )
  }

  const lendo = [...itens]
    .filter((item) => item.statusLeitura === 'LENDO')
    .sort((a, b) => new Date(b.atualizadoEm) - new Date(a.atualizadoEm))
  const queroLer = itens.filter((item) => item.statusLeitura === 'QUERO_LER')

  const destaque = lendo[0] ?? queroLer[0] ?? null
  const destaqueEmAndamento = Boolean(lendo[0])

  const nivel = status?.nivel ?? 1
  const xpParaProximoNivel = status?.xpParaProximoNivel ?? 100
  const xpAtualNivel = Math.min(100, Math.max(0, 100 - xpParaProximoNivel))
  const badgesDestaque = status?.conquistas?.slice(0, 3) ?? []
  const estatisticas = status?.estatisticas

  return (
    <div className="dash">
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
              const Icone = SIDEBAR_ICONS[link.icon]
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`dash__sidebar-link${link.to === '/inicio' ? ' dash__sidebar-link--active' : ''}`}
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

              <form className="dash__search" onSubmit={handleBuscar}>
                <IconBusca />
                <input
                  type="text"
                  aria-label="Buscar na sua biblioteca"
                  placeholder="Buscar na sua biblioteca…"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
              </form>

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

          <div className="dash__inner">
            {erro && <div className="dash__error">{erro}</div>}

        {destaque ? (
          <section className="dash__hero">
            <div className="dash__hero-content">
              <span className="dash__hero-kicker">{destaqueEmAndamento ? 'Continue lendo' : 'Comece a ler'}</span>
              <h1>{destaque.livro.titulo}</h1>
              <p className="dash__hero-meta">
                {[destaque.livro.autor, destaque.livro.categoria].filter(Boolean).join(' · ') ||
                  (destaqueEmAndamento ? 'Você está lendo este livro agora.' : 'Está na sua lista de leitura.')}
              </p>
              <Link to={`/livros/${destaque.livro.identificadorExterno}`} className="dash__hero-btn">
                {destaqueEmAndamento ? 'Continuar leitura' : 'Começar leitura'}
              </Link>
            </div>
            <div className="dash__hero-visual">
              <div
                className="dash__hero-cover"
                style={{ backgroundImage: destaque.livro.capa ? `url(${destaque.livro.capa})` : undefined }}
              >
                <span>{destaque.livro.titulo}</span>
              </div>
            </div>
          </section>
        ) : (
          <section className="dash__hero">
            <div className="dash__hero-content">
              <span className="dash__hero-kicker">Sua estante espera por você</span>
              <h1>Comece sua próxima leitura</h1>
              <p className="dash__hero-meta">Explore o catálogo e adicione o primeiro livro à sua biblioteca.</p>
              <Link to="/explorar" className="dash__hero-btn">
                Explorar livros
              </Link>
            </div>
            <div className="dash__hero-visual">
              <div className="dash__hero-cover">
                <span>Alexandria</span>
              </div>
            </div>
          </section>
        )}

        <div className="dash__quick">
          <Link to="/explorar" className="dash__quick-card">
            <span className="dash__quick-icon">
              <IconBusca />
            </span>
            <span>
              <strong>Buscar livros</strong>
              <span>Explore o catálogo</span>
            </span>
          </Link>
          <Link to="/biblioteca" className="dash__quick-card">
            <span className="dash__quick-icon">
              <IconEstante />
            </span>
            <span>
              <strong>Minha estante</strong>
              <span>
                {itens.length} livro{itens.length === 1 ? '' : 's'} salvos
              </span>
            </span>
          </Link>
          <Link to="/comunidade" className="dash__quick-card">
            <span className="dash__quick-icon">
              <IconPessoas />
            </span>
            <span>
              <strong>Comunidade</strong>
              <span>{feed ? `${feed.totalElements} publicações` : 'Veja as novidades'}</span>
            </span>
          </Link>
        </div>

        <div className="dash__layout">
          <div>
            <section className="dash__section">
              <div className="dash__section-head">
                <h2>Lendo atualmente</h2>
                <Link to="/biblioteca">Ver tudo →</Link>
              </div>
              {lendo.length === 0 ? (
                <div className="dash__empty">
                  Nenhuma leitura em andamento. <Link to="/explorar">Escolha um livro</Link> para começar.
                </div>
              ) : (
                <div className="dash__shelf">
                  {lendo.slice(0, 6).map((item, index) => (
                    <LivroTile item={item} index={index} key={item.id} />
                  ))}
                </div>
              )}
            </section>

            <section className="dash__section">
              <div className="dash__section-head">
                <h2>Quer ler em seguida</h2>
                <Link to="/biblioteca">Ver tudo →</Link>
              </div>
              {queroLer.length === 0 ? (
                <div className="dash__empty">
                  Sua lista de leitura está vazia. <Link to="/explorar">Descubra novos livros</Link>.
                </div>
              ) : (
                <div className="dash__shelf">
                  {queroLer.slice(0, 4).map((item, index) => (
                    <LivroTile item={item} index={index} key={item.id} />
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside>
            <div className="dash__level-card">
              {status ? (
                <>
                  <div className="dash__level-top">
                    <h3>Nível {nivel}</h3>
                    <span className="dash__level-badge">{tituloNivel(nivel)}</span>
                  </div>
                  <p className="dash__level-xp">
                    {xpAtualNivel} / 100 XP para o Nível {nivel + 1}
                  </p>
                  <div className="dash__level-bar">
                    <div className="dash__level-bar-fill" style={{ width: `${xpAtualNivel}%` }} />
                  </div>

                  {badgesDestaque.length > 0 && (
                    <div className="dash__badges">
                      {badgesDestaque.map((conquista) => (
                        <div
                          className={`dash__badge${conquista.desbloqueada ? '' : ' dash__badge--locked'}`}
                          key={conquista.codigo}
                          title={conquista.descricao}
                        >
                          <span className="dash__badge-icon">
                            {conquista.desbloqueada ? <IconTrofeu /> : <IconCadeado />}
                          </span>
                          <span>{conquista.nome}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link to="/conquistas" className="dash__level-link">
                    Ver todas as conquistas →
                  </Link>
                </>
              ) : (
                <p className="dash__level-xp">Carregando sua jornada…</p>
              )}
            </div>

            {estatisticas && (
              <div className="dash__card">
                <h3>Estatísticas</h3>
                <div className="dash__stat-row">
                  <span className="dash__stat-icon">
                    <IconLivro />
                  </span>
                  <span>
                    <strong>{estatisticas.totalLidos}</strong>
                    <span>livros lidos</span>
                  </span>
                </div>
                <div className="dash__stat-row">
                  <span className="dash__stat-icon">
                    <IconEstrela />
                  </span>
                  <span>
                    <strong>{estatisticas.totalAvaliacoes}</strong>
                    <span>avaliações</span>
                  </span>
                </div>
                <div className="dash__stat-row">
                  <span className="dash__stat-icon">
                    <IconCoracao />
                  </span>
                  <span>
                    <strong>{estatisticas.totalFavoritos}</strong>
                    <span>favoritos</span>
                  </span>
                </div>
                <div className="dash__stat-row">
                  <span className="dash__stat-icon">
                    <IconX />
                  </span>
                  <span>
                    <strong>{estatisticas.totalAbandonados}</strong>
                    <span>abandonados</span>
                  </span>
                </div>
              </div>
            )}

            <div className="dash__card">
              <div className="dash__card-head">
                <h3>Comunidade</h3>
                <Link to="/comunidade">Ver tudo →</Link>
              </div>
              {!feed || feed.content.length === 0 ? (
                <p className="dash__empty-inline">Nenhuma atividade ainda.</p>
              ) : (
                feed.content.map((post) => (
                  <Link to="/comunidade" className="dash__feed-item" key={post.id}>
                    <span className="dash__feed-avatar">{iniciais(post.autorNome)}</span>
                    <span>
                      <strong>{post.autorNome}</strong>
                      <p>{descricaoPost(post)}</p>
                    </span>
                  </Link>
                ))
              )}
            </div>
          </aside>
        </div>
          </div>
        </div>
      </div>

      <Link to="/explorar" className="dash__fab" aria-label="Adicionar livro à estante">
        <IconMais />
      </Link>
    </div>
  )
}
