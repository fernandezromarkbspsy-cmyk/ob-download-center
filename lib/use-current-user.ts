"use client"

import { useEffect, useState } from "react"

export interface CurrentUser {
  employeeId: string
  fullName: string
  loginTime: string
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("currentUser")
    setUser(null)
  }

  return { user, isLoading, logout }
}
