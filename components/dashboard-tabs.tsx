"use client"

import React from "react"

type TabItem = {
  id: string
  label: string
  badge?: number
  icon?: React.ReactNode
}

interface DashboardTabsProps {
  tabs?: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function DashboardTabs({
  tabs = [
    { id: "Uploaded Files", label: "Uploaded Files" },
    { id: "ZIP Upload", label: "ZIP Upload" },
    { id: "Spreadsheet Connections", label: "Spreadsheet Connections" },
  ],
  activeTab,
  onTabChange,
}: DashboardTabsProps) {
  return (
    <div className="bg-background border-b border-border sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-6 py-2">
        <nav className="flex items-center gap-2" aria-label="Primary Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors transform-gpu duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/50 ${
                activeTab === tab.id
                  ? "bg-primary/5 text-foreground border border-border"
                  : "text-muted-foreground hover:bg-muted/5"
              }`}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              {tab.icon && <span className="w-4 h-4 text-muted-foreground">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.badge === "number" && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs bg-accent text-accent-foreground">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}