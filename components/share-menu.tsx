"use client"

import { useState } from "react"
import { Share2, Copy, Mail, MessageSquare, Link as LinkIcon, Download, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface ShareMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShareMenu({ isOpen, onClose }: ShareMenuProps) {
  const [shareUrl, setShareUrl] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl || window.location.href)
    toast({
      title: "Copied!",
      description: "URL copied to clipboard",
    })
  }

  const handleEmailShare = () => {
    const subject = "Check out this SOC Outbound data"
    const body = `${customMessage}\n\n${shareUrl || window.location.href}`
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    toast({
      title: "Email opened",
      description: "Email client opened with share details",
    })
  }

  const handleDownloadQR = () => {
    // Simple QR code generation (in production, use a proper QR library)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl || window.location.href)}`
    window.open(qrUrl, '_blank')
    toast({
      title: "QR Code generated",
      description: "QR code opened in new tab",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background border-2 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Share Data
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Sharing */}
          <div className="space-y-3">
            <Label htmlFor="share-url">Share URL</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={shareUrl}
                onChange={(e) => setShareUrl(e.target.value)}
                placeholder={window.location.href}
                className="flex-1"
              />
              <Button onClick={handleCopyUrl} size="sm" className="px-3">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Email Sharing */}
          <div className="space-y-3">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recipient@example.com"
            />
            <Label htmlFor="message">Custom Message</Label>
            <Textarea
              id="message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a custom message..."
              rows={3}
            />
            <Button onClick={handleEmailShare} className="w-full" disabled={!email}>
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Label>Quick Actions</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleDownloadQR}>
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </Button>
              <Button variant="outline" onClick={() => window.open(shareUrl || window.location.href, '_blank')}>
                <LinkIcon className="w-4 h-4 mr-2" />
                Open Link
              </Button>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="space-y-3">
            <Label>Social Media</Label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(customMessage || 'Check out this data')}&url=${encodeURIComponent(shareUrl || window.location.href)}`)}
              >
                Twitter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl || window.location.href)}`)}
              >
                LinkedIn
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
