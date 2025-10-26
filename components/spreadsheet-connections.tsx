"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SpreadsheetConnections() {
  const [importDataUrl, setImportDataUrl] = useState("http://localhost:3000/api/data?limit=300000")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">Connect Your Spreadsheets</h2>
      <p className="text-muted-foreground mb-8">
        Access your data directly from Google Sheets, Excel, or any application via our API. 
        No more large file exports or lag.
      </p>

    <Card className="p-8 shadow-lg border-2">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.2 8.4c-.5-.6-1.2-.9-2-.9H4.8c-.8 0-1.5.3-2 .9-.5.6-.8 1.4-.8 2.2v8.8c0 .8.3 1.6.8 2.2.5.6 1.2.9 2 .9h14.4c.8 0 1.5-.3 2-.9.5-.6.8-1.4.8-2.2v-8.8c0-.8-.3-1.6-.8-2.2z"/>
            <path d="M16 2H8l-2 6h12l-2-6z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Google Sheets Integration</h3>
          <p className="text-muted-foreground">Connect your data directly to Google Sheets</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">1</span>
            Using IMPORTDATA (Simple)
          </h4>
          <div className="bg-secondary/50 p-4 rounded-lg border backdrop-blur-sm">
            <code className="text-sm font-mono">
              =IMPORTDATA("{importDataUrl}")
            </code>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
              Paste this formula in a Google Sheet cell. Updates automatically every hour.
            </p>
          </div>
        </div>          <div>
            <h4 className="text-sm font-medium mb-3">Method 2: Using Apps Script (Advanced)</h4>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => copyToClipboard(`function updateData() {
  // Configuration
  const SHEET_ID = '1mdi-8ACluDHGZ7yAyNLwXLwpmQ4f6VAx3kpbaJORViA';
  const SHEET_NAME = 'generated_file';
  const API_URL = '${importDataUrl}';

  // Get the sheet
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('Sheet not found');
  }

  // Clear existing content
  sheet.clear();

  // Fetch data from API
  const response = UrlFetchApp.fetch(API_URL);
  const data = JSON.parse(response.getContentText());

  if (data && data.length > 0) {
    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create values array including headers
    const values = [
      headers,
      ...data.map(row => headers.map(header => row[header] || ''))
    ];

    // Write to sheet
    sheet.getRange(1, 1, values.length, headers.length).setValues(values);

    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    // Format header
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#f3f4f6')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
  }
}

// Create time-based trigger to run every hour
function createTrigger() {
  ScriptApp.newTrigger('updateData')
    .timeBased()
    .everyHours(1)
    .create();
}`)}
            >
              Copy Apps Script Code
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This script will automatically update your sheet every hour. After copying:
            </p>
            <ol className="list-decimal list-inside mt-1 space-y-1 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">1</span>
                Open your Google Sheet
              </li>
              <li className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">2</span>
                Go to Extensions {'->'} Apps Script
              </li>
              <li className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">3</span>
                Paste the code and save
              </li>
              <li className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">4</span>
                Run the createTrigger() function once to set up hourly updates
              </li>
            </ol>
          </div>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Excel Power Query Integration</h3>
        <p className="text-muted-foreground mb-6">Connect your data directly to Excel</p>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">
              {`let
    Source = Json.Document(Web.Contents("${importDataUrl}")),
    #"Converted to Table" = Table.FromList(Source, Splitter.SplitByNothing())
in
    #"Converted to Table"`}
            </pre>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => copyToClipboard(`// Power Query M code`)}
          >
            Copy Power Query Code
          </Button>
        </div>
      </Card>
    </div>
  )
}