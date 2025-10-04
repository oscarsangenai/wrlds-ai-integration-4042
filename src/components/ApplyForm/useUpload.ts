import { useState, useCallback } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import { UploadedFile } from './types';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

export const useUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} exceeds 15MB limit`;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `${file.name} must be PDF, JPG, or PNG`;
    }
    return null;
  };

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: UploadedFile[] = [];
    let hasError = false;

    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        hasError = true;
        return;
      }

      const uploadFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'pending',
        file
      };
      validFiles.push(uploadFile);
    });

    if (!hasError) {
      setError(null);
      setFiles(prev => [...prev, ...validFiles]);
      // Auto-upload new files
      validFiles.forEach(uploadFile => {
        uploadSingleFile(uploadFile);
      });
    }
  }, []);

  const uploadSingleFile = async (uploadFile: UploadedFile) => {
    setFiles(prev => prev.map(f => 
      f.id === uploadFile.id ? { ...f, status: 'uploading' as const } : f
    ));

    const formData = new FormData();
    formData.append('file', uploadFile.file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const progress = progressEvent.total 
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          
          setFiles(prev => prev.map(f =>
            f.id === uploadFile.id ? { ...f, progress } : f
          ));
        }
      });

      if (response.data.success && response.data.files?.[0]) {
        setFiles(prev => prev.map(f =>
          f.id === uploadFile.id 
            ? { ...f, status: 'complete' as const, progress: 100, url: response.data.files[0].url }
            : f
        ));
      }
    } catch (err) {
      setFiles(prev => prev.map(f =>
        f.id === uploadFile.id ? { ...f, status: 'error' as const } : f
      ));
      setError(`Failed to upload ${uploadFile.name}`);
    }
  };

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setError(null);
  }, []);

  const resetFiles = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  return {
    files,
    error,
    addFiles,
    removeFile,
    resetFiles
  };
};
