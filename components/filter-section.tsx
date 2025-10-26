"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, X } from "lucide-react"

interface FilterSectionProps {
  data: any[]
  headers: string[]
  onFilterChange: (filtered: any[]) => void
}

export default function FilterSection({ data, headers, onFilterChange }: FilterSectionProps) {
  const [filters, setFilters] = useState<Record<string, string>>({
    "Receiver Type": "",
    "Current Station": "",
  })
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null)

  const filterColumns = useMemo(
    () => ["Receiver type", "Current Station"].filter((col) => headers.includes(col)),
    [headers],
  )

  const uniqueValues = useMemo(() => {
    const values: Record<string, string[]> = {}
    filterColumns.forEach((header) => {
      const unique = new Set<string>()
      data.forEach((row) => {
        const val = row[header]
        if (val) unique.add(String(val))
      })
      values[header] = Array.from(unique).sort()
    })
    return values
  }, [data, filterColumns])

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return filterColumns.every((col) => {
        if (!filters[col]) return true
        return String(row[col]) === filters[col]
      })
    })
  }, [data, filters, filterColumns])

  useEffect(() => {
    onFilterChange(filteredData)
  }, [filteredData, onFilterChange])

  const handleFilterChange = (column: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [column]: prev[column] === value ? "" : value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      "Receiver Type": "",
      "Journey Type": "",
      "Receive Status": "",
    })
  }

  const activeFilterCount = Object.values(filters).filter((v) => v).length

  return (
    <div className="bg-background border-b border-border p-6 space-y-4">
      {/* Filter Row */}
      <div className="grid grid-cols-3 gap-6">
        {filterColumns.map((column) => (
          <div key={column} className="relative">
            <label className="block text-sm font-medium text-foreground mb-2">{column}</label>
            <button
              onClick={() => setExpandedFilter(expandedFilter === column ? null : column)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm flex items-center justify-between hover:border-border/80"
            >
              <span className={filters[column] ? "text-foreground font-medium" : "text-muted-foreground"}>
                {filters[column] || "Select..."}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {expandedFilter === column && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                {uniqueValues[column]?.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleFilterChange(column, value)}
                    className={`w-full text-left px-3 py-2 text-sm border-b border-border last:border-b-0 hover:bg-accent/10 transition-colors ${
                      filters[column] === value ? "bg-accent text-accent-foreground font-medium" : "text-foreground"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {Object.entries(filters).map(
            ([column, value]) =>
              value && (
                <div
                  key={`${column}-${value}`}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                >
                  <span>
                    {column}: {value}
                  </span>
                  <button
                    onClick={() => handleFilterChange(column, value)}
                    className="hover:opacity-80"
                    aria-label={`Remove filter ${column}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ),
          )}
        </div>
      )}

      {/* Action Buttons */}
      {activeFilterCount > 0 && (
        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="border-border text-foreground hover:bg-muted bg-transparent"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  )
}
