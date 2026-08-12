import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { livroService } from '../services/livroService'
import { bibliotecaService } from '../services/bibliotecaService'
import { avaliacaoService } from '../services/avaliacaoService'
import { comunidadeService } from '../services/comunidadeService'
import { useAuth } from '../context/AuthContext'
import { useGamificacao } from '../context/GamificacaoContext'
import DashboardShell from '../components/DashboardShell'
import RatingStars from '../components/RatingStars'
import { useConfirm } from '../components/useConfirm'
import { iniciais } from '../components/DashboardIcons'
import { CrumbsSkeleton, BookHeroSkeleton, RevCardsSkeleton } from '../components/Skeleton'
import '../styles/dashboard.css'
import '../styles/avaliacoes.css'
import '../styles/livroDetalhe.css'

const STATUS_OPCOES = [
  { valor: 'QUERO_LER', label: 'Quero ler' },
  { valor: 'LENDO', label: 'Lendo' },
  { valor: 'LIDO', label: 'Lido' },
  { valor: 'ABANDONADO', label: 'Abandonado' },
]

function extrairAno(data) {
  if (!data) return null
  const match = String(data).match(/\d{4}/)
  return match ? match[0] : data
}

function IconChevronRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconChevronDown() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconPaginas() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5c-.8 0-1.5-.7-1.5-1.5v-13z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5c.8 0 1.5-.7 1.5-1.5v-13z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCalendario() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 9.5h16M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconEstrela() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.8L12 2.5z" />
    </svg>
  )
}

function IconMarcador() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" />
    </svg>
  )
}

function IconCoracao({ preenchido }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={preenchido ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M12 20.5s-7.5-4.6-10-9.3C.4 7.8 2 4.5 5.3 4a4.9 4.9 0 016.7 2 4.9 4.9 0 016.7-2c3.3.5 4.9 3.8 3.3 7.2-2.5 4.7-10 9.3-10 9.3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCompartilhar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="18" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="6" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="19" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.3 10.7l7.4-4.2M8.3 13.3l7.4 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconEditarPena() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20h4L18 10l-4-4L4 16v4zM14 4.5L19.5 10"
        stroke="currentColor"
        strokeWidth="1.8"
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

function IconCurtir() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 20H4v-9h3m0 9V11m0 9h9.3a2 2 0 001.98-1.7l1.1-7A2 2 0 0017.4 8H14V4.5a1.5 1.5 0 00-3 0L9 8l-2 3v9z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconComentario() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5h16v11H8l-4 4V5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function LivroDetalhePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refresh: refreshGamificacao } = useGamificacao()
  const { confirmar, dialogoConfirmacao } = useConfirm()

  const [livro, setLivro] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [termoBusca, setTermoBusca] = useState('')
  const [descricaoExpandida, setDescricaoExpandida] = useState(false)

  const [itens, setItens] = useState([])
  const [statusSelecionado, setStatusSelecionado] = useState('QUERO_LER')
  const [atualizandoBiblioteca, setAtualizandoBiblioteca] = useState(false)
  const [mensagemBiblioteca, setMensagemBiblioteca] = useState('')
  const [linkCopiado, setLinkCopiado] = useState(false)

  const [avaliacoes, setAvaliacoes] = useState([])
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(true)
  const [curtindo, setCurtindo] = useState({})

  const [mostrarForm, setMostrarForm] = useState(false)
  const [avaliacaoEditando, setAvaliacaoEditando] = useState(null)
  const [nota, setNota] = useState(0)
  const [resenha, setResenha] = useState('')
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false)
  const [mensagemAvaliacao, setMensagemAvaliacao] = useState('')

  const carregarBiblioteca = useCallback(async () => {
    const dados = await bibliotecaService.listar({})
    setItens(dados)
  }, [])

  const carregarAvaliacoes = useCallback(async () => {
    setCarregandoAvaliacoes(true)
    try {
      const dados = await comunidadeService.listarFeed({ livro: id, pagina: 0, tamanhoPagina: 20 })
      setAvaliacoes(dados.content)
    } finally {
      setCarregandoAvaliacoes(false)
    }
  }, [id])

  useEffect(() => {
    setCarregando(true)
    setErro('')
    livroService
      .detalhar(id)
      .then(setLivro)
      .catch(() => setErro('Não foi possível carregar os detalhes deste livro.'))
      .finally(() => setCarregando(false))

    carregarBiblioteca()
    carregarAvaliacoes()
  }, [id, carregarBiblioteca, carregarAvaliacoes])

  const itemAtual = useMemo(
    () => itens.find((item) => item.livro.identificadorExterno === id),
    [itens, id],
  )

  const minhaAvaliacao = useMemo(
    () => (user ? avaliacoes.find((post) => post.autorId === user.id) : undefined),
    [avaliacoes, user],
  )

  const mediaNota = useMemo(() => {
    const notas = avaliacoes.map((post) => post.nota).filter((valor) => typeof valor === 'number')
    if (notas.length === 0) return null
    return notas.reduce((soma, valor) => soma + valor, 0) / notas.length
  }, [avaliacoes])

  function handleBuscar(event) {
    event.preventDefault()
    navigate(`/explorar?termo=${encodeURIComponent(termoBusca)}`)
  }

  async function handleAdicionar() {
    setAtualizandoBiblioteca(true)
    setMensagemBiblioteca('')
    try {
      await bibliotecaService.adicionar({ identificadorExterno: id, statusLeitura: statusSelecionado })
      await carregarBiblioteca()
      setMensagemBiblioteca('Livro adicionado à sua biblioteca!')
      refreshGamificacao()
    } catch (error) {
      setMensagemBiblioteca(error.response?.data?.mensagem ?? 'Não foi possível adicionar este livro.')
    } finally {
      setAtualizandoBiblioteca(false)
    }
  }

  async function handleAlterarStatus(novoStatus) {
    if (!itemAtual) {
      setStatusSelecionado(novoStatus)
      return
    }
    setAtualizandoBiblioteca(true)
    setMensagemBiblioteca('')
    try {
      await bibliotecaService.atualizarStatus(itemAtual.id, novoStatus)
      await carregarBiblioteca()
      setMensagemBiblioteca('Status de leitura atualizado.')
    } catch (error) {
      setMensagemBiblioteca(error.response?.data?.mensagem ?? 'Não foi possível atualizar o status.')
    } finally {
      setAtualizandoBiblioteca(false)
    }
  }

  async function handleFavoritar() {
    if (!itemAtual) return
    try {
      await bibliotecaService.alternarFavorito(itemAtual.id)
      await carregarBiblioteca()
    } catch (error) {
      setMensagemBiblioteca(error.response?.data?.mensagem ?? 'Não foi possível atualizar os favoritos.')
    }
  }

  async function handleCompartilhar() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setLinkCopiado(true)
      setTimeout(() => setLinkCopiado(false), 2000)
    } catch {
      setMensagemBiblioteca('Não foi possível copiar o link.')
    }
  }

  async function handleCurtir(postId) {
    if (curtindo[postId]) return
    setCurtindo((prev) => ({ ...prev, [postId]: true }))
    try {
      const atualizado = await comunidadeService.curtir(postId)
      setAvaliacoes((prev) => prev.map((post) => (post.id === postId ? atualizado : post)))
    } finally {
      setCurtindo((prev) => ({ ...prev, [postId]: false }))
    }
  }

  function abrirNovaAvaliacao() {
    setAvaliacaoEditando(null)
    setNota(0)
    setResenha('')
    setMensagemAvaliacao('')
    setMostrarForm(true)
  }

  function iniciarEdicao(post) {
    setAvaliacaoEditando(post)
    setNota(post.nota ?? 0)
    setResenha(post.resenha ?? '')
    setMensagemAvaliacao('')
    setMostrarForm(true)
  }

  function cancelarForm() {
    setMostrarForm(false)
    setAvaliacaoEditando(null)
    setNota(0)
    setResenha('')
    setMensagemAvaliacao('')
  }

  async function handleEnviarAvaliacao(event) {
    event.preventDefault()
    setEnviandoAvaliacao(true)
    setMensagemAvaliacao('')
    try {
      if (avaliacaoEditando) {
        await avaliacaoService.atualizar(avaliacaoEditando.avaliacaoId, { nota, resenha })
      } else {
        await avaliacaoService.criar({ identificadorExterno: id, nota, resenha })
      }
      await carregarAvaliacoes()
      refreshGamificacao()
      cancelarForm()
    } catch (error) {
      setMensagemAvaliacao(error.response?.data?.mensagem ?? 'Não foi possível publicar sua avaliação.')
    } finally {
      setEnviandoAvaliacao(false)
    }
  }

  async function handleRemoverAvaliacao(post) {
    const confirmado = await confirmar({
      titulo: 'Excluir avaliação?',
      mensagem: `Sua nota e a resenha de "${livro?.titulo ?? 'este livro'}" serão apagadas para sempre.`,
      detalhe: 'A publicação dela na comunidade sai do feed junto, com curtidas e comentários.',
      textoConfirmar: 'Excluir avaliação',
    })
    if (!confirmado) return

    await avaliacaoService.remover(post.avaliacaoId)
    await carregarAvaliacoes()
    refreshGamificacao()
  }

  if (carregando) {
    return (
      <div className="dash">
        <DashboardShell
          active="/livros"
          searchValue={termoBusca}
          onSearchChange={setTermoBusca}
          onSearchSubmit={handleBuscar}
          searchPlaceholder="Título, autor ou assunto…"
        >
          <CrumbsSkeleton />
          <BookHeroSkeleton />
        </DashboardShell>
      </div>
    )
  }

  if (erro || !livro) {
    return (
      <div className="dash">
        <div className="dash__loading">
          <div className="dash__error">{erro || 'Livro não encontrado.'}</div>
        </div>
      </div>
    )
  }

  const anoPublicacao = extrairAno(livro.dataPublicacao)
  const descricaoLonga = Boolean(livro.descricao && livro.descricao.length > 320)

  return (
    <div className="dash">
      <DashboardShell
        active="/livros"
        searchValue={termoBusca}
        onSearchChange={setTermoBusca}
        onSearchSubmit={handleBuscar}
        searchPlaceholder="Título, autor ou assunto…"
      >
        <div className="dash__crumbs">
          <Link to="/explorar">Explorar</Link>
          {livro.categoria && (
            <>
              <IconChevronRight />
              <span>{livro.categoria}</span>
            </>
          )}
          <IconChevronRight />
          <span className="dash__crumbs-current">{livro.titulo}</span>
        </div>

        <section className="dash__book-hero">
          <div className="dash__book-hero-visual">
            <div className="dash__book-hero-cover">
              <div className="dash__book-hero-cover-glow" />
              {livro.capa ? (
                <img src={livro.capa} alt={`Capa de ${livro.titulo}`} className="dash__book-hero-cover-img" />
              ) : (
                <div className="dash__book-hero-cover-placeholder">{livro.titulo?.[0]}</div>
              )}
            </div>

            <div className="dash__spec-grid">
              <div className="dash__spec-tile">
                <IconPaginas />
                <span className="dash__spec-label">Páginas</span>
                <span className="dash__spec-value">{livro.numeroPaginas ?? '—'}</span>
              </div>
              <div className="dash__spec-tile">
                <IconCalendario />
                <span className="dash__spec-label">Publicado</span>
                <span className="dash__spec-value">{anoPublicacao ?? '—'}</span>
              </div>
              <div className="dash__spec-tile">
                <IconEstrela />
                <span className="dash__spec-label">Nota</span>
                <span className="dash__spec-value">{mediaNota ? mediaNota.toFixed(1) : '—'}</span>
              </div>
            </div>
          </div>

          <div className="dash__book-hero-info">
            {livro.categoria && (
              <div className="dash__book-tags">
                <span className="dash__tag-pill">{livro.categoria}</span>
              </div>
            )}

            <h1 className="dash__book-hero-title">{livro.titulo}</h1>
            {livro.autor && <p className="dash__book-hero-author">{livro.autor}</p>}

            {livro.descricao && (
              <div className="dash__book-hero-desc">
                <p className={descricaoExpandida ? '' : 'dash__book-hero-desc--clamp'}>{livro.descricao}</p>
                {descricaoLonga && (
                  <button type="button" onClick={() => setDescricaoExpandida((v) => !v)}>
                    {descricaoExpandida ? 'Mostrar menos' : 'Ler descrição completa'}
                    <IconChevronDown />
                  </button>
                )}
              </div>
            )}

            {(livro.editora || livro.dataPublicacao) && (
              <div className="dash__book-hero-meta-grid">
                {livro.editora && (
                  <div>
                    <span className="dash__meta-label">Editora</span>
                    <span className="dash__meta-value">{livro.editora}</span>
                  </div>
                )}
                {livro.dataPublicacao && (
                  <div>
                    <span className="dash__meta-label">Publicado em</span>
                    <span className="dash__meta-value">{livro.dataPublicacao}</span>
                  </div>
                )}
              </div>
            )}

            <div className="dash__book-hero-actions">
              <label className="dash__pill-select dash__hero-status-select">
                <select
                  value={itemAtual ? itemAtual.statusLeitura : statusSelecionado}
                  onChange={(e) => handleAlterarStatus(e.target.value)}
                  disabled={atualizandoBiblioteca}
                  aria-label="Status de leitura"
                >
                  {STATUS_OPCOES.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                      {opcao.label}
                    </option>
                  ))}
                </select>
                <IconChevronDown />
              </label>

              {itemAtual ? (
                <>
                  <button
                    type="button"
                    className={`dash__btn-icon${itemAtual.favorito ? ' dash__btn-icon--active' : ''}`}
                    onClick={handleFavoritar}
                    aria-label="Favoritar"
                  >
                    <IconCoracao preenchido={itemAtual.favorito} />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="dash__btn-primary"
                  onClick={handleAdicionar}
                  disabled={atualizandoBiblioteca}
                >
                  <IconMarcador />
                  {atualizandoBiblioteca ? 'Adicionando…' : 'Adicionar à biblioteca'}
                </button>
              )}

              <button type="button" className="dash__btn-icon" onClick={handleCompartilhar} aria-label="Copiar link">
                <IconCompartilhar />
              </button>
            </div>

            {itemAtual && (
              <p className="dash__book-hero-status-note">
                <IconCheck /> Na sua biblioteca
              </p>
            )}
            {linkCopiado && <p className="dash__book-hero-feedback">Link copiado!</p>}
            {mensagemBiblioteca && <p className="dash__book-hero-feedback">{mensagemBiblioteca}</p>}
          </div>
        </section>

        <section className="dash__section dash__book-reviews">
          <div className="dash__section-head">
            <div>
              <h2>Avaliações da comunidade</h2>
              <p>
                {avaliacoes.length > 0
                  ? `${avaliacoes.length} ${avaliacoes.length === 1 ? 'avaliação' : 'avaliações'}`
                  : 'Ainda sem avaliações por aqui.'}
              </p>
            </div>
            {!minhaAvaliacao && !mostrarForm && (
              <button type="button" className="dash__btn-primary-sm" onClick={abrirNovaAvaliacao}>
                <IconEditarPena /> Escrever avaliação
              </button>
            )}
          </div>

          {mostrarForm && (
            <form className="dash__review-form" onSubmit={handleEnviarAvaliacao}>
              <RatingStars value={nota} onChange={setNota} />
              <textarea
                className="dash__review-form-textarea"
                rows={4}
                maxLength={5000}
                placeholder="Escreva sua resenha…"
                value={resenha}
                onChange={(e) => setResenha(e.target.value)}
                required
              />
              <div className="dash__review-form-actions">
                <button type="submit" className="dash__btn-primary-sm" disabled={enviandoAvaliacao || nota === 0}>
                  {enviandoAvaliacao ? 'Publicando…' : avaliacaoEditando ? 'Salvar alterações' : 'Publicar avaliação'}
                </button>
                <button type="button" className="dash__btn-ghost-sm" onClick={cancelarForm}>
                  Cancelar
                </button>
              </div>
              {mensagemAvaliacao && <p className="dash__book-hero-feedback">{mensagemAvaliacao}</p>}
            </form>
          )}

          {carregandoAvaliacoes ? (
            <RevCardsSkeleton count={2} />
          ) : avaliacoes.length === 0 ? (
            !mostrarForm && <div className="dash__empty">Nenhuma avaliação ainda. Seja a primeira pessoa a avaliar este livro.</div>
          ) : (
            <div className="dash__reviews">
              {avaliacoes.map((post) => {
                const souEu = user && post.autorId === user.id
                return (
                  <article className="dash__revcard" key={post.id}>
                    <div className="dash__revcard-head">
                      <div className="dash__revcard-who">
                        <span className="dash__revcard-avatar">{iniciais(post.autorNome)}</span>
                        <div>
                          <h4>
                            {post.autorNome}
                            {souEu && <span className="dash__revcard-you">Você</span>}
                          </h4>
                          <p>{new Date(post.criadoEm).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <RatingStars value={post.nota ?? 0} readOnly />
                    </div>

                    <p className="dash__revcard-text">{post.resenha ?? post.conteudo}</p>

                    <div className="dash__revcard-foot">
                      <button
                        type="button"
                        className={`dash__revcard-like${post.curtidoPeloUsuarioAtual ? ' dash__revcard-like--ativo' : ''}`}
                        onClick={() => handleCurtir(post.id)}
                        disabled={curtindo[post.id]}
                      >
                        <IconCurtir /> {post.totalCurtidas}
                      </button>
                      <span className="dash__revcard-comment">
                        <IconComentario /> {post.totalComentarios}
                      </span>

                      {souEu && (
                        <div className="dash__revcard-actions">
                          <button type="button" onClick={() => iniciarEdicao(post)} aria-label="Editar avaliação">
                            <IconEditarPena />
                          </button>
                          <button
                            type="button"
                            className="dash__revcard-actions-danger"
                            onClick={() => handleRemoverAvaliacao(post)}
                            aria-label="Excluir avaliação"
                          >
                            <IconLixo />
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </DashboardShell>

      {dialogoConfirmacao}
    </div>
  )
}
