import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { avaliacaoService } from '../services/avaliacaoService'
import RatingStars from '../components/RatingStars'
import Input from '../components/Input'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import '../styles/avaliacoes.css'

export default function MinhasAvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [editandoId, setEditandoId] = useState(null)
  const [notaEdicao, setNotaEdicao] = useState(0)
  const [resenhaEdicao, setResenhaEdicao] = useState('')

  async function carregar() {
    setCarregando(true)
    try {
      const dados = await avaliacaoService.listar()
      setAvaliacoes(dados)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  function iniciarEdicao(avaliacao) {
    setEditandoId(avaliacao.id)
    setNotaEdicao(avaliacao.nota)
    setResenhaEdicao(avaliacao.resenha)
  }

  async function salvarEdicao(id) {
    await avaliacaoService.atualizar(id, { nota: notaEdicao, resenha: resenhaEdicao })
    setEditandoId(null)
    carregar()
  }

  async function remover(id) {
    await avaliacaoService.remover(id)
    carregar()
  }

  async function exportarCsv() {
    const csv = await avaliacaoService.exportarCsv()
    const url = URL.createObjectURL(csv)
    const link = document.createElement('a')
    link.href = url
    link.download = 'avaliacoes.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page container">
      <div className="row-between">
        <div>
          <span className="kicker">Minhas avaliações</span>
          <h1>O que você tem lido</h1>
        </div>
        {avaliacoes.length > 0 && (
          <Button variant="secondary" onClick={exportarCsv}>
            Exportar CSV
          </Button>
        )}
      </div>

      {carregando && <LoadingSpinner label="Carregando suas avaliações…" />}

      {!carregando && avaliacoes.length === 0 && (
        <div className="empty-state">
          <p>Você ainda não avaliou nenhum livro.</p>
        </div>
      )}

      <div className="stack">
        {avaliacoes.map((avaliacao) => (
          <div className="card avaliacao-item" key={avaliacao.id}>
            <div className="row-between">
              <Link to={`/livros/${avaliacao.livro.identificadorExterno}`}>
                <strong>{avaliacao.livro.titulo}</strong>
              </Link>
              <div className="row">
                <button className="avaliacao-item__link" onClick={() => iniciarEdicao(avaliacao)}>
                  Editar
                </button>
                <button className="avaliacao-item__link avaliacao-item__link--danger" onClick={() => remover(avaliacao.id)}>
                  Excluir
                </button>
              </div>
            </div>

            {editandoId === avaliacao.id ? (
              <div className="avaliacao-item__edicao">
                <RatingStars value={notaEdicao} onChange={setNotaEdicao} />
                <Input
                  as="textarea"
                  rows={4}
                  maxLength={5000}
                  value={resenhaEdicao}
                  onChange={(e) => setResenhaEdicao(e.target.value)}
                />
                <div className="row">
                  <Button onClick={() => salvarEdicao(avaliacao.id)}>Salvar</Button>
                  <Button variant="secondary" onClick={() => setEditandoId(null)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <RatingStars value={avaliacao.nota} readOnly />
                <p>{avaliacao.resenha}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
