"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export default function ConnectionGuide() {
  const [copied, setCopied] = useState<string | null>(null)

  const apiUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/data`

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Google Sheets */}
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Google Sheets Integration</CardTitle>
          <CardDescription>Connect your data directly to Google Sheets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <p className="text-sm text-foreground font-medium">Method 1: Using IMPORTDATA (Simple)</p>
            <div className="bg-background p-3 rounded border border-border">
              <code className="text-xs text-muted-foreground break-all">=IMPORTDATA("{apiUrl}?limit=300000")</code>
            </div>
            <p className="text-xs text-muted-foreground">
              Paste this formula in a Google Sheet cell. Updates automatically every hour.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-3">
            <p className="text-sm text-foreground font-medium">Method 2: Using Apps Script (Advanced)</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  `function fetchData() {
  const url = "${apiUrl}?page=1&limit=10000";
  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Clear existing data
  sheet.clearContents();
  
  // Add headers
  const headers = Object.keys(data.data[0]);
  sheet.appendRow(headers);
  
  // Add data rows
  data.data.forEach(row => {
    sheet.appendRow(headers.map(h => row[h]));
  });
}`,
                  "apps-script",
                )
              }
              className="w-full justify-start"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied === "apps-script" ? "Copied!" : "Copy Apps Script Code"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Excel Power Query */}
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Excel Power Query</CardTitle>
          <CardDescription>Connect Excel to your data with Power Query</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="space-y-3 text-sm text-foreground">
            <li className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <span>Open Excel and go to Data → Get Data → From Web</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <span>Paste this URL:</span>
            </li>
          </ol>
          <div className="bg-background p-3 rounded border border-border">
            <code className="text-xs text-muted-foreground break-all">{apiUrl}?limit=50000</code>
          </div>
          <ol className="space-y-3 text-sm text-foreground" start={3}>
            <li className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <span>Click OK and transform the data as needed</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">4.</span>
              <span>Load the data into your worksheet</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-foreground">API Documentation</CardTitle>
          <CardDescription>Direct API access for custom integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-foreground font-medium">Base URL:</p>
            <div className="bg-background p-3 rounded border border-border flex items-center justify-between">
              <code className="text-xs text-muted-foreground break-all">{apiUrl}</code>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiUrl, "base-url")}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-foreground font-medium">Query Parameters:</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <span className="font-mono text-foreground">page</span> - Page number (default: 1)
              </li>
              <li>
                <span className="font-mono text-foreground">limit</span> - Records per page (default: 1000, max: 50000)
              </li>
              <li>
                <span className="font-mono text-foreground">receiver_type</span> - Filter by receiver type
              </li>
              <li>
                <span className="font-mono text-foreground">journey_type</span> - Filter by journey type
              </li>
              <li>
                <span className="font-mono text-foreground">receive_status</span> - Filter by receive status
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-foreground font-medium">Example Request:</p>
            <div className="bg-background p-3 rounded border border-border">
              <code className="text-xs text-muted-foreground break-all">
                {apiUrl}?page=1&limit=5000&receiver_type=Standard&journey_type=Direct
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="bg-muted border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Benefits of Direct Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Real-time data access - No lag from large exports</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Automatic updates - Data refreshes on schedule</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Pagination support - Handle millions of rows efficiently</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Filtering capabilities - Query specific data subsets</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>No file size limits - Access all your data</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
