"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateConnectionString, exportToParquet, initializeGoogleSheets } from '@/lib/database-utils'
import { Database, Table2, FileSpreadsheet, FileCode } from 'lucide-react'

interface DatabaseConnectionProps {
  data?: any[]
  onExport?: (format: string, result: any) => void
  onConnect?: (connection: any) => void
}

export default function DatabaseConnection({ data, onExport }: DatabaseConnectionProps) {
  const [activeTab, setActiveTab] = useState('sheets')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionString, setConnectionString] = useState<string>('')
  const [credentials, setCredentials] = useState({
    client_email: '',
    private_key: '',
    spreadsheet_id: ''
  })

  const handleGenerateConnection = async (type: 'google-sheets' | 'excel-power-query') => {
    try {
      setLoading(true)
      setError(null)
      const config = {
        type,
        tableId: type === 'google-sheets' ? credentials.spreadsheet_id : 'your_table_name',
        credentials: type === 'google-sheets' ? credentials : undefined
      }
      const connection = await generateConnectionString(config)
      setConnectionString(connection)
      if (type === 'google-sheets') {
        const sheets = await initializeGoogleSheets(credentials)
        onConnect?.(sheets)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate connection')
    } finally {
      setLoading(false)
    }
  }

  const handleParquetExport = async () => {
    if (!data) return
    try {
      setLoading(true)
      setError(null)
      const blob = await exportToParquet(data, 'export.parquet')
      onExport?.('parquet', blob)
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'export.parquet'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export Parquet file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <Tabs defaultValue="sheets" className="w-full" onValueChange={setActiveTab}>
        <div className="p-4 border-b border-border">
          <TabsList className="grid grid-cols-3 gap-4">
            <TabsTrigger value="sheets" className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Google Sheets
            </TabsTrigger>
            <TabsTrigger value="excel" className="flex items-center gap-2">
              <Table2 className="w-4 h-4" />
              Excel Power Query
            </TabsTrigger>
            <TabsTrigger value="parquet" className="flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              Parquet Export
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4 space-y-4">
          <TabsContent value="sheets">
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Client Email</Label>
                  <Input
                    value={credentials.client_email}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      client_email: e.target.value
                    }))}
                    placeholder="Enter Google Service Account email"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Private Key</Label>
                  <Input
                    type="password"
                    value={credentials.private_key}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      private_key: e.target.value
                    }))}
                    placeholder="Enter Google Service Account private key"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Spreadsheet ID</Label>
                  <Input
                    value={credentials.spreadsheet_id}
                    onChange={(e) => setCredentials(prev => ({
                      ...prev,
                      spreadsheet_id: e.target.value
                    }))}
                    placeholder="Enter Google Spreadsheet ID"
                  />
                </div>
                <Button
                  onClick={() => handleGenerateConnection('google-sheets')}
                  disabled={loading || !credentials.client_email || !credentials.private_key || !credentials.spreadsheet_id}
                  className="w-full"
                >
                  Connect to Google Sheets
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Click Generate to create the connection formula</li>
                  <li>Copy the formula to your Google Sheet</li>
                  <li>Data will update automatically when refreshed</li>
                </ol>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="excel">
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label>Power Query Connection</Label>
                <div className="flex gap-2">
                  <Input
                    value={connectionString}
                    readOnly
                    placeholder="Click Generate to create Power Query connection"
                  />
                  <Button
                    onClick={() => handleGenerateConnection('excel-power-query')}
                    disabled={loading}
                  >
                    Generate
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>In Excel, go to Data → Get Data → From Other Sources → Blank Query</li>
                  <li>Click Generate and copy the connection string</li>
                  <li>Paste into the Advanced Editor</li>
                  <li>Click Done and load the data</li>
                </ol>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="parquet">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Export your data to Parquet format for efficient storage and faster processing.
                Parquet files are optimized for large datasets and maintain data types.
              </div>
              <Button
                onClick={handleParquetExport}
                disabled={loading || !data}
                className="w-full"
              >
                {loading ? "Exporting..." : "Export to Parquet"}
              </Button>
            </div>
          </TabsContent>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive text-destructive text-sm rounded-md">
              {error}
            </div>
          )}
        </div>
      </Tabs>
    </Card>
  )
}

function onConnect(sheets: any) {
    throw new Error('Function not implemented.')
}
