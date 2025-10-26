"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Search } from "lucide-react"
import { useState } from "react"

interface DataPreviewProps {
  data: any[]
  headers: string[]
}

type SortDirection = "asc" | "desc" | null

export default function DataPreview({ data, headers }: DataPreviewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const maxRows = 50

  const processedData = useMemo(() => {
    let result = [...data]

    // Apply search filter
    if (searchTerm) {
      result = result.filter((row) =>
        headers.some((header) =>
          String(row[header] || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        ),
      )
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]

        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1

        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()

        if (sortDirection === "asc") {
          return aStr.localeCompare(bStr)
        } else {
          return bStr.localeCompare(aStr)
        }
      })
    }

    return result.slice(0, maxRows)
  }, [data, headers, searchTerm, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortDirection(null)
        setSortColumn(null)
      }
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const displayHeaders = useMemo(() => {
    return headers.length > 0 ? headers : []
  }, [headers])

  if (data.length === 0) {
    return (
      <Card className="bg-card border-border p-8 text-center">
        <p className="text-muted-foreground">No data to display</p>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border overflow-hidden flex flex-col">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search all columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 sticky top-0">
              {displayHeaders.map((header) => (
                <th
                  key={header}
                  onClick={() => handleSort(header)}
                  className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap cursor-pointer hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{header}</span>
                    {sortColumn === header && (
                      <div className="flex flex-col gap-0.5">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="w-3 h-3 text-primary" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-primary" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedData.map((row, idx) => (
              <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                {displayHeaders.map((header) => (
                  <td
                    key={`${idx}-${header}`}
                    className="px-4 py-3 text-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-xs"
                    title={row[header] || ""}
                  >
                    {row[header] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 bg-muted/30 border-t border-border">
        <div className="text-xs text-muted-foreground">
          Showing {processedData.length} of {data.length} records
          {searchTerm && ` (filtered from ${data.length})`}
          {data.length > maxRows && ` - Preview limited to first ${maxRows} rows`}
        </div>
      </div>
    </Card>
  )
}
