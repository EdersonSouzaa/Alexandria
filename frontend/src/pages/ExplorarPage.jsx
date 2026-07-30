import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { livroService } from '../services/livroService'
import { bibliotecaService } from '../services/bibliotecaService'
import Pagination from '../components/Pagination'
import DashboardShell from '../components/DashboardShell'
import { BookGridSkeleton } from '../components/Skeleton'
import '../styles/dashboard.css'
import '../styles/book-grid.css'

const CATEGORIAS = [
  { valor: '', label: 'Todas as categorias' },
  { valor: 'fiction', label: 'Ficção' },
  { valor: 'biography', label: 'Biografia' },
  { valor: 'history', label: 'História' },
  { valor: 'science', label: 'Ciência' },
  { valor: 'business', label: 'Negócios' },
  { valor: 'self-help', label: 'Autoajuda' },
]

function IconChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconMais() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ExplorarPage() {
  const [searchParams] = useSearchParams()

  const [termo, setTermo] = useState(searchParams.get('termo') ?? '')
  const [categoria, setCategoria] = useState('')
  const [ordenar, setOrdenar] = useState('relevancia')
  const [pagina, setPagina] = useState(0)
  const [resultado, setResultado] = useState(null)
  const [modoResultado, setModoResultado] = useState('tendencias')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [adicionando, setAdicionando] = useState({})

  const tamanhoPagina = 20

  const buscar = useCallback(
    async (paginaAlvo = 0) => {
      setCarregando(true)
      setErro('')
      const semFiltros = !termo.trim() && !categoria
      try {
        if (semFiltros) {
          const dados = await livroService.tendencias()
          setResultado(dados)
          setModoResultado('tendencias')
          setPagina(0)
        } else {
          const dados = await livroService.buscar({
            termo,
            categoria: categoria || undefined,
            ordenar,
            pagina: paginaAlvo,
            tamanhoPagina,
          })
          setResultado(dados)
          setModoResultado('busca')
          setPagina(paginaAlvo)
        }
      } catch {
        setErro('Não foi possível buscar livros agora. Tente novamente em instantes.')
      } finally {
        setCarregando(false)
      }
    },
    [termo, categoria, ordenar],
  )

  useEffect(() => {
    buscar(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoria, ordenar])

  function handleSubmit(event) {
    event.preventDefault()
    buscar(0)
  }

  async function handleAdicionar(livro) {
    const id = livro.identificadorExterno
    setAdicionando((prev) => ({ ...prev, [id]: 'carregando' }))
    try {
      await bibliotecaService.adicionar({ identificadorExterno: id, statusLeitura: 'QUERO_LER' })
      setAdicionando((prev) => ({ ...prev, [id]: 'ok' }))
    } catch (error) {
      const mensagem = error.response?.data?.mensagem ?? 'Não foi possível adicionar.'
      setAdicionando((prev) => ({ ...prev, [id]: mensagem }))
      setTimeout(() => {
        setAdicionando((prev) => ({ ...prev, [id]: undefined }))
      }, 3000)
    }
  }

  const totalPaginas = resultado && modoResultado === 'busca' ? Math.ceil(resultado.totalResultados / tamanhoPagina) : 0

  return (
    <div className="dash">
      <DashboardShell
        active="/explorar"
        searchValue={termo}
        onSearchChange={setTermo}
        onSearchSubmit={handleSubmit}
        searchPlaceholder="Título, autor ou assunto…"
      >
        <div className="dash__page-head">
          <div>
            <h1>Explorar</h1>
            <p>
              {resultado
                ? modoResultado === 'tendencias'
                  ? `${resultado.livros.length} livros em alta na Open Library`
                  : `${resultado.totalResultados} ${resultado.totalResultados === 1 ? 'livro encontrado' : 'livros encontrados'}`
                : 'Encontre seu próximo livro'}
              {modoResultado === 'busca' && termo && (
                <>
                  {' '}
                  para <em>&quot;{termo}&quot;</em>
                </>
              )}
            </p>
          </div>

          <div className="dash__filters">
            <label className="dash__pill-select">
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Categoria">
                {CATEGORIAS.map((c) => (
                  <option key={c.valor} value={c.valor}>
                    {c.label}
                  </option>
                ))}
              </select>
              <IconChevron />
            </label>
            <label className="dash__pill-select">
              <select value={ordenar} onChange={(e) => setOrdenar(e.target.value)} aria-label="Ordenar por">
                <option value="relevancia">Mais relevantes</option>
                <option value="recentes">Mais recentes</option>
              </select>
              <IconChevron />
            </label>
          </div>
        </div>

        {carregando && <BookGridSkeleton count={12} />}

        {!carregando && erro && <div className="dash__error">{erro}</div>}

        {!carregando && !erro && resultado && resultado.livros.length === 0 && (
          <div className="dash__empty">Nenhum livro encontrado para essa busca.</div>
        )}

        {!carregando && !erro && resultado && resultado.livros.length > 0 && (
          <>
            <div className="dash__book-grid">
              {resultado.livros.map((livro) => {
                const estado = adicionando[livro.identificadorExterno]
                const detalheUrl = `/livros/${livro.identificadorExterno}`
                return (
                  <div className="dash__book" key={livro.identificadorExterno}>
                    <div className="dash__book-cover">
                      <Link to={detalheUrl}>
                        {livro.capa ? (
                          <img src={livro.capa} alt={`Capa de ${livro.titulo}`} loading="lazy" />
                        ) : (
                          <span className="dash__book-placeholder">{livro.titulo?.[0]}</span>
                        )}
                      </Link>
                      <div className="dash__book-overlay">
                        <button
                          type="button"
                          className={`dash__book-add${estado === 'ok' ? ' dash__book-add--ok' : ''}`}
                          onClick={() => handleAdicionar(livro)}
                          disabled={estado === 'carregando' || estado === 'ok'}
                        >
                          {estado === 'ok' ? (
                            <>
                              <IconCheck /> Na estante
                            </>
                          ) : estado === 'carregando' ? (
                            'Adicionando…'
                          ) : (
                            <>
                              <IconMais /> Adicionar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="dash__book-ledge" />
                    <div className="dash__book-info">
                      <Link to={detalheUrl}>
                        <h3>{livro.titulo}</h3>
                      </Link>
                      {livro.autor && <p className="dash__book-author">{livro.autor}</p>}
                      {livro.categoria && <span className="dash__book-tag">{livro.categoria}</span>}
                      {estado && estado !== 'carregando' && estado !== 'ok' && (
                        <p className="dash__book-error">{estado}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            {modoResultado === 'busca' && (
              <Pagination pagina={pagina} totalPaginas={totalPaginas} onChange={buscar} />
            )}
          </>
        )}
      </DashboardShell>
    </div>
  )
}
