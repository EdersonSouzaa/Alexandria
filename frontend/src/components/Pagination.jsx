import './Pagination.css'

export default function Pagination({ pagina, totalPaginas, onChange }) {
  if (totalPaginas <= 1) {
    return null
  }

  return (
    <div className="pagination">
      <button disabled={pagina <= 0} onClick={() => onChange(pagina - 1)}>
        Anterior
      </button>
      <span className="text-muted">
        Página {pagina + 1} de {totalPaginas}
      </span>
      <button disabled={pagina >= totalPaginas - 1} onClick={() => onChange(pagina + 1)}>
        Próxima
      </button>
    </div>
  )
}
