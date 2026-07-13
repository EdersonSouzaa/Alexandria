import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { livroService } from '../services/livroService'
import { bibliotecaService } from '../services/bibliotecaService'
import { avaliacaoService } from '../services/avaliacaoService'
import { useGamificacao } from '../context/GamificacaoContext'
import Button from '../components/Button'
import Input from '../components/Input'
import RatingStars from '../components/RatingStars'
import LoadingSpinner from '../components/LoadingSpinner'
import '../styles/livroDetalhe.css'

const STATUS_OPCOES = [
  { valor: 'QUERO_LER', label: 'Quero ler' },
  { valor: 'LENDO', label: 'Lendo' },
  { valor: 'LIDO', label: 'Lido' },
  { valor: 'ABANDONADO', label: 'Abandonado' },
]

export default function LivroDetalhePage() {
  const { id } = useParams()
  const { refresh: refreshGamificacao } = useGamificacao()

  const [livro, setLivro] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [statusSelecionado, setStatusSelecionado] = useState('QUERO_LER')
  const [adicionandoBiblioteca, setAdicionandoBiblioteca] = useState(false)
  const [mensagemBiblioteca, setMensagemBiblioteca] = useState('')

  const [nota, setNota] = useState(0)
  const [resenha, setResenha] = useState('')
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false)
  const [mensagemAvaliacao, setMensagemAvaliacao] = useState('')

  useEffect(() => {
    setCarregando(true)
    setErro('')
    livroService
      .detalhar(id)
      .then(setLivro)
      .catch(() => setErro('Não foi possível carregar os detalhes deste livro.'))
      .finally(() => setCarregando(false))
  }, [id])

  async function handleAdicionarBiblioteca() {
    setAdicionandoBiblioteca(true)
    setMensagemBiblioteca('')
    try {
      await bibliotecaService.adicionar({ identificadorExterno: id, statusLeitura: statusSelecionado })
      setMensagemBiblioteca('Livro adicionado à sua biblioteca!')
      refreshGamificacao()
    } catch (error) {
      setMensagemBiblioteca(error.response?.data?.mensagem ?? 'Não foi possível adicionar este livro.')
    } finally {
      setAdicionandoBiblioteca(false)
    }
  }

  async function handleAvaliar(event) {
    event.preventDefault()
    setEnviandoAvaliacao(true)
    setMensagemAvaliacao('')
    try {
      await avaliacaoService.criar({ identificadorExterno: id, nota, resenha })
      setMensagemAvaliacao('Avaliação publicada! Ela também apareceu na comunidade.')
      refreshGamificacao()
    } catch (error) {
      setMensagemAvaliacao(error.response?.data?.mensagem ?? 'Não foi possível publicar sua avaliação.')
    } finally {
      setEnviandoAvaliacao(false)
    }
  }

  if (carregando) {
    return <LoadingSpinner label="Carregando livro…" />
  }

  if (erro || !livro) {
    return (
      <div className="page container empty-state">
        <p>{erro || 'Livro não encontrado.'}</p>
      </div>
    )
  }

  return (
    <div className="page container livro-detalhe">
      <div className="livro-detalhe__cover">
        {livro.capa ? (
          <img src={livro.capa} alt={`Capa de ${livro.titulo}`} />
        ) : (
          <div className="livro-detalhe__cover-placeholder">{livro.titulo?.[0]}</div>
        )}
      </div>

      <div className="livro-detalhe__info">
        <h1>{livro.titulo}</h1>
        {livro.autor && <p className="text-muted">{livro.autor}</p>}

        <div className="livro-detalhe__meta">
          {livro.editora && <span className="badge">{livro.editora}</span>}
          {livro.dataPublicacao && <span className="badge">{livro.dataPublicacao}</span>}
          {livro.numeroPaginas && <span className="badge">{livro.numeroPaginas} páginas</span>}
          {livro.categoria && <span className="badge">{livro.categoria}</span>}
        </div>

        {livro.descricao && <p>{livro.descricao}</p>}

        <div className="card livro-detalhe__acao">
          <h3>Adicionar à biblioteca</h3>
          <div className="row">
            <select
              className="input"
              value={statusSelecionado}
              onChange={(e) => setStatusSelecionado(e.target.value)}
            >
              {STATUS_OPCOES.map((opcao) => (
                <option key={opcao.valor} value={opcao.valor}>
                  {opcao.label}
                </option>
              ))}
            </select>
            <Button onClick={handleAdicionarBiblioteca} loading={adicionandoBiblioteca}>
              Adicionar
            </Button>
          </div>
          {mensagemBiblioteca && <p className="text-muted">{mensagemBiblioteca}</p>}
        </div>

        <div className="card livro-detalhe__acao">
          <h3>Avaliar este livro</h3>
          <form onSubmit={handleAvaliar}>
            <RatingStars value={nota} onChange={setNota} />
            <Input
              as="textarea"
              rows={4}
              placeholder="Escreva sua resenha…"
              maxLength={5000}
              value={resenha}
              onChange={(e) => setResenha(e.target.value)}
              required
            />
            <Button type="submit" loading={enviandoAvaliacao} disabled={nota === 0}>
              Publicar avaliação
            </Button>
          </form>
          {mensagemAvaliacao && <p className="text-muted">{mensagemAvaliacao}</p>}
        </div>
      </div>
    </div>
  )
}
