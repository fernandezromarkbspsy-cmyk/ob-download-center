"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"

export interface User {
  id: string
  employeeId: string
  fullName: string
  email: string
  avatar?: string
  isOnline: boolean
  lastSeen: Date
  status?: "online" | "away" | "offline"
}

interface UsersContextType {
  users: User[]
  currentUser: User | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setCurrentUser: (user: User) => void
  updateUserStatus: (userId: string, status: "online" | "away" | "offline") => void
  fetchUsers: () => Promise<void>
  getUserById: (userId: string) => User | undefined
  getOnlineUsers: () => User[]
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch users from database
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Mock data - in production, fetch from /api/users
      const mockUsers: User[] = [
        {
          id: "user-1",
          employeeId: "Ops93521",
          fullName: "John Doe",
          email: "john.doe@company.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
          isOnline: true,
          lastSeen: new Date(),
          status: "online",
        },
        {
          id: "user-2",
          employeeId: "Ops76014",
          fullName: "Jane Smith",
          email: "jane.smith@company.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
          isOnline: true,
          lastSeen: new Date(),
          status: "online",
        },
        {
          id: "user-3",
          employeeId: "Ops93568",
          fullName: "Mike Johnson",
          email: "mike.johnson@company.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
          isOnline: false,
          lastSeen: new Date(Date.now() - 30 * 60000),
          status: "offline",
        },
        {
          id: "user-4",
          employeeId: "Ops12345",
          fullName: "Sarah Williams",
          email: "sarah.williams@company.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          isOnline: true,
          lastSeen: new Date(Date.now() - 5 * 60000),
          status: "away",
        },
        {
          id: "user-5",
          employeeId: "Ops54321",
          fullName: "David Brown",
          email: "david.brown@company.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
          isOnline: true,
          lastSeen: new Date(),
          status: "online",
        },
      ]
      
      setUsers(mockUsers)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update user status
  const updateUserStatus = useCallback((userId: string, status: "online" | "away" | "offline") => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status,
              isOnline: status !== "offline",
              lastSeen: new Date(),
            }
          : user
      )
    )
  }, [])

  // Get user by ID
  const getUserById = useCallback((userId: string) => {
    return users.find((user) => user.id === userId)
  }, [users])

  // Get online users
  const getOnlineUsers = useCallback(() => {
    return users.filter((user) => user.isOnline)
  }, [users])

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Simulate status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prev) =>
        prev.map((user) => {
          // Randomly change status for demo
          if (Math.random() > 0.95) {
            const statuses: Array<"online" | "away" | "offline"> = ["online", "away", "offline"]
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
            return {
              ...user,
              status: randomStatus,
              isOnline: randomStatus !== "offline",
              lastSeen: new Date(),
            }
          }
          return user
        })
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <UsersContext.Provider
      value={{
        users,
        currentUser,
        isLoading,
        error,
        setCurrentUser,
        updateUserStatus,
        fetchUsers,
        getUserById,
        getOnlineUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers() {
  const context = useContext(UsersContext)
  if (!context) {
    throw new Error("useUsers must be used within UsersProvider")
  }
  return context
}
