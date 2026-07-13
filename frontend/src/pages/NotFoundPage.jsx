import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page container empty-state">
      <span className="kicker">Erro 404</span>
      <h1>Página não encontrada</h1>
      <p>A página que você procura não existe ou foi movida.</p>
      <Link to="/">Voltar para o início</Link>
    </div>
  )
}
