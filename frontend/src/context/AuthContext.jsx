import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService } from '../services/authService'
import { TOKEN_KEY } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }

    authService
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const response = await authService.login({ email, password })
    localStorage.setItem(TOKEN_KEY, response.token)
    setUser({ id: response.id, name: response.name, email: response.email })
    return response
  }, [])

  const register = useCallback(async (name, email, password) => {
    const response = await authService.register({ name, email, password })
    localStorage.setItem(TOKEN_KEY, response.token)
    setUser({ id: response.id, name: response.name, email: response.email })
    return response
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (data) => {
    const updated = await authService.updateProfile(data)
    setUser(updated)
    return updated
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
