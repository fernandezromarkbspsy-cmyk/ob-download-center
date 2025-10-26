"use client"

import * as React from "react"
import { useRef, useState } from "react"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useCurrentUser } from "@/lib/use-current-user"

const AUTHORIZED_USERS = ["m", "Ops93521", "Ops76014", "Ops93568"]

interface ShareRequestDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function ShareRequestDialog({ open: openProp, onOpenChange }: ShareRequestDialogProps) {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [internalOpen, setInternalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useCurrentUser()
  const open = openProp ?? internalOpen
  const setOpen = (v: boolean) => {
    if (onOpenChange) onOpenChange(v)
    else setInternalOpen(v)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const opsId = formData.get("opsId") as string
    const fullName = formData.get("fullName") as string

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Here you would typically make an API call to submit the request
    console.log("Share request submitted:", { opsId, fullName })

    toast({
      title: "Request Submitted",
      description: "Your share request has been submitted successfully.",
    })

    setIsSubmitting(false)
    setOpen(false)
    formRef.current?.reset()
  }

  const isAuthorized = user && AUTHORIZED_USERS.includes(user.employeeId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-primary/5 hover:bg-primary/10 text-primary border-primary/20"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Request</DialogTitle>
          <DialogDescription>
            {isAuthorized 
              ? "You are authorized to approve share requests."
              : "Submit a request to share this content."}
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="opsId" className="text-sm font-medium text-muted-foreground">
                Enter Ops ID
              </label>
              <Input
                id="opsId"
                name="opsId"
                placeholder="Ops1234"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                required
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-pulse">Submitting...</span>
                  <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}