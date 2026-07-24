const prisma = require('../lib/prisma')
const gamificacaoService = require('./gamificacaoService')
const { NotFoundError } = require('../lib/errors')

async function criarPostAutomatico(usuario, livro, avaliacao) {
  const conteudo = `${usuario.name} avaliou "${livro.titulo}" com nota ${avaliacao.nota}/5.\n\n${avaliacao.resenha}`

  await prisma.comunidadePost.create({
    data: {
      usuarioId: usuario.id,
      livroId: livro.id,
      avaliacaoId: avaliacao.id,
      conteudo,
    },
  })

  await gamificacaoService.postCriado(usuario.id)
}

async function listarFeed(usuarioIdAtual, pagina, tamanhoPagina, identificadorExternoLivro) {
  let where
  if (identificadorExternoLivro) {
    const livro = await prisma.livro.findUnique({ where: { identificadorExterno: identificadorExternoLivro } })
    where = { livroId: livro?.id ?? -1 }
  }

  const [posts, totalElements] = await Promise.all([
    prisma.comunidadePost.findMany({
      where,
      orderBy: { criadoEm: 'desc' },
      skip: pagina * tamanhoPagina,
      take: tamanhoPagina,
      include: {
        usuario: true,
        livro: true,
        avaliacao: { select: { nota: true, resenha: true } },
        _count: { select: { curtidas: true, comentarios: true } },
        curtidas: usuarioIdAtual ? { where: { usuarioId: usuarioIdAtual }, select: { id: true } } : false,
      },
    }),
    prisma.comunidadePost.count({ where }),
  ])

  const content = posts.map((post) => paraResponse(post))
  const totalPages = Math.max(1, Math.ceil(totalElements / tamanhoPagina))

  return {
    content,
    totalElements,
    totalPages,
    number: pagina,
    size: tamanhoPagina,
    numberOfElements: content.length,
    first: pagina === 0,
    last: pagina >= totalPages - 1,
    empty: content.length === 0,
  }
}

async function curtir(usuarioId, postId) {
  const post = await buscarPost(postId)

  const curtidaExistente = await prisma.comunidadeCurtida.findUnique({
    where: { usuarioId_postId: { usuarioId, postId } },
  })

  if (curtidaExistente) {
    await prisma.comunidadeCurtida.delete({ where: { id: curtidaExistente.id } })
  } else {
    await prisma.comunidadeCurtida.create({ data: { usuarioId, postId } })
    await gamificacaoService.curtidaDada(usuarioId)
  }

  const atualizado = await prisma.comunidadePost.findUnique({
    where: { id: postId },
    include: {
      usuario: true,
      livro: true,
      avaliacao: { select: { nota: true, resenha: true } },
      _count: { select: { curtidas: true, comentarios: true } },
      curtidas: { where: { usuarioId }, select: { id: true } },
    },
  })

  return paraResponse(atualizado)
}

async function comentar(usuarioId, postId, { conteudo }) {
  await buscarPost(postId)

  const comentario = await prisma.comunidadeComentario.create({
    data: { usuarioId, postId, conteudo },
    include: { usuario: true },
  })

  await gamificacaoService.comentarioCriado(usuarioId)

  return paraResponseComentario(comentario)
}

async function listarComentarios(postId) {
  const comentarios = await prisma.comunidadeComentario.findMany({
    where: { postId },
    orderBy: { criadoEm: 'asc' },
    include: { usuario: true },
  })
  return comentarios.map(paraResponseComentario)
}

async function buscarPost(postId) {
  const post = await prisma.comunidadePost.findUnique({ where: { id: postId } })
  if (!post) {
    throw new NotFoundError('Publicação não encontrada.')
  }
  return post
}

function paraResponse(post) {
  return {
    id: post.id,
    autorId: post.usuario.id,
    autorNome: post.usuario.name,
    livroTitulo: post.livro ? post.livro.titulo : null,
    livroCapa: post.livro ? post.livro.capa : null,
    conteudo: post.conteudo,
    avaliacaoId: post.avaliacaoId,
    nota: post.avaliacao ? post.avaliacao.nota : null,
    resenha: post.avaliacao ? post.avaliacao.resenha : null,
    criadoEm: post.criadoEm,
    totalCurtidas: post._count.curtidas,
    totalComentarios: post._count.comentarios,
    curtidoPeloUsuarioAtual: Array.isArray(post.curtidas) && post.curtidas.length > 0,
  }
}

function paraResponseComentario(comentario) {
  return {
    id: comentario.id,
    autorId: comentario.usuario.id,
    autorNome: comentario.usuario.name,
    conteudo: comentario.conteudo,
    criadoEm: comentario.criadoEm,
  }
}

module.exports = { criarPostAutomatico, listarFeed, curtir, comentar, listarComentarios }
