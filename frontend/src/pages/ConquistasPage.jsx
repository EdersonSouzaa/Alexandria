import { useEffect } from 'react'
import { useGamificacao } from '../context/GamificacaoContext'
import LoadingSpinner from '../components/LoadingSpinner'
import '../styles/conquistas.css'

const ESTATISTICAS_LABELS = {
  totalLivros: 'Livros na biblioteca',
  totalLidos: 'Livros lidos',
  totalAvaliacoes: 'Avaliações',
  totalFavoritos: 'Favoritos',
  totalPosts: 'Publicações',
  totalAbandonados: 'Abandonados',
  totalQueroLer: 'Quero ler',
  totalLendo: 'Lendo agora',
}

export default function ConquistasPage() {
  const { status, loading, refresh } = useGamificacao()

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading && !status) {
    return <LoadingSpinner label="Carregando sua jornada…" />
  }

  if (!status) {
    return null
  }

  const progresso = Math.round(
    ((100 - status.xpParaProximoNivel) / 100) * 100,
  )

  return (
    <div className="page container">
      <span className="kicker">Conquistas</span>
      <h1>Sua jornada como leitor</h1>

      <div className="card conquistas__nivel">
        <div className="row-between">
          <div>
            <span className="badge">Nível {status.nivel}</span>
            <p className="text-muted">{status.xp} XP acumulados</p>
          </div>
          <p className="text-muted">Faltam {status.xpParaProximoNivel} XP para o próximo nível</p>
        </div>
        <div className="conquistas__barra">
          <div className="conquistas__barra-preenchida" style={{ width: `${progresso}%` }} />
        </div>
      </div>

      <h2 className="conquistas__secao">Estatísticas</h2>
      <div className="grid grid-cards">
        {Object.entries(ESTATISTICAS_LABELS).map(([chave, label]) => (
          <div className="card conquistas__estatistica" key={chave}>
            <span className="conquistas__estatistica-valor">{status.estatisticas[chave]}</span>
            <span className="text-muted">{label}</span>
          </div>
        ))}
      </div>

      <h2 className="conquistas__secao">Conquistas</h2>
      <div className="grid grid-cards">
        {status.conquistas.map((conquista) => (
          <div
            className={`card conquistas__conquista${conquista.desbloqueada ? ' conquistas__conquista--desbloqueada' : ''}`}
            key={conquista.codigo}
          >
            <h3>{conquista.nome}</h3>
            <p>{conquista.descricao}</p>
            <span className="badge">{conquista.desbloqueada ? 'Desbloqueada' : 'Bloqueada'}</span>
          </div>
        ))}
      </div>

      <h2 className="conquistas__secao">Histórico recente</h2>
      {status.historico.length === 0 ? (
        <p className="text-muted">Nenhuma atividade registrada ainda.</p>
      ) : (
        <div className="stack">
          {status.historico.slice(0, 20).map((item, index) => (
            <div className="row-between conquistas__historico-item" key={index}>
              <span>{item.descricao}</span>
              <span className="text-muted">
                +{item.xpGanho} XP · {new Date(item.data).toLocaleString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
