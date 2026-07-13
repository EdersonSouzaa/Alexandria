import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Input from '../components/Input'
import '../styles/landing.css'

const destaques = [
  {
    titulo: 'Descubra livros',
    descricao: 'Pesquise no acervo do Google Books com filtros por categoria, ordenação e qualidade do resultado.',
  },
  {
    titulo: 'Organize sua biblioteca',
    descricao: 'Controle o que você quer ler, está lendo, já leu ou abandonou — e marque seus favoritos.',
  },
  {
    titulo: 'Avalie suas leituras',
    descricao: 'Dê notas de 1 a 5 estrelas, escreva resenhas e exporte tudo em CSV quando quiser.',
  },
  {
    titulo: 'Participe da comunidade',
    descricao: 'Suas avaliações viram publicações no feed. Curta e comente as leituras de outros leitores.',
  },
  {
    titulo: 'Evolua como leitor',
    descricao: 'Ganhe XP, suba de nível e desbloqueie conquistas conforme usa a plataforma.',
  },
]

export default function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [termo, setTermo] = useState('')

  function handleBuscar(event) {
    event.preventDefault()
    if (user) {
      navigate(`/explorar?termo=${encodeURIComponent(termo)}`)
    } else {
      navigate('/cadastro')
    }
  }

  return (
    <div className="landing">
      <section className="landing__hero container">
        <span className="kicker">Sua biblioteca pessoal, do jeito de Alexandria</span>
        <h1>Organize suas leituras e acompanhe sua jornada como leitor.</h1>
        <p>
          Pesquise livros, monte sua estante digital, avalie o que você leu e evolua em um sistema de
          gamificação feito para quem ama ler.
        </p>

        <form className="landing__search" onSubmit={handleBuscar}>
          <Input
            aria-label="Buscar um livro"
            placeholder="Busque por título, autor ou assunto…"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
          <Button type="submit">Buscar</Button>
        </form>

        {!user && (
          <div className="landing__cta">
            <Button to="/cadastro">Criar minha conta grátis</Button>
            <Button to="/login" variant="secondary">
              Já tenho conta
            </Button>
          </div>
        )}
      </section>

      <section className="container">
        <div className="grid grid-cards">
          {destaques.map((item) => (
            <div className="card" key={item.titulo}>
              <h3>{item.titulo}</h3>
              <p>{item.descricao}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
