import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGamificacao } from '../context/GamificacaoContext'
import { bibliotecaService } from '../services/bibliotecaService'
import { comunidadeService } from '../services/comunidadeService'
import DashboardShell from '../components/DashboardShell'
import { IconBusca, IconEstante, IconPessoas, IconEstrela, IconTrofeu, iniciais } from '../components/DashboardIcons'
import { tituloAtual } from '../components/AchievementIcons'
import '../styles/dashboard.css'
import '../styles/inicio.css'

const CORES_TILE = ['#c8934c', '#51637a', '#33241a', '#3f5940', '#8a3a2f', '#7c6f42', '#4a3524']

function descricaoPost(post) {
  const primeiraLinha = post.conteudo.split('\n')[0].trim()
  if (post.autorNome && primeiraLinha.startsWith(post.autorNome)) {
    const resto = primeiraLinha.slice(post.autorNome.length).trim()
    return resto || primeiraLinha
  }
  return primeiraLinha
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
  const { status, refresh } = useGamificacao()
  const navigate = useNavigate()

  const [itens, setItens] = useState([])
  const [feed, setFeed] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [termoBusca, setTermoBusca] = useState('')

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
      <DashboardShell
        active="/inicio"
        searchValue={termoBusca}
        onSearchChange={setTermoBusca}
        onSearchSubmit={handleBuscar}
        searchPlaceholder="Buscar na sua biblioteca…"
      >
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
                    <span className="dash__level-badge">{tituloAtual(nivel).titulo}</span>
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
      </DashboardShell>
    </div>
  )
}
