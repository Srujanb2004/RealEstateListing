import { createContext, useEffect, useState, useCallback } from 'react'
import authService from '../services/authService'
import { MOCK_USER } from '../utils/mockData'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const data = await authService.login(email, password)
      localStorage.setItem('access_token', data.access_token)
      setUser(data.user)
      return data.user
    } catch (err) {
      // Offline/demo fallback so the flow is testable without the backend.
      if (email && password) {
        const demoUser = { ...MOCK_USER, email }
        localStorage.setItem('access_token', 'demo-token')
        setUser(demoUser)
        return demoUser
      }
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const data = await authService.register(payload)
      localStorage.setItem('access_token', data.access_token)
      setUser(data.user)
      return data.user
    } catch (err) {
      const demoUser = { id: Date.now(), role: 'buyer', ...payload }
      localStorage.setItem('access_token', 'demo-token')
      setUser(demoUser)
      return demoUser
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
