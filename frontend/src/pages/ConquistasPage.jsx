import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGamificacao } from '../context/GamificacaoContext'
import DashboardShell from '../components/DashboardShell'
import '../styles/dashboard.css'
import '../styles/conquistas.css'

const ESTATISTICAS_LABELS = {
  totalLivros: 'Livros na biblioteca',
  totalLidos: 'Livros lidos',
  totalAvaliacoes: 'Avaliações',
  totalFavoritos: 'Favoritos',
  totalPosts: 'Publicações',
  totalQueroLer: 'Quero ler',
  totalLendo: 'Lendo agora',
  totalAbandonados: 'Abandonados',
}

const TITULOS_NIVEL = [
  { min: 16, titulo: 'Lenda Literária' },
  { min: 11, titulo: 'Sábio de Alexandria' },
  { min: 7, titulo: 'Guardião dos Pergaminhos' },
  { min: 4, titulo: 'Leitor Dedicado' },
  { min: 1, titulo: 'Leitor Iniciante' },
]

function tituloAtual(nivel) {
  return TITULOS_NIVEL.find((item) => nivel >= item.min) ?? TITULOS_NIVEL[TITULOS_NIVEL.length - 1]
}

function proximoTitulo(nivel) {
  return [...TITULOS_NIVEL].reverse().find((item) => item.min > nivel) ?? null
}

const ICONES_CONQUISTA = {
  PRIMEIRO_LIVRO: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  LEITOR_INICIANTE: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path
        d="M12 6.2c-1.7-1.2-3.9-1.9-6.3-1.9-.9 0-1.8.1-2.7.35v14c.9-.25 1.8-.35 2.7-.35 2.4 0 4.6.7 6.3 1.9 1.7-1.2 3.9-1.9 6.3-1.9.9 0 1.8.1 2.7.35v-14c-.9-.25-1.8-.35-2.7-.35-2.4 0-4.6.7-6.3 1.9z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 6.2v14" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  LEITOR_VORAZ: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path
        d="M12 21c4-2 5-5.2 5-8 0-3-1.7-5.4-3-7 0 2-1 3-2 3-1.5 0-1-2.3-2-4-3 2.4-5 6-5 9 0 2.8 1.5 5.1 3.5 6.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  ),
  CRITICO_LITERARIO: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.8L12 2.5z" />
    </svg>
  ),
  RESENHISTA: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path
        d="M4 20h4L18 10l-4-4L4 16v4zM14 4.5L19.5 10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  COLECIONADOR: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 20.5s-7.5-4.6-10-9.3C.4 7.8 2 4.5 5.3 4a4.9 4.9 0 016.7 2 4.9 4.9 0 016.7-2c3.3.5 4.9 3.8 3.3 7.2-2.5 4.7-10 9.3-10 9.3z" />
    </svg>
  ),
  SOCIAVEL: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M15 14.3c2.6.4 4.5 2.6 4.5 5.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  EXPLORADOR: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15 9l-2 5-5 2 2-5 5-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
  LENDARIO: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path
        d="M3 7l4 3 5-6 5 6 4-3-2 11H5L3 7z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

function IconTrofeu(p) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path d="M7 4h10v5a5 5 0 01-10 0V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5 6H3v1a4 4 0 003.5 4M19 6h2v1a4 4 0 01-3.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 15.5h4M12 15.5V19M9 20.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconCadeado(p) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7.5a4 4 0 018 0V11" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

const ICONES_HISTORICO = {
  LIVRO_ADICIONADO: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  LIVRO_LIDO: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  AVALIACAO_CRIADA: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.8L12 2.5z" />
    </svg>
  ),
  COMENTARIO_CRIADO: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
  CURTIDA_DADA: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 20.5s-7.5-4.6-10-9.3C.4 7.8 2 4.5 5.3 4a4.9 4.9 0 016.7 2 4.9 4.9 0 016.7-2c3.3.5 4.9 3.8 3.3 7.2-2.5 4.7-10 9.3-10 9.3z" />
    </svg>
  ),
}

const FILTROS = [
  { valor: 'todas', label: 'Todas' },
  { valor: 'desbloqueadas', label: 'Desbloqueadas' },
  { valor: 'bloqueadas', label: 'Bloqueadas' },
]

export default function ConquistasPage() {
  const { status, loading, refresh } = useGamificacao()
  const navigate = useNavigate()
  const [termoBusca, setTermoBusca] = useState('')
  const [filtro, setFiltro] = useState('todas')

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleBuscar(event) {
    event.preventDefault()
    navigate(`/explorar?termo=${encodeURIComponent(termoBusca)}`)
  }

  const atividadesEstaSemana = useMemo(() => {
    if (!status) return 0
    const seteDiasAtras = Date.now() - 7 * 24 * 60 * 60 * 1000
    return status.historico.filter((item) => new Date(item.data).getTime() >= seteDiasAtras).length
  }, [status])

  const conquistasFiltradas = useMemo(() => {
    if (!status) return []
    if (filtro === 'desbloqueadas') return status.conquistas.filter((c) => c.desbloqueada)
    if (filtro === 'bloqueadas') return status.conquistas.filter((c) => !c.desbloqueada)
    return status.conquistas
  }, [status, filtro])

  if (loading && !status) {
    return (
      <div className="dash">
        <div className="dash__loading">
          <span className="dash__spinner" />
          <span>Carregando sua jornada…</span>
        </div>
      </div>
    )
  }

  if (!status) return null

  const progresso = Math.round(((100 - status.xpParaProximoNivel) / 100) * 100)
  const raio = 88
  const circunferencia = 2 * Math.PI * raio
  const desbloqueadasCount = status.conquistas.filter((c) => c.desbloqueada).length
  const titulo = tituloAtual(status.nivel)
  const proximo = proximoTitulo(status.nivel)
  const progressoTitulo = proximo
    ? Math.round(((status.nivel - titulo.min) / (proximo.min - titulo.min)) * 100)
    : 100

  return (
    <div className="dash">
      <DashboardShell
        active="/conquistas"
        searchValue={termoBusca}
        onSearchChange={setTermoBusca}
        onSearchSubmit={handleBuscar}
        searchPlaceholder="Buscar na sua biblioteca…"
      >
        <div className="dash__page-head">
          <div>
            <h1>Conquistas</h1>
            <p>Sua jornada como leitor, em números e marcos.</p>
          </div>
        </div>

        <section className="dash__level-hero">
          <div className="dash__level-hero-main">
            <div className="dash__level-ring">
              <svg width="176" height="176" viewBox="0 0 192 192">
                <circle className="dash__level-ring-track" cx="96" cy="96" r={raio} fill="none" strokeWidth="8" />
                <circle
                  className="dash__level-ring-fill"
                  cx="96"
                  cy="96"
                  r={raio}
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circunferencia}
                  strokeDashoffset={circunferencia * (1 - progresso / 100)}
                  transform="rotate(-90 96 96)"
                />
              </svg>
              <div className="dash__level-ring-label">
                <strong>{status.nivel}</strong>
                <span>Nível</span>
              </div>
            </div>

            <div className="dash__level-hero-copy">
              <h2>Sua jornada de leitor</h2>
              <p>
                Sua sabedoria cresce a cada página virada. Você desbloqueou{' '}
                <strong>
                  {desbloqueadasCount} de {status.conquistas.length}
                </strong>{' '}
                conquistas.
              </p>
              <div className="dash__level-chips">
                <span className="dash__level-chip">
                  <IconTrofeu width={16} height={16} /> {status.xp.toLocaleString('pt-BR')} XP totais
                </span>
                <span className="dash__level-chip dash__level-chip--muted">{atividadesEstaSemana} atividades essa semana</span>
              </div>
            </div>
          </div>

          <div className="dash__rank-card">
            <span className="dash__rank-label">Título atual</span>
            <p className="dash__rank-title">{titulo.titulo}</p>
            <div className="dash__rank-progress">
              <div className="dash__rank-progress-head">
                <span>{proximo ? `Próximo: ${proximo.titulo}` : 'Nível máximo alcançado'}</span>
                <span>{progressoTitulo}%</span>
              </div>
              <div className="dash__rank-bar">
                <div className="dash__rank-bar-fill" style={{ width: `${progressoTitulo}%` }} />
              </div>
            </div>
          </div>
        </section>

        <h2 className="dash__section-title">Estatísticas</h2>
        <div className="dash__stats dash__stats--wide">
          {Object.entries(ESTATISTICAS_LABELS).map(([chave, label]) => (
            <div className="dash__stat-tile" key={chave}>
              <span>
                <strong>{status.estatisticas[chave]}</strong>
                <span>{label}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="dash__section-head-row">
          <h2 className="dash__section-title">Conquistas</h2>
          <div className="dash__filters">
            {FILTROS.map((f) => (
              <button
                key={f.valor}
                type="button"
                className={`dash__filter-toggle${filtro === f.valor ? ' dash__filter-toggle--active' : ''}`}
                onClick={() => setFiltro(f.valor)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="dash__badges-grid">
          {conquistasFiltradas.map((conquista) => {
            const Icone = ICONES_CONQUISTA[conquista.codigo]
            return (
              <div
                className={`dash__badge-tile${conquista.desbloqueada ? ' dash__badge-tile--unlocked' : ''}`}
                key={conquista.codigo}
              >
                <span className="dash__badge-tile-icon">
                  {conquista.desbloqueada && Icone ? <Icone /> : <IconCadeado />}
                </span>
                <p className="dash__badge-tile-name">{conquista.nome}</p>
                <p className="dash__badge-tile-desc">{conquista.descricao}</p>
              </div>
            )
          })}
        </div>

        <h2 className="dash__section-title">Histórico recente</h2>
        {status.historico.length === 0 ? (
          <div className="dash__empty">Nenhuma atividade registrada ainda.</div>
        ) : (
          <div className="dash__timeline">
            {status.historico.slice(0, 20).map((item, index) => {
              const Icone = ICONES_HISTORICO[item.tipo]
              return (
                <div className="dash__timeline-item" key={index}>
                  <span className="dash__timeline-icon">{Icone ? <Icone /> : <IconTrofeu width={16} height={16} />}</span>
                  <span className="dash__timeline-desc">{item.descricao}</span>
                  <span className="dash__timeline-meta">
                    +{item.xpGanho} XP · {new Date(item.data).toLocaleString('pt-BR')}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </DashboardShell>
    </div>
  )
}
