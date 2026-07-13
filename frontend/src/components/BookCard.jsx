import { Link } from 'react-router-dom'
import './BookCard.css'

export default function BookCard({ livro, linkTo, children }) {
  const capa = livro.capa
  const conteudo = (
    <>
      <div className="book-card__cover">
        {capa ? <img src={capa} alt={`Capa de ${livro.titulo}`} loading="lazy" /> : <span>{livro.titulo?.[0]}</span>}
      </div>
      <div className="book-card__info">
        <h3 className="book-card__title">{livro.titulo}</h3>
        {livro.autor && <p className="book-card__author">{livro.autor}</p>}
      </div>
    </>
  )

  return (
    <div className="book-card">
      {linkTo ? (
        <Link to={linkTo} className="book-card__link">
          {conteudo}
        </Link>
      ) : (
        conteudo
      )}
      {children && <div className="book-card__footer">{children}</div>}
    </div>
  )
}
