import OpenAI from 'openai';
import { ScrapeResult } from './scraper';

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export interface AnalysisResult {
  score: number;
  subScores: {
    design: number;
    seo: number;
    mobile: number;
    performance: number;
  };
  findings: string[];
}

export async function analyzeWebsite(scrapeData: ScrapeResult): Promise<AnalysisResult> {
  if (!openai) {
    console.warn("OPENAI_API_KEY not set. Using mock analysis.");
    return {
      score: 5,
      subScores: { design: 5, seo: 5, mobile: 5, performance: 5 },
      findings: ["The site lacks a clear call to action.", "Mobile navigation is slightly confusing."]
    };
  }

  const prompt = `
    Analyze the following website content.
    URL: ${scrapeData.url}
    Title: ${scrapeData.title}
    Description: ${scrapeData.metaDescription}
    Content Snippet: ${scrapeData.textContent}

    Provide an analysis of this website. Score it out of 10 for design, seo, mobile, and performance based on the text context and meta info.
    Calculate an overall score out of 10.
    Provide 2-3 specific findings or issues.
    Respond strictly in JSON format matching this schema:
    {
      "score": number,
      "subScores": { "design": number, "seo": number, "mobile": number, "performance": number },
      "findings": string[]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message.content;
    if (content) {
      return JSON.parse(content) as AnalysisResult;
    }
  } catch (error) {
    console.error("OpenAI Analysis Error:", error);
  }

  throw new Error("Failed to analyze website.");
}

export async function generateColdEmail(analysis: AnalysisResult, goal: string, language: string = 'English'): Promise<string> {
  if (!openai) {
    return `Hi,\n\nI noticed some issues on your website, specifically: ${analysis.findings.join(' ')}. Let's chat about how we can fix this.\n\nBest,`;
  }

  const prompt = `
    You are an expert cold email copywriter. Write a cold email to a prospect whose website you just analyzed.
    The analysis findings are:
    - ${analysis.findings.join('\n- ')}

    The goal of this email is: ${goal}
    Write the email in: ${language}

    Rules:
    - Short: 3-5 sentences total.
    - Start with a specific observation about their site based on the findings.
    - Connect the observation to a consequence.
    - Provide a brief offer.
    - End with a low-friction ask related to the goal.
    - Do NOT include generic compliments.
    - Do NOT include subject lines, placeholders like [Name], or sign-offs like [Your Name]. Just the core message body.

    Return the email body as plain text.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }]
    });

    return response.choices[0]?.message.content?.trim() || "";
  } catch (error) {
    console.error("OpenAI Email Generation Error:", error);
    throw new Error("Failed to generate email.");
  }
}
