import './Input.css'

export default function Input({ label, error, id, as = 'input', icon, suffix, ...rest }) {
  const Tag = as
  const field = <Tag id={id} className="input" {...rest} />

  return (
    <div className="form-field">
      {label && <label htmlFor={id}>{label}</label>}
      {icon || suffix ? (
        <div className="input-row">
          {icon && <span className="input-row__icon">{icon}</span>}
          {field}
          {suffix && <span className="input-row__suffix">{suffix}</span>}
        </div>
      ) : (
        field
      )}
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}
