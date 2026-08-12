import { useEffect, useRef } from 'react'
import './ConfirmDialog.css'

function IconAlerta() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4.5 2.8 20h18.4L12 4.5z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M12 10v4.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="12" cy="17.2" r="1.1" fill="currentColor" />
    </svg>
  )
}

export default function ConfirmDialog({
  visible,
  titulo,
  mensagem,
  detalhe,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
}) {
  const cancelarRef = useRef(null)
  const cardRef = useRef(null)
  const focoAnteriorRef = useRef(null)

  useEffect(() => {
    if (!visible) return

    focoAnteriorRef.current = document.activeElement
    cancelarRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onCancelar()
        return
      }

      if (event.key !== 'Tab') return

      const focaveis = cardRef.current?.querySelectorAll('button')
      if (!focaveis || focaveis.length === 0) return

      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]

      if (event.shiftKey && document.activeElement === primeiro) {
        event.preventDefault()
        ultimo.focus()
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault()
        primeiro.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      focoAnteriorRef.current?.focus?.()
    }
  }, [visible, onCancelar])

  if (!visible) return null

  return (
    <div className="confirm-dialog__backdrop" onClick={onCancelar}>
      <div
        ref={cardRef}
        className="confirm-dialog__card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-dialog__badge">
          <IconAlerta />
        </div>

        <h2 id="confirm-dialog-title">{titulo}</h2>
        <p id="confirm-dialog-desc">{mensagem}</p>
        {detalhe ? <p className="confirm-dialog__detalhe">{detalhe}</p> : null}

        <div className="confirm-dialog__acoes">
          <button
            type="button"
            className="confirm-dialog__btn confirm-dialog__btn--cancelar"
            onClick={onCancelar}
            ref={cancelarRef}
          >
            {textoCancelar}
          </button>
          <button type="button" className="confirm-dialog__btn confirm-dialog__btn--confirmar" onClick={onConfirmar}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
