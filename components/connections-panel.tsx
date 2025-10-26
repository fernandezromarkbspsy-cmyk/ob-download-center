"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"

type Connection = {
  id: string
  name: string
  host: string
  port?: string
}

export default function ConnectionsPanel() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [name, setName] = useState("")
  const [host, setHost] = useState("")
  const [port, setPort] = useState("")

  const add = () => {
    if (!name || !host) return
    setConnections((s) => [...s, { id: String(Date.now()), name, host, port }])
    setName("")
    setHost("")
    setPort("")
  }

  const remove = (id: string) => setConnections((s) => s.filter((c) => c.id !== id))

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-3">Connections</h3>
      <p className="text-sm text-muted-foreground mb-4">Manage database connections for exports.</p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Connection name"
          className="px-3 py-2 border border-border rounded bg-background"
        />
        <input
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="Host (eg. db.example.com)"
          className="px-3 py-2 border border-border rounded bg-background"
        />
        <input
          value={port}
          onChange={(e) => setPort(e.target.value)}
          placeholder="Port (optional)"
          className="px-3 py-2 border border-border rounded bg-background"
        />
      </div>

      <div className="flex gap-2 mb-6">
        <Button onClick={add}>Add connection</Button>
      </div>

      <div className="space-y-3">
        {connections.length === 0 && <div className="p-4 bg-card rounded">No connections configured.</div>}
        {connections.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-3 bg-card rounded">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.host}{c.port ? `:${c.port}` : ''}</div>
            </div>
            <div>
              <Button variant="outline" size="sm" onClick={() => remove(c.id)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
