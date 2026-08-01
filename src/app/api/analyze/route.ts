/**
 * POST /api/analyze
 * 
 * Quick single-URL analysis for the dashboard's standalone "Analyze" tab.
 * Requires authentication. Does NOT deduct credits (preview/demo mode).
 * Full credit-deducting analysis happens in /api/cron/process-leads as part of campaigns.
 */
import { NextResponse } from "next/server";
import { analyzeWebsite } from "@/lib/analyzer";
import { critiqueWebsite } from "@/lib/llm";
import { getAuthContext, AuthError } from "@/lib/session";

export async function POST(req: Request) {
  try {
    // Auth guard — must be a logged-in user
    await getAuthContext();

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    let validUrl = url;
    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = "https://" + validUrl;
    }
    
    new URL(validUrl); // Throws if invalid

    // Stage 1 Pre-Check — abort early to save time for clearly broken URLs
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const res = await fetch(validUrl, { 
        method: "HEAD", 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);

      if (!res.ok && res.status !== 403 && res.status !== 405) {
        return NextResponse.json(
          { error: `Site returned status ${res.status}. Analysis aborted.` },
          { status: 400 }
        );
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        return NextResponse.json(
          { error: "Site took too long to respond." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "DNS resolution failed or site unreachable." },
        { status: 400 }
      );
    }

    // NOTE: This endpoint does NOT deduct credits.
    // Credits are deducted by /api/cron/process-leads when analyzing leads in campaigns.
    const result = await analyzeWebsite(validUrl);

    if (result.error) {
      return NextResponse.json(
        { error: "Failed to analyze website", details: result.error },
        { status: 500 }
      );
    }

    const critique = await critiqueWebsite(result);

    return NextResponse.json({ ...result, critique });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("API /analyze error:", error);
    return NextResponse.json(
      { error: "Invalid request or internal error" },
      { status: 500 }
    );
  }
}
