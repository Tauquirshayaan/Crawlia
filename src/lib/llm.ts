/**
 * LLM — All Google Gemini AI interactions in one place.
 *
 * Audit fix: previously both llm.ts and replyClassifier.ts imported different
 * Google AI SDK packages (@google/genai vs @google/generative-ai). Consolidated
 * onto @google/genai (the newer official SDK) with one shared client instance.
 */
import { GoogleGenAI, Part } from '@google/genai';
import type { AnalysisResult, SeoSignals } from './analyzer';

// Single shared client — initialized once, reused across all requests.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY ?? 'dummy-key',
});

const MODEL = 'gemini-2.5-flash';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface VisualCritiqueCategory {
  subscore: number; // 0–10
  findings: string[];
}

export interface VisualCritiqueResult {
  heroClarityScore: VisualCritiqueCategory;
  visualHierarchyScore: VisualCritiqueCategory;
  copyQualityScore: VisualCritiqueCategory;
  mobileExperienceScore: VisualCritiqueCategory;
  trustSignalsScore: VisualCritiqueCategory;
  ctaClarityScore: VisualCritiqueCategory;
}

const EMPTY_CRITIQUE: VisualCritiqueResult = {
  heroClarityScore: { subscore: 5, findings: [] },
  visualHierarchyScore: { subscore: 5, findings: [] },
  copyQualityScore: { subscore: 5, findings: [] },
  mobileExperienceScore: { subscore: 5, findings: [] },
  trustSignalsScore: { subscore: 5, findings: [] },
  ctaClarityScore: { subscore: 5, findings: [] },
};

export interface CritiqueResult {
  painPoints: string[];
  compliments: string[];
  suggestedHook: string;
}

export interface EmailDraftResult {
  subject: string;
  body: string;
}

export type ReplyIntent =
  | 'INTERESTED'
  | 'NOT_INTERESTED'
  | 'INFO_REQUEST'
  | 'OOO'
  | 'UNSUBSCRIBE';

export interface ReplyClassification {
  intent: ReplyIntent;
  confidence: number;
}

export interface ProspectResult {
  id: string;
  name: string;
  websiteUrl: string;
  contactName: string;
  email: string;
  industry: string;
  location: string;
}

export interface ProspectListResult {
  results: ProspectResult[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared helper
// ─────────────────────────────────────────────────────────────────────────────

async function generateJson<T>(prompt: string, fallback: T): Promise<T> {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text;
    if (!text) throw new Error('Empty LLM response');

    // Strip any accidental markdown fences
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error('[LLM] generateJson failed:', err);
    return fallback;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Multimodal visual critique (Stage 4 — uses screenshots)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Stage 4 LLM visual critique.
 *
 * Sends both desktop and mobile screenshots alongside the Stage 3 objective
 * signals to Gemini. The model is asked to critique qualitatively (not re-derive
 * facts it's already been given) across a fixed six-category rubric.
 *
 * Each category returns a subscore 0–10 and a list of specific findings.
 * The findings MUST be traceable to something visible in the screenshots
 * or present in the extracted signals — the prompt enforces this explicitly.
 */
export async function critiqueWithVision(
  desktopBase64: string,
  mobileBase64: string,
  seoSignals: SeoSignals,
  pageText: string,
  websiteUrl: string,
): Promise<VisualCritiqueResult> {
  const signalSummary = `
URL: ${websiteUrl}
Title: ${seoSignals.title ?? 'Missing'}
Meta Description: ${seoSignals.description ?? 'Missing'}
H1 Tags: ${seoSignals.h1.join(', ') || 'None'}
Has OpenGraph Tags: ${seoSignals.hasOpenGraph ? 'Yes' : 'No'}
Has Canonical Tag: ${seoSignals.hasCanonical ? 'Yes' : 'No'}
Mobile Viewport Meta: ${seoSignals.hasViewportMeta ? 'Yes' : 'No'}
Alt Text Coverage: ${Math.round(seoSignals.altTextCoverage * 100)}%
Schema.org Types: ${seoSignals.structuredDataTypes.join(', ') || 'None'}
Page Text Snippet: ${pageText.substring(0, 800)}
`.trim();

  const prompt = `
You are a senior UX designer, SEO consultant, and conversion rate expert conducting a website audit.

You have been provided:
1. A desktop screenshot (1440px wide) of the website
2. A mobile screenshot (390px wide) of the same website
3. Objective technical signals extracted from the page (below)

OBJECTIVE SIGNALS:
${signalSummary}

YOUR TASK:
Score the website across these six categories. Each score is 0 (very poor) to 10 (excellent).
For each category, list 1–3 SPECIFIC findings observable in the screenshots or signals.
Findings MUST reference something actually visible or measurable — NO invented statistics, NO assumptions about the business.

CATEGORIES TO SCORE:
1. heroClarityScore — Is the above-the-fold hero section immediately clear about what the business does?
2. visualHierarchyScore — Is content laid out with clear visual priority? Does the eye flow naturally?
3. copyQualityScore — Is the on-page copy specific, benefit-focused, and free from generic filler phrases?
4. mobileExperienceScore — Does the mobile layout look clean, readable, and functional on a phone?
5. trustSignalsScore — Are there visible trust elements (testimonials, logos, certifications, clear contact info)?
6. ctaClarityScore — Is there a clear primary call-to-action? Is it prominently placed?

Return STRICTLY as JSON matching this schema:
{
  "heroClarityScore": { "subscore": 0-10, "findings": ["..."] },
  "visualHierarchyScore": { "subscore": 0-10, "findings": ["..."] },
  "copyQualityScore": { "subscore": 0-10, "findings": ["..."] },
  "mobileExperienceScore": { "subscore": 0-10, "findings": ["..."] },
  "trustSignalsScore": { "subscore": 0-10, "findings": ["..."] },
  "ctaClarityScore": { "subscore": 0-10, "findings": ["..."] }
}
`.trim();

  try {
    const parts: Part[] = [
      { text: prompt },
      {
        inlineData: {
          mimeType: 'image/png',
          data: desktopBase64,
        },
      },
      {
        inlineData: {
          mimeType: 'image/png',
          data: mobileBase64,
        },
      },
    ];

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts }],
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text;
    if (!text) throw new Error('Empty LLM response');

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as VisualCritiqueResult;
  } catch (err) {
    console.error('[LLM] critiqueWithVision failed:', err);
    return EMPTY_CRITIQUE;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/** Critique a website and produce pain-points + a hook sentence. */
export async function critiqueWebsite(
  analysis: AnalysisResult,
): Promise<CritiqueResult> {
  const hostname = safeHostname(analysis.url);

  const prompt = `
You are an expert copywriter for a web design and SEO agency.
Review the following website analysis and identify 2-3 genuine pain points
(e.g. slow load time, missing SEO tags, low text content) and 1 compliment.
Then write a compelling, 1-sentence personalized email hook for cold outreach.

Website: ${analysis.url}
Title: ${analysis.seo.title}
Description: ${analysis.seo.description}
H1s: ${analysis.seo.h1.join(', ')}
Structured Data types: ${analysis.seo.structuredDataTypes?.join(', ') || 'None detected'}
Has OpenGraph tags: ${analysis.seo.hasOpenGraph ? 'Yes' : 'No'}
Load Time: ${analysis.performance.loadTimeMs}ms
Word count (approx): ${Math.round(analysis.content.text.length / 5)}

Return STRICTLY as JSON:
{"painPoints":["..."],"compliments":["..."],"suggestedHook":"..."}
`.trim();

  return generateJson<CritiqueResult>(prompt, {
    painPoints: ['Could not extract pain points at this time.'],
    compliments: ['The website has a solid baseline structure.'],
    suggestedHook: `I noticed ${hostname} and wanted to share ideas on improving its conversion rate.`,
  });
}

export interface MessagingAngle {
  finding: string;
  angle: string;
}

/** Step A: Translate raw findings into messaging angles. */
export async function generateMessagingAngles(
  analysis: AnalysisResult
): Promise<MessagingAngle[]> {
  const prompt = `
You are an expert sales strategist.
Analyze the following website findings and extract the 1 to 3 most severe issues (e.g. slow load times, missing SEO tags, poor structure).
For each severe finding, translate it into a short, punchy "messaging angle" that ties the issue to a business consequence (e.g., "first impression / drop-off risk", "user friction", "invisible to search engines").

WEBSITE ANALYSIS (${analysis.url}):
- Title: ${analysis.seo.title || 'N/A'}
- Description: ${analysis.seo.description || 'N/A'}
- Main Headings (H1): ${analysis.seo.h1.join(', ') || 'None'}
- Structured Data (Schema): ${analysis.seo.structuredDataTypes?.join(', ') || 'Missing'}
- Social Preview Tags (OpenGraph): ${analysis.seo.hasOpenGraph ? 'Present' : 'Missing'}
- Page Load Time: ${analysis.performance.loadTimeMs}ms

Return STRICTLY as JSON with an array of "angles":
{"angles":[{"finding":"LCP 4.8s on mobile","angle":"first impression / drop-off risk"}]}
  `.trim();

  const result = await generateJson<{ angles: MessagingAngle[] }>(prompt, {
    angles: [{ finding: "General optimization", angle: "conversion improvement" }]
  });
  
  return result.angles;
}

/** Step B: Draft a cold outreach email based on campaign instructions, angles, and lead context. */
export async function draftEmail(
  campaignPrompt: string,
  analysis: AnalysisResult,
  angles: MessagingAngle[],
  leadContext: { name?: string | null; company?: string | null; segment?: string | null }
): Promise<EmailDraftResult> {
  const hostname = safeHostname(analysis.url);
  const anglesText = angles.map(a => `- ${a.finding} -> Angle to pitch: ${a.angle}`).join('\\n');

  const prompt = `
You are an expert B2B cold email copywriter.
Write a highly personalized cold email based on the instructions, lead details, and the specifically chosen messaging angles below.

CAMPAIGN GOAL / INSTRUCTIONS:
"${campaignPrompt}"

LEAD DETAILS:
- Name: ${leadContext.name || 'N/A'}
- Company: ${leadContext.company || 'N/A'}
- Segment/Industry: ${leadContext.segment || 'N/A'}
- Website: ${analysis.url}

MESSAGING ANGLES TO USE (Address these specific issues):
${anglesText}

REQUIREMENTS:
1. Write a catchy, short subject line.
2. Body must be under 150 words.
3. Incorporate at least one of the messaging angles naturally without being overly technical.
4. Tie their website's current state to the campaign goal using the angle.
5. End with a soft, low-friction CTA.

Return STRICTLY as JSON:
{"subject":"...","body":"... use \\n for newlines ..."}
`.trim();

  return generateJson<EmailDraftResult>(prompt, {
    subject: 'Quick question about your website',
    body: `Hi ${leadContext.name || 'there'},\\n\\nI was just looking at ${hostname} and had some ideas on how we could help improve it.\\n\\nAre you open to a quick chat this week?\\n\\nBest,`,
  });
}

/** Classify the intent of an inbound reply email. */
export async function classifyReplyIntent(
  emailText: string,
): Promise<ReplyClassification> {
  const prompt = `
You are an AI sales assistant classifying inbound replies to cold outreach.
Categorize the following email into exactly one intent:

- INTERESTED: wants to talk, meeting, pricing, generally positive
- NOT_INTERESTED: says no, stop emailing, already has an agency
- INFO_REQUEST: asks a question without committing (e.g. "send a case study")
- OOO: out-of-office auto-responder
- UNSUBSCRIBE: explicitly asks to be removed

Email text:
"${emailText.substring(0, 1500)}"

Return STRICTLY as JSON:
{"intent":"INTERESTED|NOT_INTERESTED|INFO_REQUEST|OOO|UNSUBSCRIBE","confidence":0.0}
`.trim();

  return generateJson<ReplyClassification>(prompt, {
    intent: 'INFO_REQUEST',
    confidence: 0.1,
  });
}

/** Generate real or highly realistic B2B prospects based on search criteria. */
export async function generateProspects(
  query: string,
  industry: string,
  location: string,
): Promise<ProspectListResult | null> {
  const prompt = `
You are an expert B2B lead generation researcher.
The user is searching for B2B prospects with the following criteria:
- Keywords / Target: "${query}"
- Industry: "${industry}"
- Location: "${location}"

Generate exactly 5 highly realistic or actual real-world companies that match this criteria.
For each company, provide a realistic decision-maker contact (e.g., CEO, Founder, or Director).
Ensure all emails follow standard business formats (e.g., first.last@company.com or first@company.com).

Return STRICTLY as JSON matching this schema:
{
  "results": [
    {
      "id": "unique-id-here",
      "name": "Company Name",
      "websiteUrl": "https://www.company.com",
      "contactName": "John Doe",
      "email": "john.doe@company.com",
      "industry": "${industry}",
      "location": "${location}"
    }
  ]
}
`.trim();

  try {
    const data = await generateJson<ProspectListResult>(prompt, { results: [] });
    if (data.results && data.results.length > 0) {
      // Ensure unique IDs
      data.results = data.results.map((r, i) => ({
        ...r,
        id: r.id === "unique-id-here" ? `gen_${Date.now()}_${i}` : r.id,
        industry,
        location
      }));
      return data;
    }
    return null;
  } catch (error) {
    console.error('[LLM] generateProspects failed:', error);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
