import { Link } from 'react-router-dom'
import './Button.css'

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  to,
  href,
  disabled = false,
  loading = false,
  onClick,
  ...rest
}) {
  const className = `btn btn-${variant}`

  if (to) {
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? 'Carregando…' : children}
    </button>
  )
}
