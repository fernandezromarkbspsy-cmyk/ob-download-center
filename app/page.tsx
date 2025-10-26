"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { RefreshCw, Download, Calendar, BarChart3, Link as LinkIcon, FileUp, Upload } from "lucide-react"
import TransitionMount from "@/components/transition-mount"
import ConnectionsPanel from "@/components/connections-panel"
import UploadedFilesPanel from "@/components/uploaded-files-panel"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/lib/use-current-user"
import FileUploadSection from "@/components/file-upload-section"
import DataPreview from "@/components/data-preview"
import DashboardHeader from "@/components/dashboard-header"
import DashboardTabs from "@/components/dashboard-tabs"
import FilterSection from "@/components/filter-section"
import DownloadSection from "@/components/download-section"
import SpreadsheetConnections from "@/components/spreadsheet-connections"

export default function Home() {
  const [consolidatedData, setConsolidatedData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = (searchParams && searchParams.get('tab')) || "Uploaded Files"
  const [activeTab, setActiveTab] = useState(initialTab)

  const tabs = [
    { id: "Uploaded Files", label: "Uploaded Files" },
    { id: "ZIP Upload", label: "ZIP Upload" },
    { id: "Spreadsheet Connections", label: "Spreadsheet Connections" }
  ]

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId)
    const params = new URLSearchParams(searchParams?.toString())
    params.set('tab', tabId)
    router.push(`?${params.toString()}`)
  }, [searchParams, router])

  const { user, isLoading } = useCurrentUser()
  const redirectedRef = useRef(false)

  useEffect(() => {
    if (!isLoading && !user && !redirectedRef.current) {
      redirectedRef.current = true
      router.push("/login")
    }
  }, [isLoading, user, router])

  const handleFilesUploaded = (data: any[], fileHeaders: string[]) => {
    setConsolidatedData(data)
    setHeaders(fileHeaders)
    setFilteredData(data)
  }

  // Mapping: A=0, B=1, C=2, ... Z=25, AA=26, AB=27, AC=28, AD=29, AE=30, AF=31, AG=32, AH=33, AI=34
  const columnsToDropIndices = new Set([
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9, // C:I
    11, // L
    14,
    15,
    16,
    17,
    18,
    19,
    20, // O:U
    24,
    25,
    26,
    27, // Y:AB
    29,
    30,
    31,
    32,
    33, // AD:AH
  ])

  const handleDownload = () => {
    const columnsToKeep = headers.filter((_, idx) => !columnsToDropIndices.has(idx))

    const csv = [
      columnsToKeep.join(","),
      ...filteredData.map((row) =>
        columnsToKeep
          .map((col) => {
            const val = row[col] || ""
            // Escape quotes and wrap in quotes if contains comma or quote
            const escaped = String(val).replace(/\"/g, '\"\"')
            return escaped.includes(",") || escaped.includes('\"') ? `\"${escaped}\"` : escaped
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `data-export-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFilterChange = useCallback((filtered: any[]) => {
    setFilteredData(filtered)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="SOCPacked Download Board" recordCount={consolidatedData.length} />
      <DashboardTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {activeTab === "Uploaded Files" && (
            <TransitionMount visible={true}>
              <UploadedFilesPanel />
            </TransitionMount>
          )}
          
          {activeTab === "ZIP Upload" && (
            <TransitionMount visible={true}>
              <FileUploadSection 
                onFilesUploaded={handleFilesUploaded}
                currentFilteredData={filteredData}
              />
              {consolidatedData.length > 0 && (
                <>
                  <div className="mt-8">
                    <FilterSection data={consolidatedData} headers={headers} onFilterChange={handleFilterChange} />
                  </div>
                  <div className="mt-8">
                    <DownloadSection
                      recordCount={consolidatedData.length}
                      filteredCount={filteredData.length}
                      onDownload={handleDownload}
                    />
                  </div>
                  <div className="mt-8">
                    <DataPreview headers={headers} data={filteredData} />
                  </div>
                </>
              )}
            </TransitionMount>
          )}
          
          {activeTab === "Spreadsheet Connections" && (
            <TransitionMount visible={true}>
              <SpreadsheetConnections />
            </TransitionMount>
          )}
        </div>
      </main>
    </div>
  )
}