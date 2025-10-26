"use client"

import { useState, useEffect, useRef, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { RefreshCw, Download, Calendar, BarChart3, Link as LinkIcon, FileUp, Upload, Search, Bell, User } from "lucide-react"
import TransitionMount from "@/components/transition-mount"
import ConnectionsPanel from "@/components/connections-panel"
import UploadedFilesPanel from "@/components/uploaded-files-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/lib/use-current-user"
import { useSearch } from "@/lib/search-context"
import Sidebar from "@/components/sidebar"
import FileUploadSection from "@/components/file-upload-section"
import DataPreview from "@/components/data-preview"
import DashboardHeader from "@/components/dashboard-header"
import FilterSection from "@/components/filter-section"
import DownloadSection from "@/components/download-section"
import SpreadsheetConnections from "@/components/spreadsheet-connections"
import DashboardOverview from "@/components/dashboard-overview"
import DashboardCharts from "@/components/dashboard-charts"

function HomeContent() {
  const [consolidatedData, setConsolidatedData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = (searchParams && searchParams.get('page')) || "Dashboard"
  const { searchQuery, setSearchQuery, performSearch, searchResults, isSearching } = useSearch()

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
      {/* Sidebar */}
      <Sidebar activeItem={currentPage} />
      
      {/* Main Content */}
      <div className="ml-64 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Header */}
        <header className="bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 sticky top-0 z-20 premium-shadow animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">SOC Outbound</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search all data..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    performSearch(e.target.value, consolidatedData)
                  }}
                  className="pl-10 w-64 bg-muted border-border focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover-lift transition-all duration-200">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover-lift transition-all duration-200">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {currentPage === "Dashboard" && (
              <div className="space-y-8">
                <DashboardOverview />
                <DashboardCharts />
              </div>
            )}

            {currentPage === "Uploaded Files" && (
              <TransitionMount visible={true}>
                <UploadedFilesPanel />
              </TransitionMount>
            )}
            
            {currentPage === "ZIP Upload" && (
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
                      <DataPreview headers={headers} data={searchQuery ? searchResults : filteredData} />
                    </div>
                  </>
                )}
              </TransitionMount>
            )}
            
            {currentPage === "Spreadsheet Connections" && (
              <TransitionMount visible={true}>
                <SpreadsheetConnections />
              </TransitionMount>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}