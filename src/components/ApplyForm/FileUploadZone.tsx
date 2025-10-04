import { useRef } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadedFile } from './types';

interface FileUploadZoneProps {
  files: UploadedFile[];
  onFilesAdded: (files: FileList) => void;
  onFileRemove: (fileId: string) => void;
  error: string | null;
}

export const FileUploadZone = ({ files, onFilesAdded, onFileRemove, error }: FileUploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      onFilesAdded(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      {/* Upload zone - wireframe: general member form - empty.png */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-base text-foreground mb-2">
          <span className="font-medium text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm text-muted-foreground">
          PDF, JPG, PNG (max. 15MB per file)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => e.target.files && onFilesAdded(e.target.files)}
          className="hidden"
          aria-label="Upload files"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* File list - wireframe: uploading.png, uploaded.png, multiple uploaded.png */}
      {files.length > 0 && (
        <div className="space-y-3" role="list" aria-label="Uploaded files">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border"
              role="listitem"
            >
              <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground truncate pr-4">
                    {file.name}
                  </p>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                
                {/* Progress bar for uploading files - wireframe: uploading.png */}
                {file.status === 'uploading' && (
                  <div className="space-y-1">
                    <Progress value={file.progress} className="h-1" aria-label={`Upload progress: ${file.progress}%`} />
                    <p className="text-xs text-muted-foreground" aria-live="polite">
                      Uploading... {file.progress}%
                    </p>
                  </div>
                )}

                {/* Complete status - wireframe: uploaded.png */}
                {file.status === 'complete' && (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span aria-live="polite">Upload complete</span>
                  </div>
                )}

                {/* Error status */}
                {file.status === 'error' && (
                  <div className="flex items-center gap-2 text-xs text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span aria-live="polite">Upload failed</span>
                  </div>
                )}
              </div>

              {/* Status icon and delete button */}
              <div className="flex items-center gap-2">
                {file.status === 'uploading' && (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                )}
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileRemove(file.id);
                  }}
                  aria-label={`Remove ${file.name}`}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
