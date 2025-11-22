"use client"

import { useState, useEffect, useCallback } from "react"
import API_URL from "../../config/api"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")
      
      if (!token || !storedUser) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        // Verify token is still valid by making a test API call
        const response = await fetch(`${API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          setUser(JSON.parse(storedUser))
        } else {
          // Token invalid, clear auth
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setUser(null)
        }
      } catch (error) {
        // On error, clear auth to be safe
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
      }
      
      setLoading(false)
    }

    validateAuth()
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/"
  }, [])

  const getToken = useCallback(() => {
    return localStorage.getItem("token")
  }, [])

  return { user, loading, logout, getToken }
}
