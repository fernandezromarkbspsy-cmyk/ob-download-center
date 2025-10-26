# Consolidated Files System Setup

## Overview

The consolidated files system stores successfully processed and consolidated CSV files in Supabase, making them publicly visible across all users. Once a ZIP file is uploaded and consolidated, the resulting file is automatically saved to the database and displayed in the "Uploaded Files" tab.

## Features

- **Automatic Storage**: Consolidated files are automatically saved to Supabase after successful processing
- **Public Visibility**: All consolidated files are visible to all users across the application
- **File Metadata**: Stores file name, size, row count, uploader info, and timestamp
- **Real-time Updates**: The "Uploaded Files" panel displays files in real-time
- **User Attribution**: Each file shows who uploaded it and their employee ID

## Database Setup

### 1. Create the Consolidated Files Table

Run the SQL migration to create the `consolidated_files` table:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the SQL in Supabase dashboard:
# Go to SQL Editor and run: scripts/002_create_consolidated_files_table.sql
```

### 2. Table Schema

```sql
CREATE TABLE consolidated_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by VARCHAR(255) NOT NULL,
  employee_id VARCHAR(50) NOT NULL,
  original_file_name VARCHAR(255),
  row_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT TRUE,
  created_by_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

### 3. Row Level Security (RLS)

The table has RLS enabled with the following policies:

- **Read**: All authenticated users can read public files (`is_public = TRUE`)
- **Insert**: All authenticated users can insert files
- **Update**: All authenticated users can update files
- **Delete**: All authenticated users can delete files

## File Structure

### New Files Created

1. **`app/api/consolidated-files/route.ts`**
   - API endpoint for GET (fetch all files) and POST (save new file)
   - Handles Supabase queries

2. **`lib/use-consolidated-files.ts`**
   - React hook for managing consolidated files
   - Provides `fetchFiles()`, `addFile()`, and state management

3. **`scripts/002_create_consolidated_files_table.sql`**
   - SQL migration for creating the table and policies

### Modified Files

1. **`components/uploaded-files-panel.tsx`**
   - Updated to fetch and display files from Supabase
   - Shows file metadata (size, row count, uploader, timestamp)
   - Displays "Public" badge for all files
   - Added expandable details section

2. **`components/file-upload-section.tsx`**
   - Integrated `useConsolidatedFiles` hook
   - Automatically saves consolidated files to Supabase after processing
   - Maintains existing ZIP upload and filtering functionality

## How It Works

### Upload Flow

1. User uploads a ZIP file in the "ZIP Upload" tab
2. File is processed and consolidated (existing logic)
3. After successful consolidation:
   - Data is displayed in the current view
   - Consolidated file metadata is saved to Supabase
   - File appears in "Uploaded Files" tab for all users

### Display Flow

1. User navigates to "Uploaded Files" tab
2. Component fetches all public consolidated files from Supabase
3. Files are displayed with:
   - File name
   - Upload date and time
   - Uploader name and employee ID
   - File size
   - Row count
   - Public visibility badge

## API Endpoints

### GET `/api/consolidated-files`

Fetches all public consolidated files.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "file_name": "Consolidated_2024-01-15_Ops93521",
      "file_size": 1024000,
      "uploaded_by": "John Doe",
      "employee_id": "Ops93521",
      "original_file_name": "Multiple CSV files from ZIP",
      "row_count": 1500,
      "created_at": "2024-01-15T10:30:00Z",
      "is_public": true
    }
  ]
}
```

### POST `/api/consolidated-files`

Saves a new consolidated file.

**Request Body:**
```json
{
  "fileName": "Consolidated_2024-01-15_Ops93521",
  "fileSize": 1024000,
  "uploadedBy": "John Doe",
  "employeeId": "Ops93521",
  "originalFileName": "Multiple CSV files from ZIP",
  "rowCount": 1500
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "file_name": "Consolidated_2024-01-15_Ops93521",
    "file_size": 1024000,
    "uploaded_by": "John Doe",
    "employee_id": "Ops93521",
    "original_file_name": "Multiple CSV files from ZIP",
    "row_count": 1500,
    "created_at": "2024-01-15T10:30:00Z",
    "is_public": true
  }
}
```

## Usage

### In Components

```typescript
import { useConsolidatedFiles } from "@/lib/use-consolidated-files"

export default function MyComponent() {
  const { files, isLoading, error, addFile } = useConsolidatedFiles()

  // Files are automatically fetched on mount
  // Use addFile() to save a new consolidated file
}
```

### Automatic Saving

When a ZIP file is successfully processed in the "ZIP Upload" tab, the consolidated file is automatically saved:

```typescript
// This happens automatically in file-upload-section.tsx
await addConsolidatedFile({
  file_name: fileName,
  file_size: fileSize,
  uploaded_by: user.fullName,
  employee_id: user.employeeId,
  original_file_name: "Multiple CSV files from ZIP",
  row_count: data.length,
})
```

## Environment Variables

Ensure these are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing

### Manual Testing

1. Navigate to "ZIP Upload" tab
2. Upload a ZIP file with CSV files
3. Wait for processing to complete
4. Navigate to "Uploaded Files" tab
5. Verify the consolidated file appears with correct metadata
6. Refresh the page - file should still be visible
7. Open in another browser/incognito - file should be visible to all users

### Verification Checklist

- [ ] Consolidated file appears in "Uploaded Files" after upload
- [ ] File metadata is correct (name, size, row count)
- [ ] Uploader information is displayed
- [ ] File is visible across different user sessions
- [ ] "Public" badge is displayed
- [ ] Timestamp is accurate
- [ ] File size is calculated correctly

## Troubleshooting

### Files Not Appearing

1. Check Supabase connection:
   ```bash
   # Verify environment variables are set
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

2. Check database table exists:
   - Go to Supabase dashboard → SQL Editor
   - Run: `SELECT * FROM consolidated_files;`

3. Check browser console for errors

### API Errors

1. Check Supabase logs in dashboard
2. Verify RLS policies are correctly set
3. Ensure user is authenticated

### Performance Issues

If loading many files is slow:

1. Add pagination to the API endpoint
2. Implement file caching
3. Add database indexes (already included in migration)

## Future Enhancements

- [ ] Add file download functionality
- [ ] Add file deletion (with permissions)
- [ ] Add file search and filtering
- [ ] Add file versioning
- [ ] Add file sharing with specific users
- [ ] Add file expiration dates
- [ ] Add file compression
- [ ] Add file preview functionality

## Support

For issues or questions, refer to:
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- React Hooks: https://react.dev/reference/react/hooks
