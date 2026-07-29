import { useEffect, useRef } from 'react'
import './WelcomeModal.css'

const DURACAO_MS = 4000

export default function WelcomeModal({ visible, nome, onClose }) {
  const botaoRef = useRef(null)

  useEffect(() => {
    if (!visible) return
    botaoRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    const timeout = setTimeout(onClose, DURACAO_MS)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timeout)
    }
  }, [visible, onClose])

  if (!visible) return null

  return (
    <div className="welcome-modal__backdrop" onClick={onClose}>
      <div
        className="welcome-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
        onClick={(event) => event.stopPropagation()}
        style={{ '--welcome-modal-duracao': `${DURACAO_MS}ms` }}
      >
        <div className="welcome-modal__badge">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              className="welcome-modal__check"
              d="M5 12.5l4.2 4.2L19 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 id="welcome-modal-title">Cadastro concluído com sucesso!</h2>
        <p>{nome ? `Bem-vindo(a), ${nome}! Sua estante já está pronta.` : 'Sua estante já está pronta para você.'}</p>

        <button type="button" className="welcome-modal__btn" onClick={onClose} ref={botaoRef}>
          Começar a explorar
        </button>

        <span className="welcome-modal__progress" aria-hidden="true" />
      </div>
    </div>
  )
}
