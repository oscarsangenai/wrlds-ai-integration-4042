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
      console.error('Bright Data API error:', errorText)
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
    console.error('Error in scrape-linkedin function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function parseLinkedInPosts(data: any): LinkedInPost[] {
  const posts: LinkedInPost[] = []
  
  try {
    // Bright Data typically returns an array of collected data
    const collectData = Array.isArray(data) ? data : [data]
    
    collectData.forEach((item: any, index: number) => {
      if (item.text || item.content || item.post_text) {
        const content = item.text || item.content || item.post_text || ''
        
        // Check if this is a Member of the Week post
        const isMemberSpotlight = /member\s+(?:of\s+the\s+)?week|member\s+spotlight|🎖️/i.test(content)
        
        if (isMemberSpotlight || content.length > 100) {
          // Extract member name
          const namePatterns = [
            /(?:meet|introducing|spotlight\s+on|celebrating)\s+([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi,
            /([A-Z][a-z]+\s+[A-Z][a-z]+)\s+(?:exemplifies|demonstrates|brings|contributes)/gi,
            /\b([A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?)\b/g
          ]
          
          let memberName = 'Community Member'
          for (const pattern of namePatterns) {
            const nameMatch = content.match(pattern)
            if (nameMatch && nameMatch[1]) {
              memberName = nameMatch[1].trim()
              break
            }
          }
          
          // Extract title/company
          const titlePatterns = [
            /(?:director|manager|lead|senior|principal|chief|head|vp|ceo|cto|cfo)[\s\w,]+/gi,
            /at\s+([A-Z][a-zA-Z\s&]+)(?:\s|$|,|\.|!)/g
          ]
          
          let memberTitle = 'Community Member'
          for (const pattern of titlePatterns) {
            const titleMatch = content.match(pattern)
            if (titleMatch) {
              memberTitle = titleMatch[0].trim()
              break
            }
          }
          
          posts.push({
            id: `bright-data-${index}`,
            content: content,
            author: item.author || 'Gen AI Global',
            date: item.date || item.published_date || new Date().toISOString().split('T')[0],
            type: isMemberSpotlight ? 'member-spotlight' : 'general',
            linkedinUrl: item.url || item.post_url || 'https://www.linkedin.com/company/gen-ai-global/posts/',
            memberName,
            memberTitle,
            memberDescription: content.length > 300 ? content.substring(0, 300) + '...' : content
          })
        }
      }
    })
    
  } catch (parseError) {
    console.error('Error parsing LinkedIn posts:', parseError)
  }
  
  return posts.slice(0, 10) // Limit to 10 posts
}