/**
 * POST /api/analyze/standalone
 *
 * Real analysis for the dashboard's standalone "Analyze" tab.
 * Runs the full Stage 1–4 pipeline (pre-check → Playwright → LLM critique).
 * Does NOT deduct credits (preview/demo mode — credits only consumed in campaigns).
 */
import { NextResponse, NextRequest } from "next/server";
import { preCheck, analyzeWebsite } from "@/lib/analyzer";
import { critiqueWithVision, generateMessagingAngles } from "@/lib/llm";
import { getAuthContext, AuthError } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    // Auth guard
    await getAuthContext();

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let validUrl = url as string;
    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = "https://" + validUrl;
    }

    try {
      new URL(validUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // ── Stage 1: Pre-check ────────────────────────────────────────────────────
    const check = await preCheck(validUrl);
    if (!check.passed) {
      return NextResponse.json(
        {
          error: `Site could not be reached: ${check.reason}`,
          detail: check.detail,
          preCheckFailed: check.reason,
        },
        { status: 422 }
      );
    }

    // ── Stage 2 + 3: Playwright analysis ─────────────────────────────────────
    const analysisResult = await analyzeWebsite(validUrl);

    if (analysisResult.error) {
      return NextResponse.json(
        { error: "Failed to analyze website", details: analysisResult.error },
        { status: 500 }
      );
    }

    if (analysisResult.preCheckFailed) {
      return NextResponse.json(
        {
          error: `Site detected as ${analysisResult.preCheckFailed}`,
          preCheckFailed: analysisResult.preCheckFailed,
        },
        { status: 422 }
      );
    }

    // ── Stage 4: LLM visual critique (only if screenshots are available) ──────
    let visualCritique = null;
    if (analysisResult.screenshots) {
      visualCritique = await critiqueWithVision(
        analysisResult.screenshots.desktopBase64,
        analysisResult.screenshots.mobileBase64,
        analysisResult.seo,
        analysisResult.content.text,
        validUrl
      );
    }

    // ── Messaging angles for display ─────────────────────────────────────────
    const angles = await generateMessagingAngles(analysisResult);

    // ── Weighted composite score ──────────────────────────────────────────────
    // Design/UX 35% | SEO 25% | Performance 20% | Mobile 20%
    const seoRaw = (() => {
      let s = 5;
      if (analysisResult.seo.title) s += 1;
      if (analysisResult.seo.description) s += 1;
      if (analysisResult.seo.h1.length > 0) s += 1;
      if (analysisResult.seo.hasOpenGraph) s += 0.5;
      if (analysisResult.seo.structuredDataTypes.length > 0) s += 0.5;
      if (analysisResult.seo.hasCanonical) s += 0.5;
      if (analysisResult.seo.robotsTxtReachable) s += 0.25;
      if (analysisResult.seo.sitemapReachable) s += 0.25;
      if (!analysisResult.seo.title) s -= 2;
      if (!analysisResult.seo.description) s -= 1.5;
      return Math.max(0, Math.min(10, s));
    })();

    const ms = analysisResult.performance.loadTimeMs;
    const perfRaw =
      ms === 0 ? 5 :
      ms < 1500 ? 9 :
      ms < 2500 ? 7.5 :
      ms < 4000 ? 5.5 :
      ms < 6000 ? 3.5 : 1.5;

    const designRaw = visualCritique
      ? (visualCritique.heroClarityScore.subscore * 0.3
        + visualCritique.visualHierarchyScore.subscore * 0.25
        + visualCritique.copyQualityScore.subscore * 0.25
        + visualCritique.trustSignalsScore.subscore * 0.1
        + visualCritique.ctaClarityScore.subscore * 0.1)
      : 5;

    const mobileRaw = visualCritique
      ? visualCritique.mobileExperienceScore.subscore
      : (analysisResult.seo.hasViewportMeta ? 6 : 3);

    const compositeRaw =
      designRaw * 0.35 + seoRaw * 0.25 + perfRaw * 0.20 + mobileRaw * 0.20;
    const score = Math.round(Math.max(0, Math.min(10, compositeRaw)) * 10); // 0–100

    return NextResponse.json({
      url: validUrl,
      score,
      sub_scores: {
        design: Math.round(designRaw * 10) / 10,
        seo: Math.round(seoRaw * 10) / 10,
        performance: Math.round(perfRaw * 10) / 10,
        mobile: Math.round(mobileRaw * 10) / 10,
      },
      seo: analysisResult.seo,
      performance: analysisResult.performance,
      techStack: analysisResult.techStack,
      content: {
        links: analysisResult.content.links,
        images: analysisResult.content.images,
        imagesWithoutAlt: analysisResult.content.imagesWithoutAlt,
      },
      visualCritique,
      suggested_angles: angles.map((a) => a.angle),
      findings: visualCritique
        ? Object.entries(visualCritique)
            .flatMap(([key, val]) =>
              (val as { findings: string[] }).findings.map((f) => ({
                pillar: key.replace("Score", ""),
                finding: f,
              }))
            )
            .slice(0, 6)
        : [],
      completed_at: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Standalone analyze error:", error);
    return NextResponse.json({ error: "Failed to analyze website" }, { status: 500 });
  }
}
