import './Input.css'

export default function Input({ label, error, id, as = 'input', ...rest }) {
  const Tag = as
  return (
    <div className="form-field">
      {label && <label htmlFor={id}>{label}</label>}
      <Tag id={id} className="input" {...rest} />
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}
