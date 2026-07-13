const prisma = require('../lib/prisma')
const livroService = require('./livroService')
const gamificacaoService = require('./gamificacaoService')
const { DuplicateError, NotFoundError } = require('../lib/errors')

function paraResponse(item) {
  return {
    id: item.id,
    livro: {
      identificadorExterno: item.livro.identificadorExterno,
      titulo: item.livro.titulo,
      autor: item.livro.autor,
      capa: item.livro.capa,
      categoria: item.livro.categoria,
      dataPublicacao: item.livro.dataPublicacao,
    },
    statusLeitura: item.statusLeitura,
    favorito: item.favorito,
    criadoEm: item.criadoEm,
    atualizadoEm: item.atualizadoEm,
  }
}

async function adicionar(usuarioId, { identificadorExterno, statusLeitura }) {
  const livro = await livroService.obterOuCriarLivroLocal(identificadorExterno)

  const existente = await prisma.itemBiblioteca.findUnique({
    where: { usuarioId_livroId: { usuarioId, livroId: livro.id } },
  })
  if (existente) {
    throw new DuplicateError('Este livro já está na sua biblioteca.')
  }

  const status = statusLeitura ?? 'QUERO_LER'
  const item = await prisma.itemBiblioteca.create({
    data: { usuarioId, livroId: livro.id, statusLeitura: status },
    include: { livro: true },
  })

  await gamificacaoService.livroAdicionado(usuarioId, status)

  return paraResponse(item)
}

async function listar(usuarioId, { status, favorito }) {
  const itens = await prisma.itemBiblioteca.findMany({
    where: {
      usuarioId,
      ...(status ? { statusLeitura: status } : {}),
      ...(favorito !== undefined ? { favorito } : {}),
    },
    include: { livro: true },
    orderBy: { criadoEm: 'desc' },
  })
  return itens.map(paraResponse)
}

async function atualizarStatus(usuarioId, itemId, novoStatus) {
  const item = await buscarItem(usuarioId, itemId)
  const statusAntigo = item.statusLeitura

  const atualizado = await prisma.itemBiblioteca.update({
    where: { id: item.id },
    data: { statusLeitura: novoStatus },
    include: { livro: true },
  })

  await gamificacaoService.statusAlterado(usuarioId, statusAntigo, novoStatus)

  return paraResponse(atualizado)
}

async function alternarFavorito(usuarioId, itemId) {
  const item = await buscarItem(usuarioId, itemId)

  const atualizado = await prisma.itemBiblioteca.update({
    where: { id: item.id },
    data: { favorito: !item.favorito },
    include: { livro: true },
  })

  await gamificacaoService.favoritoAlternado(usuarioId, atualizado.favorito)

  return paraResponse(atualizado)
}

async function remover(usuarioId, itemId) {
  const item = await buscarItem(usuarioId, itemId)
  await prisma.itemBiblioteca.delete({ where: { id: item.id } })
  await gamificacaoService.livroRemovido(usuarioId, item.statusLeitura, item.favorito)
}

async function buscarItem(usuarioId, itemId) {
  const item = await prisma.itemBiblioteca.findFirst({ where: { id: itemId, usuarioId } })
  if (!item) {
    throw new NotFoundError('Item da biblioteca não encontrado.')
  }
  return item
}

module.exports = { adicionar, listar, atualizarStatus, alternarFavorito, remover }
