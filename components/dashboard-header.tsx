"use client"

import { Bell, FileText, BarChart3, MessageSquare, Grid3x3, Menu as MenuIcon, User, LogOut, List, Download, Link as LinkIcon, FileUp } from "lucide-react"
import ShareRequestDialog from "@/components/share-request-dialog"
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { useState, useRef } from 'react'
import { useCurrentUser } from "@/lib/use-current-user"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface DashboardHeaderProps {
  title: string
  recordCount: number
}

export default function DashboardHeader({ title, recordCount }: DashboardHeaderProps) {
  const { user, isLoading, logout } = useCurrentUser()
  const router = useRouter()
  const { toast } = useToast()
  const [shareOpen, setShareOpen] = useState(false)
  const [notAuthOpen, setNotAuthOpen] = useState(false)
  const firstMenuItemRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleDatabaseConnectionsClick = () => {
    router.push("/database-connections")
  }

  const handleTitleClick = () => {
    // navigate to home and open ZIP Upload tab via query param
    router.push(`/?tab=${encodeURIComponent('ZIP Upload')}`)
  }

  return (
    <>
      {/* Main Header */}
      <header className="bg-primary border-b border-border sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button onClick={handleTitleClick} title="Go to ZIP Upload" className="text-primary-foreground font-semibold tracking-widest text-xl hover:underline">
                SOC Outbound
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-1" title="Notifications">
                  <Bell className="w-5 h-5 text-primary-foreground/80 cursor-pointer hover:text-primary-foreground" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="text-sm font-medium mb-2">Notifications</div>
                <div className="text-xs text-muted-foreground">No new notifications</div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="p-1" title="Announcements">
                  <FileText className="w-5 h-5 text-primary-foreground/80 cursor-pointer hover:text-primary-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="text-sm font-medium mb-2">Announcements</div>
                <div className="text-xs text-muted-foreground">No announcements</div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="p-1" title="Stats">
                  <BarChart3 className="w-5 h-5 text-primary-foreground/80 cursor-pointer hover:text-primary-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="text-sm font-medium mb-2">Stats</div>
                <div className="text-xs text-muted-foreground">Records: {recordCount}</div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="p-1" title="Messages">
                  <MessageSquare className="w-5 h-5 text-primary-foreground/80 cursor-pointer hover:text-primary-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="text-sm font-medium mb-2">Messages</div>
                <div className="text-xs text-muted-foreground">No messages</div>
              </PopoverContent>
            </Popover>

            <Grid3x3 className="w-5 h-5 text-primary-foreground/80 cursor-pointer hover:text-primary-foreground" />
            <MenuIcon className="w-5 h-5 text-primary-foreground/80 cursor-pointer hover:text-primary-foreground" />

            <Popover>
              <PopoverTrigger asChild>
                <button className="p-1" title="Profile">
                  <User className="w-5 h-5 text-primary-foreground/80 cursor-pointer hover:text-primary-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="text-sm font-medium mb-2">Profile</div>
                {user ? (
                  <div className="text-xs text-muted-foreground">
                    <div>{user.fullName}</div>
                    <div className="mt-2">
                      <button onClick={handleLogout} className="px-3 py-1 rounded bg-destructive text-destructive-foreground text-xs">Sign out</button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">Not signed in</div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* Secondary Header */}
      <div className="bg-background border-b border-border sticky top-16 z-40">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-2 rounded hover:bg-muted/20" title="Menu">
                  <MenuIcon className="w-5 h-5 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-1">
                <div role="menu" className="flex flex-col">
                  <button
                    ref={firstMenuItemRef}
                    role="menuitem"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push('/backlogs') } }}
                    onClick={() => router.push('/backlogs')}
                    className="text-left px-3 py-2 hover:bg-muted/10 flex items-center gap-2 transition-colors rounded-md"
                  >
                    <List className="w-4 h-4 text-muted-foreground" />
                    <span>Backlogs Summary</span>
                  </button>

                  <button
                    role="menuitem"
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/?tab=${encodeURIComponent('ZIP Upload')}`) } }}
                    onClick={() => router.push(`/?tab=${encodeURIComponent('ZIP Upload')}`)}
                    className="text-left px-3 py-2 hover:bg-muted/10 flex items-center gap-2 transition-colors rounded-md"
                  >
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <span>Download Board</span>
                  </button>

                  <button
                    role="menuitem"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        const authorized = user && ["m", "Ops93521", "Ops76014", "Ops93568"].includes(user.employeeId)
                        if (authorized) router.push('/database-connections')
                        else setNotAuthOpen(true)
                      }
                    }}
                    onClick={() => {
                      const authorized = user && ["m", "Ops93521", "Ops76014", "Ops93568"].includes(user.employeeId)
                      if (authorized) router.push('/database-connections')
                      else setNotAuthOpen(true)
                    }}
                    className="text-left px-3 py-2 hover:bg-muted/10 flex items-center gap-2 transition-colors rounded-md"
                  >
                    <LinkIcon className="w-4 h-4 text-muted-foreground" />
                    <span>Database</span>
                  </button>

                  <button
                    role="menuitem"
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/?tab=${encodeURIComponent('Uploaded Files')}`) } }}
                    onClick={() => router.push(`/?tab=${encodeURIComponent('Uploaded Files')}`)}
                    className="text-left px-3 py-2 hover:bg-muted/10 flex items-center gap-2 transition-colors rounded-md"
                  >
                    <FileUp className="w-4 h-4 text-muted-foreground" />
                    <span>Uploaded Files</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold text-xl">{title}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-muted-foreground text-sm">
                {user.employeeId} | {user.fullName}
              </span>
            )}
            <button className="flex items-center gap-2 px-3 py-1.5 text-primary hover:bg-accent/10 rounded text-sm font-medium">
              <span>⚡</span> AI Explorer
            </button>

            <ShareRequestDialog open={shareOpen} onOpenChange={setShareOpen} />

            {/* Not authorized dialog */}
            <AlertDialog open={notAuthOpen} onOpenChange={setNotAuthOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Not authorized</AlertDialogTitle>
                  <div className="text-sm text-muted-foreground mt-1">You do not have access to the Database feature.</div>
                </AlertDialogHeader>
                <div className="mt-4 flex gap-2 justify-end">
                  <AlertDialogCancel onClick={() => setNotAuthOpen(false)}>Close</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setNotAuthOpen(false)
                      setShareOpen(true)
                    }}
                  >
                    Request Access
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded text-sm transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button className="p-1.5 text-muted-foreground hover:bg-muted rounded">⋮</button>
          </div>
        </div>
      </div>
    </>
  )
}
