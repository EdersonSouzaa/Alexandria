import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { avaliacaoService } from '../services/avaliacaoService'
import RatingStars from '../components/RatingStars'
import Input from '../components/Input'
import Button from '../components/Button'
import DashboardShell from '../components/DashboardShell'
import { useConfirm } from '../components/useConfirm'
import { PageHeadSkeleton, StatsSkeleton, ReviewsSkeleton } from '../components/Skeleton'
import '../styles/dashboard.css'
import '../styles/avaliacoes.css'

function IconEstrela() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.8L12 2.5z" />
    </svg>
  )
}

function IconResenha() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 4h11l3 3v13H5V4z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9 10h6M9 13h6M9 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconDownload() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4v11m0 0l-4-4m4 4l4-4M5 18h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCalendario() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 9.5h16M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconEditar() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20h4L18 10l-4-4L4 16v4zM14 4.5L19.5 10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconLixo() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0-1 13a1 1 0 01-1 1H8a1 1 0 01-1-1L6 7h12z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function MinhasAvaliacoesPage() {
  const navigate = useNavigate()
  const { confirmar, dialogoConfirmacao } = useConfirm()

  const [avaliacoes, setAvaliacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [editandoId, setEditandoId] = useState(null)
  const [notaEdicao, setNotaEdicao] = useState(0)
  const [resenhaEdicao, setResenhaEdicao] = useState('')
  const [termoBusca, setTermoBusca] = useState('')

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      const dados = await avaliacaoService.listar()
      setAvaliacoes(dados)
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

  async function remover(avaliacao) {
    const confirmado = await confirmar({
      titulo: 'Excluir avaliação?',
      mensagem: `Sua nota e a resenha de "${avaliacao.livro.titulo}" serão apagadas para sempre.`,
      detalhe: 'A publicação dela na comunidade sai do feed junto, com curtidas e comentários.',
      textoConfirmar: 'Excluir avaliação',
    })
    if (!confirmado) return

    await avaliacaoService.remover(avaliacao.id)
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

  const estatisticas = useMemo(() => {
    if (avaliacoes.length === 0) return { total: 0, media: 0, palavras: 0 }
    const total = avaliacoes.length
    const somaNotas = avaliacoes.reduce((soma, a) => soma + a.nota, 0)
    const palavras = avaliacoes.reduce(
      (soma, a) => soma + (a.resenha?.trim() ? a.resenha.trim().split(/\s+/).length : 0),
      0,
    )
    return { total, media: somaNotas / total, palavras }
  }, [avaliacoes])

  if (carregando && avaliacoes.length === 0) {
    return (
      <div className="dash">
        <DashboardShell
          active="/avaliacoes"
          searchValue={termoBusca}
          onSearchChange={setTermoBusca}
          onSearchSubmit={handleBuscar}
          searchPlaceholder="Buscar na sua biblioteca…"
        >
          <PageHeadSkeleton />
          <StatsSkeleton count={3} />
          <ReviewsSkeleton count={3} />
        </DashboardShell>
      </div>
    )
  }

  return (
    <div className="dash">
      <DashboardShell
        active="/avaliacoes"
        searchValue={termoBusca}
        onSearchChange={setTermoBusca}
        onSearchSubmit={handleBuscar}
        searchPlaceholder="Buscar na sua biblioteca…"
      >
        <div className="dash__page-head">
          <div>
            <h1>Minhas avaliações</h1>
            <p>O que você tem lido e o que achou disso.</p>
          </div>
          <div className="dash__filters">
            {avaliacoes.length > 0 && (
              <button type="button" className="dash__filter-toggle" onClick={exportarCsv}>
                <IconDownload /> Exportar CSV
              </button>
            )}
            <Link to="/explorar" className="dash__filter-toggle dash__filter-toggle--active">
              <IconEstrela width={14} height={14} /> Avaliar um livro
            </Link>
          </div>
        </div>

        {avaliacoes.length > 0 && (
          <div className="dash__stats">
            <div className="dash__stat-tile">
              <span className="dash__stat-tile-icon">
                <IconResenha />
              </span>
              <span>
                <strong>{estatisticas.total}</strong>
                <span>Avaliações</span>
              </span>
            </div>
            <div className="dash__stat-tile">
              <span className="dash__stat-tile-icon">
                <IconEstrela />
              </span>
              <span>
                <strong>{estatisticas.media.toFixed(1)}</strong>
                <span>Nota média</span>
              </span>
            </div>
            <div className="dash__stat-tile">
              <span className="dash__stat-tile-icon">
                <IconEditar />
              </span>
              <span>
                <strong>{estatisticas.palavras.toLocaleString('pt-BR')}</strong>
                <span>Palavras escritas</span>
              </span>
            </div>
          </div>
        )}

        {avaliacoes.length === 0 ? (
          <div className="dash__empty">
            Você ainda não avaliou nenhum livro. <Link to="/explorar">Explore o catálogo</Link> e escreva sua primeira
            resenha.
          </div>
        ) : (
          <div className="dash__reviews">
            {avaliacoes.map((avaliacao) => {
              const editando = editandoId === avaliacao.id
              const detalheUrl = `/livros/${avaliacao.livro.identificadorExterno}`
              return (
                <article className="dash__review" key={avaliacao.id}>
                  <div className="dash__review-cover">
                    <Link to={detalheUrl}>
                      {avaliacao.livro.capa ? (
                        <img src={avaliacao.livro.capa} alt={`Capa de ${avaliacao.livro.titulo}`} loading="lazy" />
                      ) : (
                        <span className="dash__book-placeholder">{avaliacao.livro.titulo?.[0]}</span>
                      )}
                    </Link>
                  </div>

                  <div className="dash__review-body">
                    <div className="dash__review-head">
                      <div>
                        <h2>
                          <Link to={detalheUrl}>{avaliacao.livro.titulo}</Link>
                        </h2>
                        {avaliacao.livro.autor && <p className="dash__review-author">{avaliacao.livro.autor}</p>}
                      </div>
                      {!editando && <RatingStars value={avaliacao.nota} readOnly />}
                    </div>

                    {editando ? (
                      <div className="dash__review-edit">
                        <RatingStars value={notaEdicao} onChange={setNotaEdicao} />
                        <Input
                          as="textarea"
                          rows={4}
                          maxLength={5000}
                          value={resenhaEdicao}
                          onChange={(e) => setResenhaEdicao(e.target.value)}
                        />
                        <div className="dash__review-edit-actions">
                          <Button onClick={() => salvarEdicao(avaliacao.id)}>Salvar</Button>
                          <Button variant="secondary" onClick={() => setEditandoId(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="dash__review-quote">
                          <p>{avaliacao.resenha}</p>
                        </div>
                        <div className="dash__review-foot">
                          <div className="dash__review-meta">
                            <span>
                              <IconCalendario /> {new Date(avaliacao.criadoEm).toLocaleDateString('pt-BR')}
                            </span>
                            {avaliacao.livro.categoria && (
                              <span className="dash__book-tag">{avaliacao.livro.categoria}</span>
                            )}
                          </div>
                          <div className="dash__review-actions">
                            <button type="button" onClick={() => iniciarEdicao(avaliacao)} aria-label="Editar avaliação">
                              <IconEditar />
                            </button>
                            <button
                              type="button"
                              className="dash__review-actions-danger"
                              onClick={() => remover(avaliacao)}
                              aria-label="Excluir avaliação"
                            >
                              <IconLixo />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </DashboardShell>

      {dialogoConfirmacao}
    </div>
  )
}
