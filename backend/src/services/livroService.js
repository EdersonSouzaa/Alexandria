const prisma = require('../lib/prisma')
const googleBooksService = require('./googleBooksService')

async function buscar(termo, categoria, ordenar, pagina, tamanhoPagina, qualidadeMinima) {
  return googleBooksService.buscar(termo, categoria, ordenar, pagina, tamanhoPagina, qualidadeMinima)
}

async function detalhar(googleId) {
  return googleBooksService.detalhar(googleId)
}

async function obterOuCriarLivroLocal(googleId) {
  const existente = await prisma.livro.findUnique({ where: { identificadorExterno: googleId } })
  if (existente) return existente

  const detalhe = await googleBooksService.detalhar(googleId)
  return prisma.livro.create({
    data: {
      identificadorExterno: detalhe.identificadorExterno,
      titulo: detalhe.titulo,
      autor: detalhe.autor,
      descricao: detalhe.descricao,
      capa: detalhe.capa,
      editora: detalhe.editora,
      dataPublicacao: detalhe.dataPublicacao,
      categoria: detalhe.categoria,
      numeroPaginas: detalhe.numeroPaginas,
    },
  })
}

module.exports = { buscar, detalhar, obterOuCriarLivroLocal }
