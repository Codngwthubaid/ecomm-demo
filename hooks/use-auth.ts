"use client"

import { create } from "zustand"
import { useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      set({ user: null })
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
    }
  },
}))

export function useAuth() {
  const { user, isLoading, setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Fetch user error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [setUser, setLoading])

  return { user, isLoading, logout }
}
