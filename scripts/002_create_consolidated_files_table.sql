-- Create consolidated_files table
CREATE TABLE IF NOT EXISTS consolidated_files (
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_consolidated_files_created_at 
ON consolidated_files(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_consolidated_files_employee_id 
ON consolidated_files(employee_id);

CREATE INDEX IF NOT EXISTS idx_consolidated_files_is_public 
ON consolidated_files(is_public);

-- Enable RLS (Row Level Security)
ALTER TABLE consolidated_files ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read public files
CREATE POLICY "Allow all users to read public consolidated files"
ON consolidated_files
FOR SELECT
USING (is_public = TRUE);

-- Create policy to allow users to insert their own files
CREATE POLICY "Allow users to insert their own consolidated files"
ON consolidated_files
FOR INSERT
WITH CHECK (TRUE);

-- Create policy to allow users to update their own files
CREATE POLICY "Allow users to update their own consolidated files"
ON consolidated_files
FOR UPDATE
USING (TRUE)
WITH CHECK (TRUE);

-- Create policy to allow users to delete their own files
CREATE POLICY "Allow users to delete their own consolidated files"
ON consolidated_files
FOR DELETE
USING (TRUE);
