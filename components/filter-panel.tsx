"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface FilterPanelProps {
  data: any[]
  headers: string[]
  selectedColumns: string[]
  onFilterChange: (filtered: any[]) => void
  onColumnChange: (columns: string[]) => void
}

export default function FilterPanel({
  data,
  headers,
  selectedColumns,
  onFilterChange,
  onColumnChange,
}: FilterPanelProps) {
  const [filters, setFilters] = useState<Record<string, Set<string>>>({})
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["Current Station", "Receiver Type"]),
  )

  // Get unique values for each column
  const uniqueValues = useMemo(() => {
    const values: Record<string, string[]> = {}
    headers.forEach((header) => {
      const unique = new Set<string>()
      data.forEach((row) => {
        const val = row[header]
        if (val) unique.add(String(val))
      })
      values[header] = Array.from(unique).sort()
    })
    return values
  }, [data, headers])

  const handleFilterToggle = (column: string, value: string) => {
    const newFilters = { ...filters }
    if (!newFilters[column]) {
      newFilters[column] = new Set()
    }

    if (newFilters[column].has(value)) {
      newFilters[column].delete(value)
    } else {
      newFilters[column].add(value)
    }

    setFilters(newFilters)

    // Apply filters
    const filtered = data.filter((row) => {
      return Object.entries(newFilters).every(([col, values]) => {
        if (values.size === 0) return true
        return values.has(String(row[col]))
      })
    })

    onFilterChange(filtered)
  }

  const toggleFilterExpand = (column: string) => {
    const newExpanded = new Set(expandedFilters)
    if (newExpanded.has(column)) {
      newExpanded.delete(column)
    } else {
      newExpanded.add(column)
    }
    setExpandedFilters(newExpanded)
  }

  const resetFilters = () => {
    setFilters({})
    onFilterChange(data)
  }

  const filterColumns = ["Current Station", "Receiver Type", "Journey Type", "Receive Status"].filter((col) =>
    headers.includes(col),
  )

  return (
    <Card className="bg-slate-800 border-slate-700 p-4 h-fit sticky top-24">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">Filters</h3>
          {Object.keys(filters).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-white h-6"
            >
              Reset
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {filterColumns.map((column) => (
            <div key={column} className="border border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFilterExpand(column)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-700/50 transition-colors"
              >
                <span className="text-sm font-medium text-slate-200">{column}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    expandedFilters.has(column) ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedFilters.has(column) && (
                <div className="bg-slate-700/30 border-t border-slate-700 p-3 max-h-48 overflow-y-auto space-y-2">
                  {uniqueValues[column]?.slice(0, 10).map((value) => (
                    <label key={value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters[column]?.has(value) || false}
                        onChange={() => handleFilterToggle(column, value)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 cursor-pointer"
                      />
                      <span className="text-xs text-slate-300 group-hover:text-white truncate">{value}</span>
                    </label>
                  ))}
                  {(uniqueValues[column]?.length || 0) > 10 && (
                    <p className="text-xs text-slate-500 pt-2">+{(uniqueValues[column]?.length || 0) - 10} more</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
