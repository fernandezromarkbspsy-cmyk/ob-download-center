"use client"

import { useState, useEffect } from "react"
import { Trash2, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

interface UploadedFile {
  name: string
  originalName?: string
  date: string
  size: number
  uploadedBy?: string
  employeeId?: string
}

export default function UploadedFilesPanel() {
  const [files, setFiles] = useState<UploadedFile[]>([])

  useEffect(() => {
    const savedFiles = localStorage.getItem("uploadedFiles")
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles))
    }
  }, [])

  const deleteFile = (fileDate: string) => {
    // Use the timestamp (date) as a unique identifier when deleting to avoid removing duplicates
    const newFiles = files.filter((file) => file.date !== fileDate)
    setFiles(newFiles)
    localStorage.setItem("uploadedFiles", JSON.stringify(newFiles))
  }

  if (files.length === 0) {
    return (
      <Empty className="p-12">
        <EmptyMedia variant="icon">
          <FileUp className="w-12 h-12" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No files uploaded yet</EmptyTitle>
          <EmptyDescription>Your uploaded files will appear here</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <Card key={`${file.name}-${file.date}`} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium">{file.name}</h3>
              <p className="text-sm text-muted-foreground">
                Uploaded on {new Date(file.date).toLocaleString()}
                {file.uploadedBy ? ` • ${file.uploadedBy}` : ""}
              </p>
              <p className="text-sm text-muted-foreground">
                Size: {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => deleteFile(file.date)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}