import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest, 
  res: VercelResponse
) {
  // CORS handling with trimmed origin parsing
  const origin = req.headers.origin
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://genaiglobal.org,http://localhost:8080')
    .split(',')
    .map(o => o.trim())
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const scraperBaseUrl = process.env.SCRAPER_BASE_URL
  const apiKey = process.env.BRIGHT_DATA_API_KEY
  
  if (!scraperBaseUrl || !apiKey) {
    return res.status(503).json({ 
      error: 'Scraper service not configured',
      details: 'Server environment variables missing'
    })
  }
  
  try {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 10000);
    
    try {
      const response = await fetch(`${scraperBaseUrl}/scrape-linkedin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(req.body),
        signal: abortController.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json({ 
          error: 'Scraper service error',
          details: errorData.message || `HTTP ${response.status}`,
          status: response.status
        });
      }
      
      const data = await response.json();
      return res.status(200).json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return res.status(408).json({ 
          error: 'Request timeout',
          details: 'timeout'
        });
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('LinkedIn scraper error:', error);
    
    // Handle structured errors with status codes
    if (error && typeof error === 'object' && 'status' in error) {
      return res.status((error as { status: number }).status).json({ 
        error: 'Scraper request failed',
        details: (error as { message?: string }).message || 'Unknown error'
      });
    }
    
    // Fallback for unexpected errors
    return res.status(500).json({ 
      error: 'Scraper request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}