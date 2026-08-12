import { useCallback, useRef, useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

/**
 * Pede confirmação antes de uma ação destrutiva.
 *
 *   const { confirmar, dialogoConfirmacao } = useConfirm()
 *   if (!(await confirmar({ titulo, mensagem }))) return
 *
 * O elemento `dialogoConfirmacao` precisa ser renderizado na página.
 */
export function useConfirm() {
  const [opcoes, setOpcoes] = useState(null)
  const resolverRef = useRef(null)

  const confirmar = useCallback(
    (novasOpcoes) =>
      new Promise((resolve) => {
        resolverRef.current = resolve
        setOpcoes(novasOpcoes)
      }),
    [],
  )

  const responder = useCallback((resultado) => {
    setOpcoes(null)
    const resolver = resolverRef.current
    resolverRef.current = null
    resolver?.(resultado)
  }, [])

  const dialogoConfirmacao = (
    <ConfirmDialog
      visible={opcoes !== null}
      {...opcoes}
      onConfirmar={() => responder(true)}
      onCancelar={() => responder(false)}
    />
  )

  return { confirmar, dialogoConfirmacao }
}
