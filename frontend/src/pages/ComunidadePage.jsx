import { useEffect, useState } from 'react'
import { comunidadeService } from '../services/comunidadeService'
import { useGamificacao } from '../context/GamificacaoContext'
import Button from '../components/Button'
import Input from '../components/Input'
import LoadingSpinner from '../components/LoadingSpinner'
import Pagination from '../components/Pagination'
import '../styles/comunidade.css'

export default function ComunidadePage() {
  const { refresh: refreshGamificacao } = useGamificacao()

  const [pagina, setPagina] = useState(0)
  const [feed, setFeed] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [postosExpandidos, setPostosExpandidos] = useState({})
  const [comentarios, setComentarios] = useState({})
  const [novoComentario, setNovoComentario] = useState({})

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
    return <LoadingSpinner label="Carregando o feed…" />
  }

  return (
    <div className="page container">
      <span className="kicker">Comunidade</span>
      <h1>O que os leitores estão lendo</h1>

      {feed && feed.content.length === 0 && (
        <div className="empty-state">
          <p>Ainda não há publicações. Avalie um livro para gerar a primeira!</p>
        </div>
      )}

      <div className="stack">
        {feed?.content.map((post) => (
          <div className="card comunidade-post" key={post.id}>
            <div className="row-between">
              <strong>{post.autorNome}</strong>
              <span className="text-muted">{new Date(post.criadoEm).toLocaleDateString('pt-BR')}</span>
            </div>
            <p className="comunidade-post__conteudo">{post.conteudo}</p>

            <div className="row comunidade-post__acoes">
              <button
                className={`comunidade-post__curtir${post.curtidoPeloUsuarioAtual ? ' comunidade-post__curtir--ativo' : ''}`}
                onClick={() => handleCurtir(post.id)}
              >
                ♥ {post.totalCurtidas}
              </button>
              <button className="comunidade-post__comentar" onClick={() => handleExpandirComentarios(post.id)}>
                {post.totalComentarios} comentário{post.totalComentarios === 1 ? '' : 's'}
              </button>
            </div>

            {postosExpandidos[post.id] && (
              <div className="comunidade-post__comentarios">
                {(comentarios[post.id] ?? []).map((comentario) => (
                  <div key={comentario.id} className="comunidade-comentario">
                    <strong>{comentario.autorNome}</strong>
                    <p>{comentario.conteudo}</p>
                  </div>
                ))}

                <form className="row" onSubmit={(e) => handleComentar(e, post.id)}>
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
          </div>
        ))}
      </div>

      {feed && <Pagination pagina={pagina} totalPaginas={feed.totalPages} onChange={carregar} />}
    </div>
  )
}
