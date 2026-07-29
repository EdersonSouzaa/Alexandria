import { useEffect, useRef } from 'react'

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

let scriptPromise = null

function loadGoogleScript() {
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('Não foi possível carregar o script do Google.'))
    }
    document.head.appendChild(script)
  })

  return scriptPromise
}

// Botão oficial "Fazer login com o Google". O token (credential) que ele
// devolve é opaco para o frontend: quem valida assinatura, emissor,
// audiência e expiração é sempre o backend (ver backend/src/lib/googleAuth.js).
// O frontend nunca lê nem confia em dados de perfil do próprio token.
export default function GoogleAuthButton({ onCredential, onError, text = 'continue_with' }) {
  const containerRef = useRef(null)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID não configurado; login com Google desabilitado.')
      return undefined
    }

    let cancelled = false

    loadGoogleScript()
      .then(() => {
        if (cancelled || !containerRef.current) return

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response?.credential) {
              onCredential(response.credential)
            } else {
              onError?.(new Error('Resposta inválida do Google.'))
            }
          },
          ux_mode: 'popup',
        })

        const width = Math.min(400, Math.max(200, Math.round(containerRef.current.offsetWidth) || 320))

        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text,
          width,
          logo_alignment: 'center',
        })
      })
      .catch((error) => onError?.(error))

    return () => {
      cancelled = true
    }
  }, [clientId, onCredential, onError, text])

  if (!clientId) return null

  return <div className="auth-google__btn" ref={containerRef} />
}
