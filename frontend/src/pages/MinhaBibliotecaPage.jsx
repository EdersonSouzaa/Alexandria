import { useCallback, useEffect, useState } from 'react'
import { bibliotecaService } from '../services/bibliotecaService'
import { useGamificacao } from '../context/GamificacaoContext'
import BookCard from '../components/BookCard'
import LoadingSpinner from '../components/LoadingSpinner'
import '../styles/biblioteca.css'

const STATUS_OPCOES = [
  { valor: '', label: 'Todos os status' },
  { valor: 'QUERO_LER', label: 'Quero ler' },
  { valor: 'LENDO', label: 'Lendo' },
  { valor: 'LIDO', label: 'Lido' },
  { valor: 'ABANDONADO', label: 'Abandonado' },
]

export default function MinhaBibliotecaPage() {
  const { refresh: refreshGamificacao } = useGamificacao()

  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState('')
  const [apenasFavoritos, setApenasFavoritos] = useState(false)

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      const dados = await bibliotecaService.listar({
        status: filtroStatus || undefined,
        favorito: apenasFavoritos || undefined,
      })
      setItens(dados)
    } finally {
      setCarregando(false)
    }
  }, [filtroStatus, apenasFavoritos])

  useEffect(() => {
    carregar()
  }, [carregar])

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
    await bibliotecaService.remover(item.id)
    refreshGamificacao()
    carregar()
  }

  return (
    <div className="page container">
      <span className="kicker">Minha biblioteca</span>
      <h1>Sua estante pessoal</h1>

      <div className="biblioteca__filtros row">
        <select className="input" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
          {STATUS_OPCOES.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.label}
            </option>
          ))}
        </select>
        <label className="row">
          <input
            type="checkbox"
            checked={apenasFavoritos}
            onChange={(e) => setApenasFavoritos(e.target.checked)}
          />
          Apenas favoritos
        </label>
      </div>

      {carregando && <LoadingSpinner label="Carregando sua biblioteca…" />}

      {!carregando && itens.length === 0 && (
        <div className="empty-state">
          <p>Nenhum livro por aqui ainda. Vá até a aba Explorar e adicione seu primeiro livro!</p>
        </div>
      )}

      {!carregando && itens.length > 0 && (
        <div className="grid grid-cards">
          {itens.map((item) => (
            <BookCard key={item.id} livro={item.livro} linkTo={`/livros/${item.livro.identificadorExterno}`}>
              <select
                className="input"
                value={item.statusLeitura}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleAlterarStatus(item, e.target.value)}
              >
                {STATUS_OPCOES.filter((o) => o.valor).map((opcao) => (
                  <option key={opcao.valor} value={opcao.valor}>
                    {opcao.label}
                  </option>
                ))}
              </select>
              <div className="row-between biblioteca__acoes">
                <button
                  type="button"
                  className={`biblioteca__favorito${item.favorito ? ' biblioteca__favorito--ativo' : ''}`}
                  onClick={() => handleAlternarFavorito(item)}
                >
                  {item.favorito ? '★ Favorito' : '☆ Favoritar'}
                </button>
                <button type="button" className="biblioteca__remover" onClick={() => handleRemover(item)}>
                  Remover
                </button>
              </div>
            </BookCard>
          ))}
        </div>
      )}
    </div>
  )
}
