import { useState, useEffect, useCallback } from "react"

export interface ConsolidatedFile {
  id: string
  file_name: string
  file_size: number
  uploaded_by: string
  employee_id: string
  original_file_name: string
  row_count: number
  created_at: string
  is_public: boolean
}

export function useConsolidatedFiles() {
  const [files, setFiles] = useState<ConsolidatedFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFiles = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/consolidated-files")
      
      if (!response.ok) {
        throw new Error("Failed to fetch consolidated files")
      }
      
      const { data } = await response.json()
      setFiles(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setFiles([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addFile = useCallback(
    async (fileData: Omit<ConsolidatedFile, "id" | "created_at" | "is_public">) => {
      try {
        const response = await fetch("/api/consolidated-files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fileData),
        })

        if (!response.ok) {
          throw new Error("Failed to save consolidated file")
        }

        const { data } = await response.json()
        setFiles((prev) => [data, ...prev])
        return data
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred"
        setError(errorMsg)
        throw err
      }
    },
    []
  )

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  return {
    files,
    isLoading,
    error,
    fetchFiles,
    addFile,
  }
}
