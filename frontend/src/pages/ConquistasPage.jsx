import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGamificacao } from '../context/GamificacaoContext'
import DashboardShell from '../components/DashboardShell'
import {
  ICONES_CONQUISTA,
  ICONES_HISTORICO,
  IconCadeado,
  IconTrofeu,
  tituloAtual,
  proximoTitulo,
} from '../components/AchievementIcons'
import { PageHeadSkeleton, LevelHeroSkeleton, StatsSkeleton, BadgesSkeleton, TimelineSkeleton } from '../components/Skeleton'
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
        <DashboardShell
          active="/conquistas"
          searchValue={termoBusca}
          onSearchChange={setTermoBusca}
          onSearchSubmit={handleBuscar}
          searchPlaceholder="Buscar na sua biblioteca…"
        >
          <PageHeadSkeleton withFilters={false} />
          <LevelHeroSkeleton />
          <h2 className="dash__section-title">Estatísticas</h2>
          <StatsSkeleton count={8} wide />
          <h2 className="dash__section-title">Conquistas</h2>
          <BadgesSkeleton count={8} />
          <h2 className="dash__section-title">Histórico recente</h2>
          <TimelineSkeleton count={5} />
        </DashboardShell>
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
