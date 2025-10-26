"use client"

import { useCurrentUser } from "@/lib/use-current-user"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import DashboardHeader from "@/components/dashboard-header"
import DashboardTabs from "@/components/dashboard-tabs"
import ConnectionGuide from "@/components/connection-guide"

export default function ConnectionsPage() {
  const { user, isLoading } = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Direct Database Connections" recordCount={0} />
      <DashboardTabs activeTab="Connections" onTabChange={() => {}} />

      <div className="bg-background border-b border-border px-6 py-6">
        <p className="text-sm text-muted-foreground mb-2">Description:</p>
        <h2 className="text-2xl font-bold text-foreground">Connect Your Spreadsheets</h2>
        <p className="text-muted-foreground mt-2">
          Access your data directly from Google Sheets, Excel, or any application via our API. No more large file
          exports or lag.
        </p>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <ConnectionGuide />
      </main>
    </div>
  )
}
