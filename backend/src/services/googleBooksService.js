const { NotFoundError } = require('../lib/errors')
const { buscaLivrosCache, detalheLivroCache } = require('../lib/cache')

const BASE_URL = 'https://www.googleapis.com/books/v1'
const TAMANHO_PAGINA_MAXIMO = 40

function apiKeyParam() {
  const key = process.env.GOOGLE_BOOKS_API_KEY
  return key && key.trim() !== '' ? `&key=${encodeURIComponent(key)}` : ''
}

function autores(volumeInfo) {
  return volumeInfo.authors && volumeInfo.authors.length > 0 ? volumeInfo.authors.join(', ') : null
}

function categoria(volumeInfo) {
  return volumeInfo.categories && volumeInfo.categories.length > 0 ? volumeInfo.categories[0] : null
}

function capa(volumeInfo) {
  return volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail ?? null : null
}

function temQualidadeMinima(volumeInfo) {
  const temCapa = Boolean(volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail)
  const temDescricao = Boolean(volumeInfo.description && volumeInfo.description.trim() !== '')
  return temCapa || temDescricao
}

function paraResumo(item) {
  const info = item.volumeInfo
  return {
    identificadorExterno: item.id,
    titulo: info.title,
    autor: autores(info),
    capa: capa(info),
    categoria: categoria(info),
    dataPublicacao: info.publishedDate ?? null,
  }
}

function paraDetalhe(item) {
  const info = item.volumeInfo
  return {
    identificadorExterno: item.id,
    titulo: info.title,
    autor: autores(info),
    descricao: info.description ?? null,
    capa: capa(info),
    editora: info.publisher ?? null,
    dataPublicacao: info.publishedDate ?? null,
    categoria: categoria(info),
    numeroPaginas: info.pageCount ?? null,
  }
}

async function buscar(termo, categoriaFiltro, ordenar, pagina, tamanhoPagina, qualidadeMinima) {
  const paginaFinal = Math.max(pagina ?? 0, 0)
  const tamanhoFinal = Math.min(Math.max(tamanhoPagina ?? 20, 1), TAMANHO_PAGINA_MAXIMO)

  const termoBase = !termo || termo.trim() === '' ? '*' : termo
  const query = categoriaFiltro && categoriaFiltro.trim() !== '' ? `${termoBase}+subject:${categoriaFiltro}` : termoBase
  const orderBy = ordenar === 'recentes' ? 'newest' : 'relevance'

  const lang = process.env.GOOGLE_BOOKS_LANG || 'pt'
  const country = process.env.GOOGLE_BOOKS_COUNTRY || 'BR'

  const cacheKey = `${query}|${orderBy}|${paginaFinal}|${tamanhoFinal}|${qualidadeMinima}`

  return buscaLivrosCache.wrap(cacheKey, async () => {
    const url =
      `${BASE_URL}/volumes?q=${encodeURIComponent(query)}` +
      `&startIndex=${paginaFinal * tamanhoFinal}&maxResults=${tamanhoFinal}` +
      `&orderBy=${orderBy}&langRestrict=${lang}&country=${country}${apiKeyParam()}`

    const response = await fetch(url)
    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Google Books respondeu ${response.status}: ${body}`)
    }
    const data = await response.json()

    const items = data.items ?? []
    const livros = items
      .filter((item) => item.volumeInfo && item.volumeInfo.title)
      .filter((item) => !qualidadeMinima || temQualidadeMinima(item.volumeInfo))
      .map(paraResumo)

    return { livros, totalResultados: data.totalItems ?? 0, pagina: paginaFinal, tamanhoPagina: tamanhoFinal }
  })
}

async function detalhar(googleId) {
  return detalheLivroCache.wrap(googleId, async () => {
    const url = `${BASE_URL}/volumes/${encodeURIComponent(googleId)}?${apiKeyParam().replace(/^&/, '')}`
    const response = await fetch(url)

    if (response.status === 404) {
      throw new NotFoundError('Livro não encontrado no Google Books.')
    }
    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Google Books respondeu ${response.status}: ${body}`)
    }

    const item = await response.json()
    if (!item.volumeInfo) {
      throw new NotFoundError('Livro não encontrado no Google Books.')
    }

    return paraDetalhe(item)
  })
}

module.exports = { buscar, detalhar }
