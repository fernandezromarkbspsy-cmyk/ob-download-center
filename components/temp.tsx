// Temporary file for comparison
return (
  <div className="flex items-center justify-center min-h-[30vh]">
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <span className="text-sm font-medium">Upload CSV Files</span>
          {totalFilteredRows > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              ({totalFilteredRows.toLocaleString()} rows filtered)
            </span>
          )}
        </div>

        <div
          className="border-2 border-dashed border-border bg-muted/5 rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-accent/5 transition-all duration-300 group"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-muted/10 group-hover:bg-primary/10 transition-colors duration-300">
              <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Click to upload or drag & drop</p>
              <p className="text-xs text-muted-foreground mt-1">ZIP files only</p>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
          aria-label="ZIP file input"
          title="ZIP file input"
        />

        <div className="flex justify-between items-center px-2 pt-2 border-t border-border">
          <div className="space-y-1.5 animate-in fade-in slide-in-from-left-5 duration-500">
            <div className="text-sm font-medium">Statistics</div>
            <div className="text-sm text-muted-foreground flex items-center gap-4">
              <span>Total Rows: <span className="font-medium text-foreground">{totalRows.toLocaleString()}</span></span>
              <span>Files Processed: <span className="font-medium text-foreground">{processedFiles}</span></span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/5 text-destructive text-sm rounded-lg px-3 py-2 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="w-1 h-1 rounded-full bg-destructive animate-pulse"></div>
            {error}
          </div>
        )}

        {isLoading && (
          <div className="bg-primary/5 text-primary text-sm rounded-lg px-3 py-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Processing files...</span>
          </div>
        )}

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-medium"
          variant="ghost"
        >
          {isLoading ? "Processing..." : "Select ZIP File"}
        </Button>
      </div>
    </Card>
  </div>
)