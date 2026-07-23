const { NotFoundError } = require('../lib/errors')
const { buscaLivrosCache, detalheLivroCache } = require('../lib/cache')

const BASE_URL = 'https://openlibrary.org'
const COVERS_BASE_URL = 'https://covers.openlibrary.org/b/id'
const USER_AGENT = 'AlexandriaApp/1.0 (contato via app; uso educacional)'
const TAMANHO_PAGINA_MAXIMO = 100

function headers() {
  return { 'User-Agent': USER_AGENT }
}

function idDoWork(key) {
  return key.replace('/works/', '')
}

function capaPorId(coverId) {
  return coverId && coverId > 0 ? `${COVERS_BASE_URL}/${coverId}-M.jpg` : null
}

function autores(doc) {
  return doc.author_name && doc.author_name.length > 0 ? doc.author_name.join(', ') : null
}

function categoria(doc) {
  return doc.subject && doc.subject.length > 0 ? doc.subject[0] : null
}

function paraResumo(doc) {
  return {
    identificadorExterno: idDoWork(doc.key),
    titulo: doc.title,
    autor: autores(doc),
    capa: capaPorId(doc.cover_i),
    categoria: categoria(doc),
    dataPublicacao: doc.first_publish_year ? String(doc.first_publish_year) : null,
  }
}

async function nomesAutores(authors) {
  if (!authors || authors.length === 0) return null

  const chaves = authors
    .map((entry) => entry.author?.key)
    .filter(Boolean)
    .slice(0, 3)

  const nomes = await Promise.all(
    chaves.map(async (key) => {
      try {
        const response = await fetch(`${BASE_URL}${key}.json`, { headers: headers() })
        if (!response.ok) return null
        const data = await response.json()
        return data.name ?? null
      } catch {
        return null
      }
    }),
  )

  const encontrados = nomes.filter(Boolean)
  return encontrados.length > 0 ? encontrados.join(', ') : null
}

async function buscar(termo, categoriaFiltro, ordenar, pagina, tamanhoPagina, qualidadeMinima) {
  const paginaFinal = Math.max(pagina ?? 0, 0)
  const tamanhoFinal = Math.min(Math.max(tamanhoPagina ?? 20, 1), TAMANHO_PAGINA_MAXIMO)

  const termoBase = !termo || termo.trim() === '' ? '*' : termo
  const query = categoriaFiltro && categoriaFiltro.trim() !== '' ? `${termoBase} subject:${categoriaFiltro}` : termoBase
  const sort = ordenar === 'recentes' ? 'new' : undefined

  const cacheKey = `${query}|${sort}|${paginaFinal}|${tamanhoFinal}|${qualidadeMinima}`

  return buscaLivrosCache.wrap(cacheKey, async () => {
    const params = new URLSearchParams({
      q: query,
      offset: String(paginaFinal * tamanhoFinal),
      limit: String(tamanhoFinal),
      fields: 'key,title,author_name,cover_i,first_publish_year,subject',
    })
    if (sort) params.set('sort', sort)

    const response = await fetch(`${BASE_URL}/search.json?${params}`, { headers: headers() })
    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Open Library respondeu ${response.status}: ${body}`)
    }
    const data = await response.json()

    const docs = data.docs ?? []
    const livros = docs
      .filter((doc) => doc.title && doc.key)
      .filter((doc) => !qualidadeMinima || Boolean(doc.cover_i))
      .map(paraResumo)

    return { livros, totalResultados: data.numFound ?? 0, pagina: paginaFinal, tamanhoPagina: tamanhoFinal }
  })
}

async function detalhar(workId) {
  return detalheLivroCache.wrap(workId, async () => {
    const response = await fetch(`${BASE_URL}/works/${encodeURIComponent(workId)}.json`, { headers: headers() })

    if (response.status === 404) {
      throw new NotFoundError('Livro não encontrado na Open Library.')
    }
    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Open Library respondeu ${response.status}: ${body}`)
    }

    const work = await response.json()
    if (!work.title) {
      throw new NotFoundError('Livro não encontrado na Open Library.')
    }

    const coverId = work.covers ? work.covers.find((c) => c > 0) : null
    const descricao = typeof work.description === 'string' ? work.description : (work.description?.value ?? null)

    return {
      identificadorExterno: workId,
      titulo: work.title,
      autor: await nomesAutores(work.authors),
      descricao,
      capa: capaPorId(coverId),
      editora: null,
      dataPublicacao: work.first_publish_date ?? null,
      categoria: work.subjects && work.subjects.length > 0 ? work.subjects[0] : null,
      numeroPaginas: null,
    }
  })
}

async function tendencias() {
  return buscaLivrosCache.wrap('tendencias-diarias', async () => {
    const response = await fetch(`${BASE_URL}/trending/daily.json`, { headers: headers() })
    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Open Library respondeu ${response.status}: ${body}`)
    }
    const data = await response.json()

    const works = data.works ?? []
    const livros = works.filter((work) => work.title && work.key).map(paraResumo)

    return { livros, totalResultados: livros.length, pagina: 0, tamanhoPagina: livros.length }
  })
}

module.exports = { buscar, detalhar, tendencias }
