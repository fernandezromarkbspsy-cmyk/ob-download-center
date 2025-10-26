"use client"

import { createContext, useContext, useState, useCallback } from "react"

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: any[]
  setSearchResults: (results: any[]) => void
  isSearching: boolean
  setIsSearching: (searching: boolean) => void
  performSearch: (query: string, data: any[]) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const performSearch = useCallback((query: string, data: any[]) => {
    if (!query.trim()) {
      setSearchResults(data)
      return
    }

    setIsSearching(true)
    
    // Search through all data values
    const results = data.filter((item) => {
      return Object.values(item).some((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query.toLowerCase())
        }
        if (typeof value === 'number') {
          return value.toString().includes(query)
        }
        return false
      })
    })

    setSearchResults(results)
    setIsSearching(false)
  }, [])

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        isSearching,
        setIsSearching,
        performSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
