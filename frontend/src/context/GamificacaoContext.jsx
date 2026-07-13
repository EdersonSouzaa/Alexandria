import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { gamificacaoService } from '../services/gamificacaoService'
import { useAuth } from './AuthContext'

const GamificacaoContext = createContext(null)

export function GamificacaoProvider({ children }) {
  const { user } = useAuth()
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [xpGanho, setXpGanho] = useState(null)
  const xpAnterior = useRef(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const novoStatus = await gamificacaoService.consultar()
      if (xpAnterior.current !== null && novoStatus.xp > xpAnterior.current) {
        setXpGanho(novoStatus.xp - xpAnterior.current)
      }
      xpAnterior.current = novoStatus.xp
      setStatus(novoStatus)
      return novoStatus
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      refresh()
    } else {
      setStatus(null)
      xpAnterior.current = null
    }
  }, [user, refresh])

  useEffect(() => {
    if (xpGanho === null) return
    const timeout = setTimeout(() => setXpGanho(null), 4000)
    return () => clearTimeout(timeout)
  }, [xpGanho])

  return (
    <GamificacaoContext.Provider value={{ status, loading, refresh, xpGanho }}>
      {children}
    </GamificacaoContext.Provider>
  )
}

export function useGamificacao() {
  const context = useContext(GamificacaoContext)
  if (!context) {
    throw new Error('useGamificacao deve ser usado dentro de um GamificacaoProvider')
  }
  return context
}
