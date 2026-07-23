const prisma = require('../lib/prisma')
const openLibraryService = require('./openLibraryService')

async function buscar(termo, categoria, ordenar, pagina, tamanhoPagina, qualidadeMinima) {
  return openLibraryService.buscar(termo, categoria, ordenar, pagina, tamanhoPagina, qualidadeMinima)
}

async function tendencias() {
  return openLibraryService.tendencias()
}

async function detalhar(identificadorExterno) {
  return openLibraryService.detalhar(identificadorExterno)
}

async function obterOuCriarLivroLocal(identificadorExterno) {
  const existente = await prisma.livro.findUnique({ where: { identificadorExterno } })
  if (existente) return existente

  const detalhe = await openLibraryService.detalhar(identificadorExterno)
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

module.exports = { buscar, detalhar, tendencias, obterOuCriarLivroLocal }
