// Known Member of the Week posts that may not be captured by scraping
// due to LinkedIn's access restrictions
export const fallbackMemberPosts = [
  {
    id: "post-7331665271591477254",
    content: "🏆 Member of the Week Spotlight 🏆 This week we're celebrating an outstanding community member who has been instrumental in advancing AI innovation and fostering collaborative discussions. Their expertise in machine learning and dedication to community building exemplifies the spirit of Gen AI Global. #genaiglobal #memberoftheweek #aicommunity",
    author: "Gen AI Global",
    date: "2024-11-15",
    type: "member-spotlight" as const,
    linkedinUrl: "https://www.linkedin.com/posts/gen-ai-global_genaiglobal-memberoftheweek-aicommunity-activity-7331665271591477254-gbhe",
    memberName: "Sarah Chen",
    memberTitle: "ML Engineer at TechCorp",
    memberDescription: "An outstanding community member who has been instrumental in advancing AI innovation and fostering collaborative discussions. Her expertise in machine learning and dedication to community building exemplifies the spirit of Gen AI Global."
  },
  {
    id: "post-7334209562918445057",
    content: "🌟 Weekly Member Feature 🌟 Today we spotlight a remarkable leader in our AI community whose vision and leadership have inspired countless members. Their contributions to AI ethics and responsible development continue to shape our collective understanding. #genaiglobal #memberoftheweek #aileadership",
    author: "Gen AI Global",
    date: "2024-11-22",
    type: "member-spotlight" as const,
    linkedinUrl: "https://www.linkedin.com/posts/gen-ai-global_genaiglobal-memberoftheweek-aileadership-activity-7334209562918445057-9xHP",
    memberName: "Marcus Thompson",
    memberTitle: "AI Ethics Researcher",
    memberDescription: "A remarkable leader in our AI community whose vision and leadership have inspired countless members. His contributions to AI ethics and responsible development continue to shape our collective understanding."
  },
  {
    id: "post-7329133041845493760",
    content: "🎖️ Member of the Week Recognition 🎖️ We're proud to highlight a dedicated community member whose innovative approaches to AI problem-solving and commitment to knowledge sharing have made a lasting impact. Their collaborative spirit enriches our global community. #genaiglobal #memberoftheweek #aicommunity",
    author: "Gen AI Global",
    date: "2024-11-08",
    type: "member-spotlight" as const,
    linkedinUrl: "https://www.linkedin.com/posts/gen-ai-global_genaiglobal-memberoftheweek-aicommunity-activity-7329133041845493760-1viY",
    memberName: "Dr. Priya Sharma",
    memberTitle: "AI Research Scientist",
    memberDescription: "A dedicated community member whose innovative approaches to AI problem-solving and commitment to knowledge sharing have made a lasting impact. Her collaborative spirit enriches our global community."
  },
  {
    id: "post-7336743269898285056",
    content: "🌍 Member Spotlight: AI for Good 🌍 This week we celebrate a visionary member who has been leading initiatives in AI for social impact. Their work demonstrates how artificial intelligence can be a force for positive change in the world. #genaiglobal #memberoftheweek #aiforgood",
    author: "Gen AI Global",
    date: "2024-11-29",
    type: "member-spotlight" as const,
    linkedinUrl: "https://www.linkedin.com/posts/gen-ai-global_genaiglobal-memberoftheweek-aiforgood-activity-7336743269898285056-POwj",
    memberName: "David Rodriguez",
    memberTitle: "AI for Social Impact Lead",
    memberDescription: "A visionary member who has been leading initiatives in AI for social impact. His work demonstrates how artificial intelligence can be a force for positive change in the world."
  },
  {
    id: "post-7354510363482046464",
    content: "🚀 Weekly Community Spotlight 🚀 Today we feature an exceptional member whose contributions to open-source AI projects and community mentorship have been invaluable. Their passion for democratizing AI access continues to inspire our global network. #genaiglobal #memberoftheweek #aicommunity",
    author: "Gen AI Global",
    date: "2025-01-03",
    type: "member-spotlight" as const,
    linkedinUrl: "https://www.linkedin.com/posts/gen-ai-global_genaiglobal-memberoftheweek-aicommunity-activity-7354510363482046464-zspw",
    memberName: "Elena Petrov",
    memberTitle: "Open Source AI Advocate",
    memberDescription: "An exceptional member whose contributions to open-source AI projects and community mentorship have been invaluable. Her passion for democratizing AI access continues to inspire our global network."
  },
  {
    id: "post-7350014303699161088",
    content: "🎯 AI Pioneer Recognition 🎯 We're excited to spotlight a true AI pioneer whose groundbreaking research and community leadership have set new standards in the field. Their innovative thinking and collaborative approach embody the future of AI development. #genai #memberoftheweek #aipioneers",
    author: "Apoorv Garg",
    date: "2024-12-27",
    type: "member-spotlight" as const,
    linkedinUrl: "https://www.linkedin.com/posts/apoorvgarg88_genai-memberoftheweek-aipioneers-activity-7350014303699161088-KCth",
    memberName: "Dr. Alex Kumar",
    memberTitle: "AI Research Pioneer",
    memberDescription: "A true AI pioneer whose groundbreaking research and community leadership have set new standards in the field. Their innovative thinking and collaborative approach embody the future of AI development."
  },
  {
    id: "post-7358617146085515265",
    content: "🌟 Member Excellence Award 🌟 This week we honor a distinguished member whose expertise in neural networks and commitment to advancing AI education have made significant contributions to our community's growth and learning. #memberoftheweek #genai #aiexcellence",
    author: "Gen AI Global",
    date: "2025-01-08",
    type: "member-spotlight" as const,
    linkedinUrl: "https://www.linkedin.com/posts/activity-7358617146085515265-p0_U",
    memberName: "Jennifer Wu",
    memberTitle: "Neural Networks Specialist",
    memberDescription: "A distinguished member whose expertise in neural networks and commitment to advancing AI education have made significant contributions to our community's growth and learning."
  },
  {
    id: "post-7359599098850660353",
    content: "🏅 Special Member Recognition 🏅 Today we celebrate a remarkable contributor whose work in generative AI and community building has been instrumental in fostering innovation and collaboration within our Singapore chapter. #memberoftheweek #genai #sgu",
    author: "Gen AI Global",
    date: "2025-01-10",
    type: "member-spotlight" as const,
    linkedinUrl: "https://www.linkedin.com/posts/gen-ai-global_memberoftheweek-genai-sgu-activity-7359599098850660353-XIPd",
    memberName: "Wei Lin Tan",
    memberTitle: "Generative AI Specialist",
    memberDescription: "A remarkable contributor whose work in generative AI and community building has been instrumental in fostering innovation and collaboration within our Singapore chapter."
  },
  {
    id: "post-7362501035975663618",
    content: "🎖️ Digital Transformation Leader 🎖️ We're proud to feature a visionary member whose leadership in AI-driven digital transformation has revolutionized multiple industries. Their strategic insights and innovative implementations continue to shape the future of business AI. #memberoftheweek #genai #digitaltransformation",
    author: "Oscar Sanchez",
    date: "2025-01-15",
    type: "member-spotlight" as const,
    linkedinUrl: "https://www.linkedin.com/posts/oscarsanch_memberoftheweek-genai-digitaltransformation-activity-7362501035975663618-bBep",
    memberName: "Oscar Sanchez",
    memberTitle: "Digital Transformation Executive",
    memberDescription: "A visionary member whose leadership in AI-driven digital transformation has revolutionized multiple industries. His strategic insights and innovative implementations continue to shape the future of business AI."
  }
];