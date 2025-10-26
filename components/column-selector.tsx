"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, Eye, EyeOff } from "lucide-react"

interface ColumnSelectorProps {
  allColumns: string[]
  selectedColumns: string[]
  onColumnChange: (columns: string[]) => void
}

export default function ColumnSelector({ allColumns, selectedColumns, onColumnChange }: ColumnSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggleColumn = (column: string) => {
    if (selectedColumns.includes(column)) {
      onColumnChange(selectedColumns.filter((c) => c !== column))
    } else {
      onColumnChange([...selectedColumns, column])
    }
  }

  const handleSelectAll = () => {
    onColumnChange(allColumns)
  }

  const handleDeselectAll = () => {
    onColumnChange([])
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="border-slate-600 text-slate-300 hover:bg-slate-700 w-full justify-between"
      >
        <span>Columns ({selectedColumns.length})</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <Card className="absolute top-full mt-2 w-64 bg-slate-800 border-slate-700 p-3 z-50 shadow-lg">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSelectAll}
                className="text-xs h-7 flex-1 text-slate-300 hover:bg-slate-700"
              >
                Select All
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDeselectAll}
                className="text-xs h-7 flex-1 text-slate-300 hover:bg-slate-700"
              >
                Clear
              </Button>
            </div>

            <div className="border-t border-slate-700 pt-2 max-h-64 overflow-y-auto space-y-1">
              {allColumns.map((column) => {
                const isSelected = selectedColumns.includes(column)
                return (
                  <button
                    key={column}
                    onClick={() => handleToggleColumn(column)}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-700/50 transition-colors text-left"
                  >
                    {isSelected ? (
                      <Eye className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${isSelected ? "text-white font-medium" : "text-slate-400"}`}>
                      {column}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
