import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import { Inter as V0_Font_Inter } from 'next/font/google'
import { NotificationProvider } from '@/lib/notification-context'
import { SearchProvider } from '@/lib/search-context'
//import { ChatProvider } from '@/lib/chat-context'
//import MessageNotificationBanner from '@/components/message-notification-banner'

// Initialize fonts
const inter = V0_Font_Inter({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SearchProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </SearchProvider>
        <Analytics />
      </body>
    </html>
  )
}
