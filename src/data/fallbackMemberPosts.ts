// Known Member of the Week posts that may not be captured by scraping
// due to LinkedIn's access restrictions
export const fallbackMemberPosts = [
  {
    id: "manual-aipioneers-post",
    content: "🎖️ Member of the Week Spotlight 🎖️ This week, we're celebrating one of our incredible community members whose contributions to AI innovation continue to inspire us all. Join us in recognizing their dedication to advancing artificial intelligence and fostering collaborative learning within our global community. #genai #memberoftheweek #aipioneers",
    author: "Gen AI Global",
    date: "2024-12-20",
    type: "member-spotlight" as const,
    linkedinUrl: "https://www.linkedin.com/posts/gen-ai-global_genai-memberoftheweek-aipioneers-activity-7346885500529459201-nMKy",
    memberName: "AI Pioneer",
    memberTitle: "Community Leader",
    memberDescription: "Celebrating an incredible community member whose contributions to AI innovation continue to inspire us all. Their dedication to advancing artificial intelligence and fostering collaborative learning within our global community makes them a standout leader."
  },
  {
    id: "manual-recent-spotlight-1",
    content: "🌟 Weekly Member Spotlight 🌟 Today we highlight another exceptional member of our Gen AI Global community who has been instrumental in driving innovation and knowledge sharing. Their expertise and collaborative spirit exemplify what makes our community special. #memberoftheweek #genai #innovation",
    author: "Gen AI Global", 
    date: "2025-01-10",
    type: "member-spotlight" as const,
    linkedinUrl: "https://www.linkedin.com/company/gen-ai-global/posts/",
    memberName: "Innovation Leader",
    memberTitle: "AI Expert",
    memberDescription: "An exceptional member who has been instrumental in driving innovation and knowledge sharing. Their expertise and collaborative spirit exemplify what makes our community special."
  },
  {
    id: "manual-recent-spotlight-2", 
    content: "🎯 Member Feature: Celebrating Excellence 🎯 This week's spotlight shines on a remarkable community member whose insights and contributions have significantly impacted our AI discussions and collaborative projects. We're grateful for their ongoing dedication. #membersspotlight #genai #community",
    author: "Gen AI Global",
    date: "2025-01-05", 
    type: "member-spotlight" as const,
    linkedinUrl: "https://www.linkedin.com/company/gen-ai-global/posts/",
    memberName: "Excellence Champion",
    memberTitle: "AI Innovator", 
    memberDescription: "A remarkable community member whose insights and contributions have significantly impacted our AI discussions and collaborative projects. We're grateful for their ongoing dedication to advancing our collective understanding."
  }
];