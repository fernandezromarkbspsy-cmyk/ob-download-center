"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DownloadSectionProps {
  recordCount: number
  filteredCount: number
  onDownload: () => void
}

export default function DownloadSection({ recordCount, filteredCount, onDownload }: DownloadSectionProps) {
  return (
    <div className="bg-background border-b border-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          onClick={onDownload}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
          size="sm"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-chart-1 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>

        <span className="text-chart-1">✓</span>
        <span className="text-sm text-muted-foreground">Last Update: 2025-10-20 12:35:25</span>
      </div>

      <button className="text-muted-foreground hover:text-foreground text-sm font-medium">Close Bar</button>
    </div>
  )
}
