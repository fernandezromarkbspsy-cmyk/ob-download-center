"use client"

import { useState, useRef } from "react"
import { useCurrentUser } from "@/lib/use-current-user"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import JSZip from "jszip"
import Papa from "papaparse"

interface FileUploadSectionProps {
  onFilesUploaded: (data: any[], headers: string[]) => void
  currentFilteredData?: any[]
}

export default function FileUploadSection({ onFilesUploaded, currentFilteredData }: FileUploadSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalFilteredRows, setTotalFilteredRows] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const cleanCSVContent = (content: string): string => {
    // Remove any null bytes or invalid characters
    const cleaned = content.replace(/\0/g, "")

    // Fix common CSV issues: unterminated quotes at end of lines
    const lines = cleaned.split("\n")
    const fixedLines = lines.map((line) => {
      // Count quotes in the line
      const quoteCount = (line.match(/"/g) || []).length
      // If odd number of quotes, add closing quote
      if (quoteCount % 2 === 1) {
        return line + '"'
      }
      return line
    })

    return fixedLines.join("\n")
  }

  const processZipFile = async (file: File) => {
    try {
      setIsLoading(true)
      setError(null)
      setTotalFilteredRows(0) // Reset counter for new files

      const zip = new JSZip()
      const zipContent = await zip.loadAsync(file)

      // Save processed files to localStorage with new naming convention
      const now = new Date()
      const dateStr = now.toLocaleString('en-US', { 
        month: 'short', 
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      })
      
      const savedFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "[]")
      const processedFiles = []
      const csvFiles: { name: string; content: string }[] = []

      // Process all CSV files from the zip
      for (const [filename, fileData] of Object.entries(zipContent.files)) {
        if (filename.endsWith(".csv") && !filename.startsWith("__MACOSX")) {
          const newName = `${dateStr} | ${user?.fullName || 'Unknown User'} | ${filename}`
          const content = await fileData.async("string")
          
          processedFiles.push({
            name: newName,
            originalName: filename,
            date: now.toISOString(),
            size: content.length, // Use string length as size approximation
            uploadedBy: user?.fullName || 'Unknown User',
            employeeId: user?.employeeId
          })

          csvFiles.push({ 
            name: newName, 
            content: cleanCSVContent(content) 
          })
        }
      }

      // Save all processed files
      localStorage.setItem("uploadedFiles", JSON.stringify([...savedFiles, ...processedFiles]))
      for (const [filename, fileData] of Object.entries(zipContent.files)) {
        if (filename.endsWith(".csv") && !filename.startsWith("__MACOSX")) {
          let content = await fileData.async("string")
          content = cleanCSVContent(content)
          csvFiles.push({ name: filename, content })
        }
      }

      if (csvFiles.length === 0) {
        setError("No CSV files found in the ZIP archive")
        return
      }

      // Parse all CSV files
      const allRows: any[] = []
      let headers: string[] = []

      for (let i = 0; i < csvFiles.length; i++) {
        const csvFile = csvFiles[i]

        // papaparse types include stream overloads; call via any to avoid overload resolution issues
        const parsed: any = (Papa as any).parse(csvFile.content as string, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
          transformHeader: (h: string) => h.trim(),
          error: (error: any) => {
            console.log("[v0] CSV parse warning:", error?.message || error)
          },
        })

        if (i === 0) {
          headers = parsed?.meta?.fields || []
        }

        // Filter out empty rows and rows with all null/empty values
        const initialRows = (parsed?.data as any[] || []).filter(
          (row) => row && Object.values(row).some((val) => val !== null && val !== "")
        )
        
        console.log(`[Filter] Initial rows in ${csvFile.name}:`, initialRows.length)
        
        // Apply specific filters for Receive Status and Remark columns
        let validRows = initialRows
        validRows = validRows.filter(row => {
          const receiveStatus = row['Receive Status']
          const remark = String(row['Remark'] || '')
          
          // Always keep "Pending Receive" status
          if (receiveStatus === 'Pending Receive') {
            return true
          }
          
          // For "Abnormal" status, check remark conditions
          if (receiveStatus === 'Abnormal') {
            const hasPackedInAnotherTO = remark.includes('Packed in another TO')
            const hasReceivedIn = remark.includes('Received in')
            // Must have BOTH conditions for Abnormal status
            return hasPackedInAnotherTO && hasReceivedIn
          }
          
          // Filter out all other cases
          return false
        })
        
        console.log(`[Filter] Filtered rows in ${csvFile.name}:`, validRows.length)
        // Update total filtered rows count
        setTotalFilteredRows(prev => prev + validRows.length)

        // Log filtering results
        console.log(`[Filter] Results for ${csvFile.name}:`)
        console.log(`- Initial rows: ${initialRows.length}`)
        console.log(`- Rows kept: ${validRows.length}`)
        console.log(`- Rows excluded: ${initialRows.length - validRows.length}`)
        console.log(`- Status breakdown:`, {
          pendingReceive: validRows.filter(row => row['Receive Status'] === 'Pending Receive').length,
          abnormal: validRows.filter(row => row['Receive Status'] === 'Abnormal').length
        })
        
        allRows.push(...validRows)
      }

      if (allRows.length === 0) {
        setError("No valid data rows found in CSV files")
        return
      }

      updateCounts(allRows, csvFiles.length)
      handleFilesUploaded(allRows, headers)
    } catch (err) {
      console.log("[v0] Error processing ZIP:", err)
      setError(err instanceof Error ? err.message : "Failed to process ZIP file")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".zip")) {
      setError("Please upload a ZIP file")
      return
    }

    await processZipFile(file)
  }

  const [totalRows, setTotalRows] = useState<number>(0)
  const [processedFiles, setProcessedFiles] = useState<number>(0)
  const { user } = useCurrentUser()

  const updateCounts = (data: any[], fileCount: number) => {
    setTotalRows(data.length)
    setProcessedFiles(fileCount)
  }

  // Integrate with the existing filtering system
  const handleFilesUploaded = (data: any[], headers: string[]) => {
    onFilesUploaded(data, headers)
  }

  return (
    <div className="flex items-center justify-center min-h-[30vh]">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="text-sm font-medium">Upload CSV Files</span>
            {totalFilteredRows > 0 && (
              <span className="ml-2 text-sm text-muted-foreground">
                ({totalFilteredRows.toLocaleString()} rows filtered)
              </span>
            )}
          </div>

          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-border bg-muted/5 rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-accent/5 transition-all duration-300 group"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-muted/10 group-hover:bg-primary/10 transition-colors duration-300">
                <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Click to upload or drag & drop</p>
                <p className="text-xs text-muted-foreground mt-1">ZIP files only</p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
            aria-label="ZIP file input"
            title="ZIP file input"
          />

          <div className="flex justify-between items-center px-2 pt-2 border-t border-border">
            <div className="space-y-1.5 animate-in fade-in slide-in-from-left-5 duration-500">
              <div className="text-sm font-medium">Statistics</div>
              <div className="text-sm text-muted-foreground flex items-center gap-4">
                <span>Total Rows: <span className="font-medium text-foreground">
                  {(currentFilteredData ? currentFilteredData.length : totalRows).toLocaleString()}
                  {currentFilteredData && currentFilteredData.length !== totalRows && 
                    ` (${totalRows.toLocaleString()})`}
                </span></span>
                <span>Files Processed: <span className="font-medium text-foreground">{processedFiles}</span></span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/5 text-destructive text-sm rounded-lg px-3 py-2 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300">
              <div className="w-1 h-1 rounded-full bg-destructive animate-pulse"></div>
              {error}
            </div>
          )}

          {isLoading && (
            <div className="bg-primary/5 text-primary text-sm rounded-lg px-3 py-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Processing files...</span>
            </div>
          )}

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-medium"
            variant="ghost"
          >
            {isLoading ? "Processing..." : "Select ZIP File"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
