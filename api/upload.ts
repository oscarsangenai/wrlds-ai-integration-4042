import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { IncomingForm, File as FormidableFile } from 'formidable';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * File Upload API Endpoint
 * 
 * Production-ready endpoint that handles file uploads to Supabase Storage.
 * Supports PDF, JPG, and PNG files up to 15MB.
 * 
 * Environment Variables Required:
 * - VITE_SUPABASE_URL: Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Supabase anonymous key
 * - SUPABASE_SERVICE_ROLE_KEY: Service role key (optional, for enhanced operations)
 * - MAX_FILE_SIZE: Maximum file size in bytes (default: 15MB)
 * - ALLOWED_ORIGINS: Comma-separated list of allowed origins for CORS
 */

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '15728640', 10); // 15MB default
const ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];
const STORAGE_BUCKET = 'form_uploads';

interface UploadedFileResponse {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

// Validate environment configuration
const validateConfig = (): { isValid: boolean; error?: string } => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      isValid: false,
      error: 'Server configuration error. Missing Supabase credentials.',
    };
  }

  return { isValid: true };
};

// Get allowed origins
const getAllowedOrigins = (): string[] => {
  const origins = process.env.ALLOWED_ORIGINS || 'https://genaiglobal.org,http://localhost:8080,http://localhost:5173';
  return origins.split(',').map(o => o.trim());
};

// Validate origin
const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true;
  const allowed = getAllowedOrigins();
  return allowed.includes(origin) || allowed.includes('*');
};

// Parse multipart form data
const parseForm = (req: VercelRequest): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      maxFileSize: MAX_FILE_SIZE,
      keepExtensions: true,
      multiples: true,
    });

    form.parse(req as any, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
};

// Validate file type and size
const validateFile = (file: FormidableFile): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File size exceeds ${Math.floor(MAX_FILE_SIZE / 1024 / 1024)}MB limit` 
    };
  }

  if (file.mimetype && !ACCEPTED_TYPES.includes(file.mimetype)) {
    return { 
      valid: false, 
      error: 'File type not supported. Please upload PDF, JPG, or PNG files.' 
    };
  }

  return { valid: true };
};

// Upload file to Supabase Storage
const uploadToSupabase = async (
  file: FormidableFile,
  supabase: ReturnType<typeof createClient>
): Promise<UploadedFileResponse> => {
  // Read file data
  const fileData = readFileSync(file.filepath);
  
  // Generate unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 11);
  const ext = file.originalFilename?.split('.').pop() || 'bin';
  const sanitizedName = file.originalFilename?.replace(/[^a-zA-Z0-9.-]/g, '_') || 'file';
  const uniqueFileName = `${timestamp}_${randomStr}_${sanitizedName}`;
  
  // Upload to Supabase storage
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(uniqueFileName, fileData, {
      contentType: file.mimetype || 'application/octet-stream',
      upsert: false,
    });

  if (error) {
    console.error('Supabase storage error:', error);
    throw new Error('Failed to upload file to storage');
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(uniqueFileName);

  return {
    id: `${timestamp}-${randomStr}`,
    url: publicUrlData.publicUrl,
    name: file.originalFilename || 'unnamed',
    size: file.size,
    type: file.mimetype || 'application/octet-stream',
  };
};

// Disable body parser for multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const origin = req.headers.origin;

  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  // Validate origin
  if (!isOriginAllowed(origin)) {
    return res.status(403).json({ 
      success: false,
      error: 'Origin not allowed' 
    });
  }

  try {
    // Validate configuration
    const configCheck = validateConfig();
    if (!configCheck.isValid) {
      console.error('Configuration error:', configCheck.error);
      return res.status(500).json({ 
        success: false,
        error: 'Server configuration error. Please contact support.' 
      });
    }

    // Parse multipart form data
    let parsedData: { fields: any; files: any };
    try {
      parsedData = await parseForm(req);
    } catch (parseError) {
      console.error('Form parsing error:', parseError);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid file upload. Please check file size and format.' 
      });
    }

    const { files } = parsedData;

    // Extract file(s) - handle both single and multiple files
    let fileArray: FormidableFile[] = [];
    if (files.file) {
      fileArray = Array.isArray(files.file) ? files.file : [files.file];
    } else {
      // Check for other possible field names
      const fileFields = Object.keys(files);
      if (fileFields.length > 0) {
        const firstField = files[fileFields[0]];
        fileArray = Array.isArray(firstField) ? firstField : [firstField];
      }
    }

    if (fileArray.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No files provided' 
      });
    }

    // Validate all files
    for (const file of fileArray) {
      const validation = validateFile(file);
      if (!validation.valid) {
        return res.status(400).json({ 
          success: false,
          error: validation.error 
        });
      }
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upload all files
    const uploadedFiles: UploadedFileResponse[] = [];
    for (const file of fileArray) {
      try {
        const uploadedFile = await uploadToSupabase(file, supabase);
        uploadedFiles.push(uploadedFile);
        console.log('File uploaded successfully:', uploadedFile.name);
      } catch (uploadError) {
        console.error('Upload error for file:', file.originalFilename, uploadError);
        throw new Error(`Failed to upload ${file.originalFilename}`);
      }
    }

    // Return success response
    return res.status(200).json({
      success: true,
      files: uploadedFiles,
      count: uploadedFiles.length,
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Return safe error message
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return res.status(500).json({
      success: false,
      error: errorMessage,
      message: 'An error occurred while uploading files. Please try again later.'
    });
  }
}
