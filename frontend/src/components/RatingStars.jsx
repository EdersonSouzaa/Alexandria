import './RatingStars.css'

export default function RatingStars({ value = 0, onChange, readOnly = false }) {
  const estrelas = [1, 2, 3, 4, 5]

  return (
    <div className={`rating-stars${readOnly ? ' rating-stars--readonly' : ''}`}>
      {estrelas.map((estrela) => (
        <button
          key={estrela}
          type="button"
          className={`rating-stars__star${estrela <= value ? ' rating-stars__star--filled' : ''}`}
          onClick={() => !readOnly && onChange?.(estrela)}
          disabled={readOnly}
          aria-label={`${estrela} de 5 estrelas`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
