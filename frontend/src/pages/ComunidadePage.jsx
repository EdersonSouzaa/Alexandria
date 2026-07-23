import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { comunidadeService } from '../services/comunidadeService'
import { useGamificacao } from '../context/GamificacaoContext'
import Button from '../components/Button'
import Input from '../components/Input'
import Pagination from '../components/Pagination'
import DashboardShell from '../components/DashboardShell'
import { iniciais } from '../components/DashboardIcons'
import '../styles/dashboard.css'
import '../styles/comunidade.css'

function IconEstrela(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.8L12 2.5z" />
    </svg>
  )
}

function IconCoracao(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={props.filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 20.2s-7.2-4.4-9.6-8.9C.8 7.7 2.4 4.6 5.5 4.1a4.7 4.7 0 016.5 2 4.7 4.7 0 016.5-2c3.1.5 4.7 3.6 3.1 7.2-2.4 4.5-9.6 8.9-9.6 8.9z" strokeLinejoin="round" />
    </svg>
  )
}

function IconComentario() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5h16v11H8l-4 4V5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCalendario() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 9.5h16M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export default function ComunidadePage() {
  const { refresh: refreshGamificacao } = useGamificacao()
  const navigate = useNavigate()

  const [pagina, setPagina] = useState(0)
  const [feed, setFeed] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [postosExpandidos, setPostosExpandidos] = useState({})
  const [comentarios, setComentarios] = useState({})
  const [novoComentario, setNovoComentario] = useState({})
  const [termoBusca, setTermoBusca] = useState('')

  async function carregar(paginaAlvo = 0) {
    setCarregando(true)
    try {
      const dados = await comunidadeService.listarFeed({ pagina: paginaAlvo, tamanhoPagina: 10 })
      setFeed(dados)
      setPagina(paginaAlvo)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar(0)
  }, [])

  function handleBuscar(event) {
    event.preventDefault()
    navigate(`/explorar?termo=${encodeURIComponent(termoBusca)}`)
  }

  async function handleCurtir(postId) {
    const postAtualizado = await comunidadeService.curtir(postId)
    setFeed((atual) => ({
      ...atual,
      content: atual.content.map((post) => (post.id === postId ? postAtualizado : post)),
    }))
    refreshGamificacao()
  }

  async function handleExpandirComentarios(postId) {
    setPostosExpandidos((atual) => ({ ...atual, [postId]: !atual[postId] }))
    if (!comentarios[postId]) {
      const lista = await comunidadeService.listarComentarios(postId)
      setComentarios((atual) => ({ ...atual, [postId]: lista }))
    }
  }

  async function handleComentar(event, postId) {
    event.preventDefault()
    const conteudo = novoComentario[postId]?.trim()
    if (!conteudo) return

    const comentario = await comunidadeService.comentar(postId, conteudo)
    setComentarios((atual) => ({ ...atual, [postId]: [...(atual[postId] ?? []), comentario] }))
    setNovoComentario((atual) => ({ ...atual, [postId]: '' }))
    setFeed((atual) => ({
      ...atual,
      content: atual.content.map((post) =>
        post.id === postId ? { ...post, totalComentarios: post.totalComentarios + 1 } : post,
      ),
    }))
    refreshGamificacao()
  }

  if (carregando && !feed) {
    return (
      <div className="dash">
        <div className="dash__loading">
          <span className="dash__spinner" />
          <span>Carregando o feed…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="dash">
      <DashboardShell
        active="/comunidade"
        searchValue={termoBusca}
        onSearchChange={setTermoBusca}
        onSearchSubmit={handleBuscar}
        searchPlaceholder="Buscar na sua biblioteca…"
      >
        <div className="dash__page-head">
          <div>
            <h1>Comunidade</h1>
            <p>Veja o que os leitores estão comentando agora.</p>
          </div>
          <div className="dash__filters">
            <Link to="/explorar" className="dash__filter-toggle dash__filter-toggle--active">
              <IconEstrela /> Avaliar um livro
            </Link>
          </div>
        </div>

        {feed && feed.content.length === 0 && (
          <div className="dash__empty">Ainda não há publicações. Avalie um livro para gerar a primeira!</div>
        )}

        <div className="dash__posts">
          {feed?.content.map((post) => (
            <article className="dash__post" key={post.id}>
              <div className="dash__post-head">
                <span className="dash__post-avatar">{iniciais(post.autorNome)}</span>
                <div>
                  <strong>{post.autorNome}</strong>
                  <span className="dash__post-date">
                    <IconCalendario /> {new Date(post.criadoEm).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              <p className="dash__post-content">{post.conteudo}</p>

              {post.livroTitulo && (
                <div className="dash__post-book">
                  <span className="dash__post-book-cover">
                    {post.livroCapa ? (
                      <img src={post.livroCapa} alt={`Capa de ${post.livroTitulo}`} loading="lazy" />
                    ) : (
                      <span className="dash__book-placeholder">{post.livroTitulo[0]}</span>
                    )}
                  </span>
                  <span className="dash__post-book-title">{post.livroTitulo}</span>
                </div>
              )}

              <div className="dash__post-actions">
                <button
                  type="button"
                  className={`dash__post-like${post.curtidoPeloUsuarioAtual ? ' dash__post-like--ativo' : ''}`}
                  onClick={() => handleCurtir(post.id)}
                >
                  <IconCoracao filled={post.curtidoPeloUsuarioAtual} /> {post.totalCurtidas}
                </button>
                <button type="button" className="dash__post-comment" onClick={() => handleExpandirComentarios(post.id)}>
                  <IconComentario /> {post.totalComentarios}{' '}
                  {post.totalComentarios === 1 ? 'comentário' : 'comentários'}
                </button>
              </div>

              {postosExpandidos[post.id] && (
                <div className="dash__post-comments">
                  {(comentarios[post.id] ?? []).map((comentario) => (
                    <div key={comentario.id} className="dash__post-comment-item">
                      <span className="dash__post-avatar dash__post-avatar--sm">{iniciais(comentario.autorNome)}</span>
                      <div>
                        <strong>{comentario.autorNome}</strong>
                        <p>{comentario.conteudo}</p>
                      </div>
                    </div>
                  ))}

                  <form className="dash__post-comment-form" onSubmit={(e) => handleComentar(e, post.id)}>
                    <Input
                      aria-label="Escrever comentário"
                      placeholder="Escreva um comentário…"
                      value={novoComentario[post.id] ?? ''}
                      onChange={(e) =>
                        setNovoComentario((atual) => ({ ...atual, [post.id]: e.target.value }))
                      }
                    />
                    <Button type="submit">Comentar</Button>
                  </form>
                </div>
              )}
            </article>
          ))}
        </div>

        {feed && <Pagination pagina={pagina} totalPaginas={feed.totalPages} onChange={carregar} />}
      </DashboardShell>
    </div>
  )
}
