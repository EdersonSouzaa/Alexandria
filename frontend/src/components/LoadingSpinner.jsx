import './LoadingSpinner.css'

export default function LoadingSpinner({ label = 'Carregando…' }) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <span className="loading-spinner__circle" />
      <span className="text-muted">{label}</span>
    </div>
  )
}
