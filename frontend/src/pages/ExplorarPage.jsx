import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { livroService } from '../services/livroService'
import Input from '../components/Input'
import Button from '../components/Button'
import BookCard from '../components/BookCard'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'
import '../styles/explorar.css'

const CATEGORIAS = [
  { valor: '', label: 'Todas as categorias' },
  { valor: 'fiction', label: 'Ficção' },
  { valor: 'biography', label: 'Biografia' },
  { valor: 'history', label: 'História' },
  { valor: 'science', label: 'Ciência' },
  { valor: 'business', label: 'Negócios' },
  { valor: 'self-help', label: 'Autoajuda' },
]

export default function ExplorarPage() {
  const [searchParams] = useSearchParams()

  const [termo, setTermo] = useState(searchParams.get('termo') ?? '')
  const [categoria, setCategoria] = useState('')
  const [ordenar, setOrdenar] = useState('relevancia')
  const [pagina, setPagina] = useState(0)
  const [resultado, setResultado] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const tamanhoPagina = 20

  const buscar = useCallback(
    async (paginaAlvo = 0) => {
      setCarregando(true)
      setErro('')
      try {
        const dados = await livroService.buscar({
          termo,
          categoria: categoria || undefined,
          ordenar,
          pagina: paginaAlvo,
          tamanhoPagina,
        })
        setResultado(dados)
        setPagina(paginaAlvo)
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
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    buscar(0)
  }

  const totalPaginas = resultado ? Math.ceil(resultado.totalResultados / tamanhoPagina) : 0

  return (
    <div className="page container">
      <span className="kicker">Explorar</span>
      <h1>Encontre seu próximo livro</h1>

      <form className="explorar__filtros" onSubmit={handleSubmit}>
        <Input
          aria-label="Termo de busca"
          placeholder="Título, autor ou assunto…"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="input">
          {CATEGORIAS.map((c) => (
            <option key={c.valor} value={c.valor}>
              {c.label}
            </option>
          ))}
        </select>
        <select value={ordenar} onChange={(e) => setOrdenar(e.target.value)} className="input">
          <option value="relevancia">Mais relevantes</option>
          <option value="recentes">Mais recentes</option>
        </select>
        <Button type="submit">Buscar</Button>
      </form>

      {carregando && <LoadingSpinner label="Buscando livros…" />}
      {erro && <p className="form-error">{erro}</p>}

      {!carregando && resultado && resultado.livros.length === 0 && (
        <div className="empty-state">
          <p>Nenhum livro encontrado para essa busca.</p>
        </div>
      )}

      {!carregando && resultado && resultado.livros.length > 0 && (
        <>
          <div className="grid grid-cards">
            {resultado.livros.map((livro) => (
              <BookCard key={livro.identificadorExterno} livro={livro} linkTo={`/livros/${livro.identificadorExterno}`} />
            ))}
          </div>
          <Pagination pagina={pagina} totalPaginas={totalPaginas} onChange={buscar} />
        </>
      )}
    </div>
  )
}
