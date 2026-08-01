import { NextResponse } from "next/server";
import { generateProspects } from "@/lib/llm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "Web Design";
  const industry = searchParams.get("industry") || "Software";
  const location = searchParams.get("location") || "New York, United States";

  try {
    // Dynamically generate real/realistic prospects using Gemini AI
    const prospectData = await generateProspects(query, industry, location);

    if (prospectData && prospectData.results && prospectData.results.length > 0) {
      return NextResponse.json({ results: prospectData.results });
    }
  } catch (error) {
    console.error("LLM Lead Generation failed, falling back to mock generator", error);
  }

  // ----------------------------------------------------------------------
  // Fallback Generator: In case LLM fails (e.g. rate limit, invalid key)
  // ----------------------------------------------------------------------
  
  // Simulate network delay to make the UI radar animation play out
  await new Promise(resolve => setTimeout(resolve, 3500));

  const results = Array.from({ length: Math.floor(Math.random() * 5) + 3 }).map((_, i) => {
    const id = `mock_lead_${Date.now()}_${i}`;
    const companyNames = [`${query.split(" ")[0]} Solutions`, `Apex ${industry}`, `Global ${query}`, `${location.split(",")[0]} Tech`, `NextGen ${industry}`];
    const names = ["Sarah Jenkins", "Michael Chen", "David Rodriguez", "Emma Watson", "James Wilson"];
    const domains = ["solutions.io", "tech.co", "global.com", "software.net", "digital.com"];
    
    const company = companyNames[i % companyNames.length];
    const name = names[i % names.length];
    const domain = domains[i % domains.length];
    const cleanDomain = company.toLowerCase().replace(/[^a-z0-9]/g, '') + "." + domain;

    return {
      id,
      name: company,
      websiteUrl: `https://${cleanDomain}`,
      contactName: name,
      email: `${name.split(" ")[0].toLowerCase()}@${cleanDomain}`,
      industry,
      location
    };
  });

  return NextResponse.json({ results });
}
