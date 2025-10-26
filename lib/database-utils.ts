"use client"

import { createClient } from '@supabase/supabase-js'
import { ParquetWriter, ParquetSchema } from 'parquets'
import { PostgrestResponse } from '@supabase/postgrest-js'
import { google } from 'googleapis'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface ConnectionConfig {
  type: 'google-sheets' | 'excel-power-query' | 'parquet' | 'direct'
  tableId?: string
  query?: string
  filters?: Record<string, any>
  credentials?: {
    client_email?: string
    private_key?: string
    spreadsheet_id?: string
  }
}

export async function generateConnectionString(config: ConnectionConfig): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  switch (config.type) {
    case 'google-sheets':
      // Generate Google Sheets formula
      const apiUrl = `${baseUrl}/rest/v1/${config.tableId}?apikey=${anonKey}`
      return `=IMPORTDATA("${apiUrl}")`
    
    case 'excel-power-query':
      // Generate Power Query connection string
      return `let
        Source = Json.Document(Web.Contents("${baseUrl}/rest/v1/${config.tableId}", [
          Headers=[ApiKey="${anonKey}"]
        ])),
        #"Converted to Table" = Table.FromList(Source, Splitter.SplitByNothing())
      in
        #"Converted to Table"`
    case 'direct':
      // Generate direct database connection string
      return `postgres://${process.env.SUPABASE_DB_USER}:${process.env.SUPABASE_DB_PASSWORD}@${baseUrl}:${process.env.SUPABASE_DB_PORT}/${process.env.SUPABASE_DB_NAME}`
    
    default:
      throw new Error(`Unsupported connection type: ${config.type}`)
  }
}

export async function initializeGoogleSheets(credentials: ConnectionConfig['credentials']) {
  if (!credentials?.client_email || !credentials?.private_key || !credentials?.spreadsheet_id) {
    throw new Error('Missing required Google Sheets credentials')
  }

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  })

  const sheets = google.sheets({ version: 'v4', auth })
  return sheets
}
export async function exportToParquet(data: any[], filename: string): Promise<Blob> {
  // Note: Parquet generation in-browser has limited support depending on the
  // environment. As a robust fallback for client usage we generate a CSV blob
  // that can be downloaded (some consumers may still expect parquet, so this
  // function will attempt parquet server-side but fallback to CSV in the
  // browser).

  // If running in a browser, return CSV Blob as a safe fallback
  if (typeof window !== 'undefined') {
    const columns = Object.keys(data[0] || {})
    const csvRows = [columns.join(',')]
    for (const row of data) {
      csvRows.push(
        columns
          .map((col) => {
            const val = row[col] ?? ''
            const escaped = String(val).replace(/"/g, '""')
            return escaped.includes(',') || escaped.includes('"') ? `"${escaped}"` : escaped
          })
          .join(',')
      )
    }
    const csv = csvRows.join('\n')
    return new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  }

  // Server-side: attempt to write an actual Parquet file if 'parquets' is
  // available. Build a ParquetSchema from the inferred types.
  if (!data || data.length === 0) {
    throw new Error('No data provided for Parquet export')
  }

  const schemaDef: Record<string, any> = {}
  for (const [field, value] of Object.entries(data[0])) {
    let type: string = 'UTF8'
    if (typeof value === 'number') type = Number.isInteger(value) ? 'INT64' : 'DOUBLE'
    else if (typeof value === 'boolean') type = 'BOOLEAN'
    else if (value instanceof Date) type = 'TIMESTAMP_MILLIS'
    schemaDef[field] = { type }
  }

  const schema = new ParquetSchema(schemaDef)
  const writer = await ParquetWriter.openFile(schema, filename, {
    compression: 'SNAPPY',
  })

  for (const row of data) {
    await writer.appendRow(row)
  }

  await writer.close()

  // ParquetWriter in Node writes to a file; return an empty Blob placeholder
  // since exposing the file buffer here is environment-specific. Callers on
  // the server should read the file from disk.
  return new Blob([], { type: 'application/octet-stream' })
}

export async function querySupabaseData(queryOrTable: string): Promise<PostgrestResponse<any>> {
  // If a raw SQL-like string is passed, try to extract the table name. For
  // most internal usages we expect callers to pass the table name directly.
  const trimmed = queryOrTable.trim()
  const parts = trimmed.split(/\s+/)
  const table = parts.length > 1 ? parts[1] : trimmed

  if (!table) throw new Error('No table specified for query')

  return await supabase.from(table).select('*')
}