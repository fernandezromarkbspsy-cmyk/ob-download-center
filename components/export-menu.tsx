"use client"

import { useState } from "react"
import { Download, FileJson, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ExportMenuProps {
  data: any[]
  allData: any[]
  headers: string[]
  selectedColumns: string[]
  filteredCount: number
}

export default function ExportMenu({ data, allData, headers, selectedColumns, filteredCount }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const columnsToExport = selectedColumns.length > 0 ? selectedColumns : headers

  const exportCSV = (useFiltered: boolean) => {
    const exportData = useFiltered ? data : allData
    const csvContent = [
      columnsToExport.join(","),
      ...exportData.map((row) =>
        columnsToExport
          .map((col) => {
            const value = row[col]
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value || ""
          })
          .join(","),
      ),
    ].join("\n")

    downloadFile(
      csvContent,
      `data-${useFiltered ? "filtered" : "all"}-${new Date().toISOString().split("T")[0]}.csv`,
      "text/csv",
    )
    setIsOpen(false)
  }

  const exportJSON = (useFiltered: boolean) => {
    const exportData = useFiltered ? data : allData
    const jsonData = exportData.map((row) => {
      const obj: Record<string, any> = {}
      columnsToExport.forEach((col) => {
        obj[col] = row[col]
      })
      return obj
    })

    const jsonContent = JSON.stringify(jsonData, null, 2)
    downloadFile(
      jsonContent,
      `data-${useFiltered ? "filtered" : "all"}-${new Date().toISOString().split("T")[0]}.json`,
      "application/json",
    )
    setIsOpen(false)
  }

  const exportStats = () => {
    const stats = {
      exportDate: new Date().toISOString(),
      totalRecords: allData.length,
      filteredRecords: data.length,
      selectedColumns: columnsToExport,
      columnCount: columnsToExport.length,
      summary: {} as Record<string, any>,
    }

    // Generate basic stats for each column
    columnsToExport.forEach((col) => {
      const values = data.map((row) => row[col]).filter((v) => v !== null && v !== undefined)
      stats.summary[col] = {
        uniqueValues: new Set(values).size,
        totalValues: values.length,
        sampleValues: values.slice(0, 5),
      }
    })

    const jsonContent = JSON.stringify(stats, null, 2)
    downloadFile(jsonContent, `data-stats-${new Date().toISOString().split("T")[0]}.json`, "application/json")
    setIsOpen(false)
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="relative">
      <Button onClick={() => setIsOpen(!isOpen)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>

      {isOpen && (
        <Card className="absolute top-full right-0 mt-2 w-72 bg-slate-800 border-slate-700 p-3 z-50 shadow-lg">
          <div className="space-y-2">
            <div className="px-2 py-1">
              <p className="text-xs font-semibold text-slate-300 mb-3">Export Options</p>
            </div>

            <div className="border-t border-slate-700 pt-2 space-y-2">
              <div className="space-y-1">
                <p className="text-xs text-slate-400 px-2 font-medium">CSV Format</p>
                <Button
                  onClick={() => exportCSV(true)}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-8 text-slate-300 hover:bg-slate-700"
                >
                  <FileSpreadsheet className="w-3 h-3 mr-2" />
                  Filtered Data ({filteredCount} rows)
                </Button>
                <Button
                  onClick={() => exportCSV(false)}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-8 text-slate-300 hover:bg-slate-700"
                >
                  <FileSpreadsheet className="w-3 h-3 mr-2" />
                  All Data ({allData.length} rows)
                </Button>
              </div>

              <div className="border-t border-slate-700 pt-2 space-y-1">
                <p className="text-xs text-slate-400 px-2 font-medium">JSON Format</p>
                <Button
                  onClick={() => exportJSON(true)}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-8 text-slate-300 hover:bg-slate-700"
                >
                  <FileJson className="w-3 h-3 mr-2" />
                  Filtered Data ({filteredCount} rows)
                </Button>
                <Button
                  onClick={() => exportJSON(false)}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-8 text-slate-300 hover:bg-slate-700"
                >
                  <FileJson className="w-3 h-3 mr-2" />
                  All Data ({allData.length} rows)
                </Button>
              </div>

              <div className="border-t border-slate-700 pt-2">
                <Button
                  onClick={exportStats}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-8 text-slate-300 hover:bg-slate-700"
                >
                  <FileJson className="w-3 h-3 mr-2" />
                  Export Statistics
                </Button>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-2 text-xs text-slate-500 px-2">
              <p>Columns: {columnsToExport.length}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
