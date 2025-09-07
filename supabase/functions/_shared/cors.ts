// Environment-driven CORS allowlist
const getAllowedOrigins = (): string[] => {
  const origins = Deno.env.get('ALLOWED_ORIGINS') || 'https://genaiglobal.org'
  return origins.split(',').map(o => o.trim())
}

export const getCorsHeaders = (origin?: string): Record<string, string> => {
  const allowedOrigins = getAllowedOrigins()
  const allowedOrigin = origin && allowedOrigins.includes(origin) 
    ? origin 
    : allowedOrigins[0] // Default to primary site
    
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  }
}

// Backward compatibility
export const corsHeaders = getCorsHeaders()