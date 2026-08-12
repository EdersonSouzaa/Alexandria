import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { bibliotecaService } from '../services/bibliotecaService'
import { useGamificacao } from '../context/GamificacaoContext'
import DashboardShell from '../components/DashboardShell'
import HeroCover from '../components/HeroCover'
import { useConfirm } from '../components/useConfirm'
import { IconEstrela } from '../components/DashboardIcons'
import { HeroSkeleton, StatsSkeleton, PageHeadSkeleton, BookGridSkeleton } from '../components/Skeleton'
import '../styles/dashboard.css'
import '../styles/book-grid.css'

const STATUS_OPCOES = [
  { valor: 'QUERO_LER', label: 'Quero ler' },
  { valor: 'LENDO', label: 'Lendo' },
  { valor: 'LIDO', label: 'Lido' },
  { valor: 'ABANDONADO', label: 'Abandonado' },
]

const STATUS_LABEL = Object.fromEntries(STATUS_OPCOES.map((o) => [o.valor, o.label]))

function IconChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconLixo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0-1 13a1 1 0 01-1 1H8a1 1 0 01-1-1L6 7h12z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconBookmark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function IconLivroAberto() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 6.2c-1.7-1.2-3.9-1.9-6.3-1.9-.9 0-1.8.1-2.7.35v14c.9-.25 1.8-.35 2.7-.35 2.4 0 4.6.7 6.3 1.9 1.7-1.2 3.9-1.9 6.3-1.9.9 0 1.8.1 2.7.35v-14c-.9-.25-1.8-.35-2.7-.35-2.4 0-4.6.7-6.3 1.9z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M12 6.2v14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconCheckCircle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconXCircle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default function MinhaBibliotecaPage() {
  const { refresh: refreshGamificacao } = useGamificacao()
  const navigate = useNavigate()
  const { confirmar, dialogoConfirmacao } = useConfirm()

  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [apenasFavoritos, setApenasFavoritos] = useState(false)
  const [termoBusca, setTermoBusca] = useState('')

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const dados = await bibliotecaService.listar({})
      setItens(dados)
    } catch {
      setErro('Não foi possível carregar sua biblioteca agora. Tente novamente em instantes.')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  function handleBuscar(event) {
    event.preventDefault()
    navigate(`/explorar?termo=${encodeURIComponent(termoBusca)}`)
  }

  async function handleAlterarStatus(item, novoStatus) {
    await bibliotecaService.atualizarStatus(item.id, novoStatus)
    refreshGamificacao()
    carregar()
  }

  async function handleAlternarFavorito(item) {
    await bibliotecaService.alternarFavorito(item.id)
    refreshGamificacao()
    carregar()
  }

  async function handleRemover(item) {
    const confirmado = await confirmar({
      titulo: 'Remover da biblioteca?',
      mensagem: `"${item.livro.titulo}" vai sair da sua estante, junto com o status de leitura e a marcação de favorito.`,
      detalhe: 'Sua avaliação do livro, se houver, é mantida.',
      textoConfirmar: 'Remover livro',
    })
    if (!confirmado) return

    await bibliotecaService.remover(item.id)
    refreshGamificacao()
    carregar()
  }

  const contagens = useMemo(() => {
    const c = { QUERO_LER: 0, LENDO: 0, LIDO: 0, ABANDONADO: 0, favoritos: 0 }
    for (const item of itens) {
      c[item.statusLeitura] = (c[item.statusLeitura] ?? 0) + 1
      if (item.favorito) c.favoritos += 1
    }
    return c
  }, [itens])

  const destaque = useMemo(
    () =>
      [...itens]
        .filter((item) => item.statusLeitura === 'LENDO')
        .sort((a, b) => new Date(b.atualizadoEm) - new Date(a.atualizadoEm))[0] ?? null,
    [itens],
  )

  const itensFiltrados = useMemo(
    () =>
      itens.filter((item) => {
        if (filtroStatus && item.statusLeitura !== filtroStatus) return false
        if (apenasFavoritos && !item.favorito) return false
        return true
      }),
    [itens, filtroStatus, apenasFavoritos],
  )

  if (carregando && itens.length === 0) {
    return (
      <div className="dash">
        <DashboardShell
          active="/biblioteca"
          searchValue={termoBusca}
          onSearchChange={setTermoBusca}
          onSearchSubmit={handleBuscar}
          searchPlaceholder="Buscar na sua biblioteca…"
        >
          <HeroSkeleton />
          <div style={{ marginTop: 32 }}>
            <StatsSkeleton count={5} />
          </div>
          <PageHeadSkeleton withFilters={false} />
          <BookGridSkeleton count={10} />
        </DashboardShell>
      </div>
    )
  }

  return (
    <div className="dash">
      <DashboardShell
        active="/biblioteca"
        searchValue={termoBusca}
        onSearchChange={setTermoBusca}
        onSearchSubmit={handleBuscar}
        searchPlaceholder="Buscar na sua biblioteca…"
      >
        {erro && <div className="dash__error">{erro}</div>}

        {destaque && (
          <section className="dash__hero">
            <div className="dash__hero-content">
              <span className="dash__hero-kicker">Continue lendo</span>
              <h1>{destaque.livro.titulo}</h1>
              <p className="dash__hero-meta">
                {[destaque.livro.autor, destaque.livro.categoria].filter(Boolean).join(' · ') ||
                  'Você está lendo este livro agora.'}
              </p>
              <Link to={`/livros/${destaque.livro.identificadorExterno}`} className="dash__hero-btn">
                Avaliar Livro
              </Link>
            </div>
            <div className="dash__hero-visual">
              <HeroCover
                key={destaque.livro.identificadorExterno}
                capa={destaque.livro.capa}
                titulo={destaque.livro.titulo}
              />
            </div>
          </section>
        )}

        <div className="dash__stats" style={{ marginTop: destaque ? 32 : 8 }}>
          <div className="dash__stat-tile">
            <span className="dash__stat-tile-icon">
              <IconBookmark />
            </span>
            <span>
              <strong>{contagens.QUERO_LER}</strong>
              <span>Quero ler</span>
            </span>
          </div>
          <div className="dash__stat-tile">
            <span className="dash__stat-tile-icon">
              <IconLivroAberto />
            </span>
            <span>
              <strong>{contagens.LENDO}</strong>
              <span>Lendo</span>
            </span>
          </div>
          <div className="dash__stat-tile">
            <span className="dash__stat-tile-icon">
              <IconCheckCircle />
            </span>
            <span>
              <strong>{contagens.LIDO}</strong>
              <span>Lidos</span>
            </span>
          </div>
          <div className="dash__stat-tile">
            <span className="dash__stat-tile-icon">
              <IconXCircle />
            </span>
            <span>
              <strong>{contagens.ABANDONADO}</strong>
              <span>Abandonados</span>
            </span>
          </div>
          <div className="dash__stat-tile">
            <span className="dash__stat-tile-icon">
              <IconEstrela />
            </span>
            <span>
              <strong>{contagens.favoritos}</strong>
              <span>Favoritos</span>
            </span>
          </div>
        </div>

        <div className="dash__page-head">
          <div>
            <h1>Minha biblioteca</h1>
            <p>
              {itensFiltrados.length} {itensFiltrados.length === 1 ? 'livro' : 'livros'} na sua estante
            </p>
          </div>

          <div className="dash__filters">
            <label className="dash__pill-select">
              <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} aria-label="Filtrar por status">
                <option value="">Todos os status</option>
                {STATUS_OPCOES.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.label}
                  </option>
                ))}
              </select>
              <IconChevron />
            </label>
            <button
              type="button"
              className={`dash__filter-toggle${apenasFavoritos ? ' dash__filter-toggle--active' : ''}`}
              onClick={() => setApenasFavoritos((v) => !v)}
              aria-pressed={apenasFavoritos}
            >
              <IconEstrela width={14} height={14} />
              Favoritos
            </button>
          </div>
        </div>

        {itensFiltrados.length === 0 ? (
          <div className="dash__empty">
            {itens.length === 0 ? (
              <>
                Nenhum livro por aqui ainda. <Link to="/explorar">Explore o catálogo</Link> e adicione seu primeiro livro.
              </>
            ) : (
              'Nenhum livro encontrado para esse filtro.'
            )}
          </div>
        ) : (
          <div className="dash__book-grid">
            {itensFiltrados.map((item) => {
              const livro = item.livro
              const detalheUrl = `/livros/${livro.identificadorExterno}`
              return (
                <div className="dash__book" key={item.id}>
                  <div className="dash__book-cover">
                    <Link to={detalheUrl}>
                      {livro.capa ? (
                        <img src={livro.capa} alt={`Capa de ${livro.titulo}`} loading="lazy" />
                      ) : (
                        <span className="dash__book-placeholder">{livro.titulo?.[0]}</span>
                      )}
                    </Link>
                    <span className="dash__book-corner">
                      <button
                        type="button"
                        className={`dash__book-fav${item.favorito ? ' dash__book-fav--ativo' : ''}`}
                        onClick={() => handleAlternarFavorito(item)}
                        aria-label={item.favorito ? 'Remover dos favoritos' : 'Marcar como favorito'}
                        aria-pressed={item.favorito}
                      >
                        <IconEstrela width={16} height={16} />
                      </button>
                    </span>
                    <div className="dash__book-overlay">
                      <button type="button" className="dash__book-add" onClick={() => handleRemover(item)}>
                        <IconLixo /> Remover
                      </button>
                    </div>
                  </div>
                  <div className="dash__book-ledge" />
                  <div className="dash__book-info">
                    <Link to={detalheUrl}>
                      <h3>{livro.titulo}</h3>
                    </Link>
                    {livro.autor && <p className="dash__book-author">{livro.autor}</p>}
                    <label className="dash__book-status">
                      <select
                        value={item.statusLeitura}
                        onChange={(e) => handleAlterarStatus(item, e.target.value)}
                        aria-label={`Status de leitura de ${livro.titulo}`}
                      >
                        {STATUS_OPCOES.map((o) => (
                          <option key={o.valor} value={o.valor}>
                            {STATUS_LABEL[o.valor]}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </DashboardShell>

      {dialogoConfirmacao}
    </div>
  )
}
