const prisma = require('../lib/prisma')
const livroService = require('./livroService')
const gamificacaoService = require('./gamificacaoService')
const comunidadeService = require('./comunidadeService')
const csvExportService = require('./csvExportService')
const { DuplicateError, NotFoundError } = require('../lib/errors')

function paraResponse(avaliacao) {
  return {
    id: avaliacao.id,
    livro: {
      identificadorExterno: avaliacao.livro.identificadorExterno,
      titulo: avaliacao.livro.titulo,
      autor: avaliacao.livro.autor,
      capa: avaliacao.livro.capa,
      categoria: avaliacao.livro.categoria,
      dataPublicacao: avaliacao.livro.dataPublicacao,
    },
    nota: avaliacao.nota,
    resenha: avaliacao.resenha,
    criadoEm: avaliacao.criadoEm,
    atualizadoEm: avaliacao.atualizadoEm,
  }
}

async function criar(usuarioId, { identificadorExterno, nota, resenha }) {
  const livro = await livroService.obterOuCriarLivroLocal(identificadorExterno)

  const existente = await prisma.avaliacao.findUnique({
    where: { usuarioId_livroId: { usuarioId, livroId: livro.id } },
  })
  if (existente) {
    throw new DuplicateError('Você já avaliou este livro.')
  }

  const usuario = await prisma.user.findUnique({ where: { id: usuarioId } })
  if (!usuario) {
    throw new NotFoundError('Usuário não encontrado.')
  }

  const avaliacao = await prisma.avaliacao.create({
    data: { usuarioId, livroId: livro.id, nota, resenha },
    include: { livro: true },
  })

  await gamificacaoService.avaliacaoCriada(usuarioId)
  await comunidadeService.criarPostAutomatico(usuario, livro, avaliacao)

  return paraResponse(avaliacao)
}

async function listar(usuarioId) {
  const avaliacoes = await prisma.avaliacao.findMany({
    where: { usuarioId },
    include: { livro: true },
    orderBy: { criadoEm: 'desc' },
  })
  return avaliacoes.map(paraResponse)
}

async function atualizar(usuarioId, avaliacaoId, { nota, resenha }) {
  await buscarAvaliacao(usuarioId, avaliacaoId)

  const atualizada = await prisma.avaliacao.update({
    where: { id: avaliacaoId },
    data: { nota, resenha },
    include: { livro: true },
  })

  return paraResponse(atualizada)
}

async function remover(usuarioId, avaliacaoId) {
  await buscarAvaliacao(usuarioId, avaliacaoId)
  await prisma.avaliacao.delete({ where: { id: avaliacaoId } })
  await gamificacaoService.avaliacaoRemovida(usuarioId)
}

async function exportarCsv(usuarioId) {
  const avaliacoes = await prisma.avaliacao.findMany({
    where: { usuarioId },
    include: { livro: true },
    orderBy: { criadoEm: 'desc' },
  })
  return csvExportService.exportarAvaliacoes(avaliacoes)
}

async function buscarAvaliacao(usuarioId, avaliacaoId) {
  const avaliacao = await prisma.avaliacao.findFirst({ where: { id: avaliacaoId, usuarioId } })
  if (!avaliacao) {
    throw new NotFoundError('Avaliação não encontrada.')
  }
  return avaliacao
}

module.exports = { criar, listar, atualizar, remover, exportarCsv }
