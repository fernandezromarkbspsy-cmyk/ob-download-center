"use client"

import { createContext, useContext, useState, useEffect } from 'react'

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  read: boolean
}

interface Conversation {
  id: string
  participantId: string
  messages: Message[]
  unreadCount: number
  lastMessage?: Message
}

interface ChatContextType {
  conversations: Conversation[]
  activeConversation: Conversation | null
  isLoading: boolean
  error: Error | null
  setActiveConversation: (conversation: Conversation) => void
  sendMessage: (content: string) => void
  createOrSelectConversation: (userId: string) => void
  markAsRead: (conversationId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Mock data loading - replace with actual API calls
  useEffect(() => {
    const loadConversations = async () => {
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setConversations([
          {
            id: '1',
            participantId: 'user1',
            messages: [],
            unreadCount: 0
          }
        ])
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load conversations'))
        setIsLoading(false)
      }
    }
    loadConversations()
  }, [])

  const sendMessage = (content: string) => {
    if (!activeConversation) return

    const newMessage: Message = {
      id: Math.random().toString(),
      senderId: 'currentUser', // Replace with actual user ID
      content,
      timestamp: new Date(),
      read: false
    }

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: newMessage
        }
      }
      return conv
    }))
  }

  const createOrSelectConversation = (userId: string) => {
    const existing = conversations.find(c => c.participantId === userId)
    if (existing) {
      setActiveConversation(existing)
      return
    }

    const newConversation: Conversation = {
      id: Math.random().toString(),
      participantId: userId,
      messages: [],
      unreadCount: 0
    }

    setConversations(prev => [...prev, newConversation])
    setActiveConversation(newConversation)
  }

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, read: true }))
        }
      }
      return conv
    }))
  }

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      isLoading,
      error,
      setActiveConversation,
      sendMessage,
      createOrSelectConversation,
      markAsRead
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}