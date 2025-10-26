"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import ShareMenu from "./share-menu"
import { 
  LayoutDashboard, 
  FileUp, 
  Download, 
  Link as LinkIcon, 
  HelpCircle, 
  Settings, 
  LogOut,
  User,
  Search,
  Share2
} from "lucide-react"
import { useCurrentUser } from "@/lib/use-current-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SidebarProps {
  activeItem?: string
}

export default function Sidebar({ activeItem = "Dashboard" }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useCurrentUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [currentActivePage, setCurrentActivePage] = useState(activeItem)
  const [isMobile, setIsMobile] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Update active page when URL changes
  useState(() => {
    if (typeof window !== 'undefined') {
      const updateActivePage = () => {
        const params = new URLSearchParams(window.location.search)
        const page = params.get('page') || 'Dashboard'
        setCurrentActivePage(page)
      }
      
      updateActivePage()
      window.addEventListener('popstate', updateActivePage)
      
      return () => window.removeEventListener('popstate', updateActivePage)
    }
  })

  // Helper function to check if a menu item is active
  const isMenuItemActive = (itemId: string) => {
    return currentActivePage === itemId
  }

  const handleMenuClick = (href: string, itemId: string) => {
    setCurrentActivePage(itemId)
    router.push(href)
  }

  const menuItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/?page=Dashboard" },
    { id: "Uploaded Files", label: "Uploaded Files", icon: FileUp, href: "/?page=Uploaded Files" },
    { id: "ZIP Upload", label: "ZIP Upload", icon: Download, href: "/?page=ZIP Upload" },
    { id: "Spreadsheet Connections", label: "Spreadsheet Connections", icon: LinkIcon, href: "/?page=Spreadsheet Connections" },
  ]

  const supportItems = [
    { id: "Share", label: "Share Data", icon: Share2, action: () => setIsShareOpen(true) },
    { id: "Support", label: "Help & Support", icon: HelpCircle, href: "/support" },
  ]

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div 
      className={`h-screen bg-sidebar text-sidebar-foreground flex flex-col fixed left-0 top-0 z-30 overflow-visible transition-all duration-300 ${
        isMobile 
          ? (isExpanded ? 'w-64' : 'w-16') 
          : 'w-64'
      }`}
      onMouseEnter={() => isMobile && setIsExpanded(true)}
      onMouseLeave={() => isMobile && setIsExpanded(false)}
    >
      {/* User Profile Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className={`flex flex-col items-center space-y-3 transition-opacity duration-300 ${
          isMobile && !isExpanded ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="w-16 h-16 bg-sidebar-accent rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-sidebar-foreground" />
          </div>
          {(!isMobile || isExpanded) && (
            <div className="text-center">
              <div className="font-medium text-sidebar-foreground text-sm">
                {user?.fullName || "Nirmal Kumar P"}
              </div>
              <div className="text-xs text-sidebar-foreground/70 font-mono">
                {user?.employeeId || "Ops1234"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {(!isMobile || isExpanded) && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sidebar-foreground/50" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50"
            />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 py-2 pr-0 pl-4" aria-label="Main navigation">
        <motion.ul 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          role="list"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = isMenuItemActive(item.id)
            
            return (
              <motion.li 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative"
              >
                <motion.button
                  onClick={() => handleMenuClick(item.href, item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left relative z-10 transition-colors duration-300 ${
                    isActive
                      ? "bg-white text-gray-900 font-medium rounded-l-full shadow-lg"
                      : "text-white rounded-lg mr-4 hover:bg-white/10"
                  }`}
                  style={isActive ? { 
                    marginRight: '-1.5rem',
                    paddingRight: '2rem'
                  } : {}}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                    isActive ? "text-gray-900" : "text-white"
                  }`} />
                  {(!isMobile || isExpanded) && (
                    <span className="transition-colors duration-300 truncate">{item.label}</span>
                  )}
                </motion.button>
                
                {/* Curved cut-out effect above */}
                {isActive && (
                  <>
                    <div 
                      className="absolute -top-2 right-0 w-8 h-8 bg-sidebar pointer-events-none"
                      style={{
                        borderBottomRightRadius: '16px',
                        boxShadow: '8px 8px 0 0 white'
                      }}
                    />
                    {/* Curved cut-out effect below */}
                    <div 
                      className="absolute -bottom-2 right-0 w-8 h-8 bg-sidebar pointer-events-none"
                      style={{
                        borderTopRightRadius: '16px',
                        boxShadow: '8px -8px 0 0 white'
                      }}
                    />
                  </>
                )}
              </motion.li>
            )
          })}
        </motion.ul>

        {/* Support Section */}
        <motion.div 
          className="mt-6 pt-4 border-t border-sidebar-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3 px-4">
            Support
          </h3>
          <ul className="space-y-2 mr-4" role="list">
            {supportItems.map((item) => {
              const Icon = item.icon
              
              return (
                <li key={item.id}>
                  <motion.button
                    onClick={() => item.action ? item.action() : router.push(item.href!)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-white hover:bg-white/10 transition-colors duration-300"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5 text-white flex-shrink-0" />
                    {(!isMobile || isExpanded) && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </motion.button>
                </li>
              )
            })}
          </ul>
        </motion.div>
      </nav>

      {/* Logout Section */}
      <motion.div 
        className="p-4 border-t border-sidebar-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-white hover:bg-white/10 transition-colors duration-300 mr-4"
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5 text-white flex-shrink-0" />
          {(!isMobile || isExpanded) && (
            <span className="truncate">Logout</span>
          )}
        </motion.button>
      </motion.div>

      {/* Share Menu Modal */}
      <ShareMenu isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  )
}
