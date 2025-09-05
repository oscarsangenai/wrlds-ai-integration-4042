import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface LinkedInPost {
  id: string;
  content: string;
  author: string;
  date: string;
  type: 'member-spotlight' | 'general';
  linkedinUrl: string;
  memberName?: string;
  memberTitle?: string;
  memberDescription?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    
    // Get Bright Data API key from Supabase secrets
    const brightDataApiKey = Deno.env.get('BRIGHT_DATA_API_KEY')
    
    if (!brightDataApiKey) {
      return new Response(
        JSON.stringify({ error: 'Bright Data API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Bright Data API request configuration
    const brightDataUrl = 'https://api.brightdata.com/dca/trigger'
    
    const requestBody = {
      collector_id: 'c_lwbqn4jlo8mp08lxpl', // LinkedIn posts collector ID
      url: url || 'https://www.linkedin.com/company/gen-ai-global/posts/?feedView=all',
      format: 'json',
      include_html: true,
      include_screenshot: false,
      webhook_notification_url: null
    }

    // Make request to Bright Data
    const response = await fetch(brightDataUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${brightDataApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      // Guard console.error for production
      if (Deno.env.get('DENO_ENV') !== 'production') {
        console.error('Bright Data API error:', errorText)
      }
      return new Response(
        JSON.stringify({ 
          error: 'Failed to scrape LinkedIn posts',
          details: errorText 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const data = await response.json()
    
    // Parse the scraped data to extract Member of the Week posts
    const posts = parseLinkedInPosts(data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        posts,
        rawData: data // Include raw data for debugging
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    // Guard console.error for production
    if (Deno.env.get('DENO_ENV') !== 'production') {
      console.error('Error in scrape-linkedin function:', error)
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function parseLinkedInPosts(data: unknown): LinkedInPost[] {
  const posts: LinkedInPost[] = []
  
  try {
    // Bright Data typically returns an array of collected data
    const collectData = Array.isArray(data) ? data : [data]
    
    collectData.forEach((item: unknown, index: number) => {
      if (item.text || item.content || item.post_text || item.description) {
        const content = item.text || item.content || item.post_text || item.description || ''
        
        // Enhanced patterns to catch more Member of the Week variations
        const memberOfWeekPatterns = [
          /member\s+of\s+the\s+week/i,
          /memberoftheweek/i,
          /member\s+spotlight/i,
          /membersspotlight/i,
          /🎖️.*member/i,
          /spotlight.*member/i,
          /featuring.*member/i,
          /celebrating.*member/i,
          /aipioneers/i,
          /genai.*member/i,
          /member.*feature/i,
          /weekly.*spotlight/i,
          /community.*spotlight/i,
          /meet.*our.*member/i
        ]
        
        // Check if this is a Member of the Week post
        const isMemberSpotlight = memberOfWeekPatterns.some(pattern => pattern.test(content))
        
        // Also check hashtags specifically
        const hashtags = item.hashtags || extractHashtags(content)
        const hasRelevantHashtags = hashtags && (
          hashtags.includes('memberoftheweek') ||
          hashtags.includes('membersspotlight') ||
          hashtags.includes('aipioneers') ||
          hashtags.includes('genai') ||
          hashtags.includes('spotlight')
        )
        
        if (isMemberSpotlight || hasRelevantHashtags || content.length > 100) {
          // Enhanced member name extraction
          const namePatterns = [
            // Direct name mentions after common phrases
            /(?:meet|introducing|spotlight\s+on|celebrating|featuring)\s+([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi,
            // Names followed by descriptive text
            /([A-Z][a-z]+\s+[A-Z][a-z]+)\s+(?:exemplifies|demonstrates|brings|contributes|is|has|continues)/gi,
            // Names with professional titles
            /([A-Z][a-z]+\s+[A-Z][a-z]+),?\s+(?:director|manager|lead|senior|principal|chief|head|vp|ceo|cto|cfo)/gi,
            // Names followed by "at Company"
            /([A-Z][a-z]+\s+[A-Z][a-z]+)\s+at\s+[A-Z]/gi,
            // General name patterns (2-3 words, title case)
            /\b([A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?)\b/g,
            // LinkedIn mention format
            /(?:@|mention\s+)([A-Z][a-z]+\s+[A-Z][a-z]+)/gi
          ]
          
          let memberName = 'Community Member'
          for (const pattern of namePatterns) {
            const nameMatch = content.match(pattern)
            if (nameMatch && nameMatch[1]) {
              const extractedName = nameMatch[1].trim()
              // Validate name (avoid common false positives)
              if (!extractedName.match(/^(Gen|AI|Global|LinkedIn|Member|Week|Spotlight)$/i) && 
                  extractedName.split(' ').length >= 2 && 
                  extractedName.split(' ').length <= 4) {
                memberName = extractedName
                break
              }
            }
          }
          
          // Enhanced title/company extraction
          const titlePatterns = [
            // Job titles
            /(?:director|manager|lead|senior|principal|chief|head|vp|ceo|cto|cfo|founder|co-founder)\s+[\w\s,&-]+/gi,
            // Professional roles
            /(?:engineer|developer|analyst|scientist|researcher|consultant|advisor|specialist|architect|designer)\s+[\w\s,&-]*/gi,
            // "at Company" pattern
            /at\s+([A-Z][\w\s&,-]+?)(?:\s|$|,|\.|!|\?)/gi,
            // Company role format
            /([A-Z][\w\s&,-]+?)\s+(?:at|@)\s+([A-Z][\w\s&,-]+)/gi
          ]
          
          let memberTitle = 'Community Member'
          for (const pattern of titlePatterns) {
            const titleMatch = content.match(pattern)
            if (titleMatch) {
              memberTitle = titleMatch[0].trim()
              // Clean up title
              memberTitle = memberTitle.charAt(0).toUpperCase() + memberTitle.slice(1)
              if (memberTitle.length < 100) { // Avoid overly long titles
                break
              }
            }
          }
          
          // Enhanced description extraction
          let memberDescription = content
          // Remove hashtags and clean up
          memberDescription = memberDescription.replace(/#[\w]+/g, '').trim()
          // Remove excessive whitespace
          memberDescription = memberDescription.replace(/\s+/g, ' ').trim()
          // Limit length
          if (memberDescription.length > 400) {
            memberDescription = memberDescription.substring(0, 400) + '...'
          }

          // Extract potential LinkedIn URL from content or use item URL
          const linkedinUrlMatch = content.match(/https:\/\/www\.linkedin\.com\/[^\s)]+/) ||
                                   content.match(/linkedin\.com\/[^\s)]+/)
          const linkedinUrl = item.url || 
                              item.post_url || 
                              item.link ||
                              (linkedinUrlMatch ? 'https://' + linkedinUrlMatch[0].replace('https://', '') : null) ||
                              'https://www.linkedin.com/company/gen-ai-global/posts/'

          // Extract date more reliably
          const dateStr = item.date || 
                         item.published_date || 
                         item.created_date ||
                         extractDateFromText(content) ||
                         new Date().toISOString().split('T')[0]

          posts.push({
            id: `bright-data-${index}-${Date.now()}`,
            content: content,
            author: item.author || 'Gen AI Global',
            date: dateStr,
            type: isMemberSpotlight || hasRelevantHashtags ? 'member-spotlight' : 'general',
            linkedinUrl,
            memberName,
            memberTitle,
            memberDescription
          })
        }
      }
    })
    
  } catch (parseError) {
    // Guard console.error for production
    if (Deno.env.get('DENO_ENV') !== 'production') {
      console.error('Error parsing LinkedIn posts:', parseError)
    }
  }
  
  return posts.slice(0, 15) // Increase limit to capture more posts
}

function extractHashtags(text: string): string[] {
  const hashtagPattern = /#([a-zA-Z0-9_]+)/g
  const matches = text.match(hashtagPattern)
  return matches ? matches.map(tag => tag.toLowerCase().substring(1)) : []
}

function extractDateFromText(text: string): string | null {
  const datePatterns = [
    /(\d{4}-\d{2}-\d{2})/,
    /(\w+\s+\d{1,2},\s+\d{4})/,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    /(\d{1,2}-\d{1,2}-\d{4})/
  ]

  for (const pattern of datePatterns) {
    const match = text.match(pattern)
    if (match) {
      const date = new Date(match[1])
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]
      }
    }
  }

  return null
}