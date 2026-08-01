import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { preCheck, analyzeWebsite } from '@/lib/analyzer';
import { critiqueWithVision, generateMessagingAngles, draftEmail } from '@/lib/llm';
import { checkEntitlement, EntitlementError, entitlementErrorResponse } from '@/lib/entitlements';
import { deductCredit, refundCredit } from '@/lib/ledger';
import { trackUsage } from '@/lib/usage';

// ─────────────────────────────────────────────────────────────────────────────
// Weighted scoring (PRD §8.4)
//
// Weights: Design/UX 35% | SEO 25% | Performance 20% | Mobile 20%
// Sub-scores 0–10 each; composite mapped to lead score 1–10.
// Weights live here (not hardcoded in DB) so they can be re-tuned without
// a re-crawl — sub-scores are always persisted raw.
// ─────────────────────────────────────────────────────────────────────────────

interface SubScores {
  designUx: number;     // 0–10 from visual critique (Stage 4)
  seo: number;          // 0–10 from Stage 3 objective signals
  performance: number;  // 0–10 from load time
  mobile: number;       // 0–10 from mobile visual critique
}

const WEIGHTS = { designUx: 0.35, seo: 0.25, performance: 0.20, mobile: 0.20 };

function computeSubScores(
  analysis: Awaited<ReturnType<typeof analyzeWebsite>>,
  visualCritique?: Awaited<ReturnType<typeof critiqueWithVision>>,
): SubScores {
  // ── SEO score (Stage 3 objective signals) ──────────────────────────────────
  let seoScore = 5; // neutral baseline
  if (analysis.seo.title) seoScore += 1;
  if (analysis.seo.description) seoScore += 1;
  if (analysis.seo.h1.length > 0 && analysis.seo.h1.length <= 2) seoScore += 1;
  if (analysis.seo.hasOpenGraph) seoScore += 0.5;
  if (analysis.seo.structuredDataTypes.length > 0) seoScore += 0.5;
  if (analysis.seo.hasCanonical) seoScore += 0.5;
  if (analysis.seo.robotsTxtReachable) seoScore += 0.25;
  if (analysis.seo.sitemapReachable) seoScore += 0.25;
  if (analysis.seo.altTextCoverage > 0.8) seoScore += 0.5;
  if (!analysis.seo.title) seoScore -= 2;
  if (!analysis.seo.description) seoScore -= 1.5;

  // ── Performance score ──────────────────────────────────────────────────────
  const ms = analysis.performance.loadTimeMs;
  let performanceScore: number;
  if (ms === 0) performanceScore = 5; // unknown
  else if (ms < 1500) performanceScore = 9;
  else if (ms < 2500) performanceScore = 7.5;
  else if (ms < 4000) performanceScore = 5.5;
  else if (ms < 6000) performanceScore = 3.5;
  else performanceScore = 1.5;

  // ── Visual / Design / UX / Mobile from Stage 4 LLM critique ───────────────
  const designUx = visualCritique
    ? (visualCritique.heroClarityScore.subscore * 0.3
      + visualCritique.visualHierarchyScore.subscore * 0.25
      + visualCritique.copyQualityScore.subscore * 0.25
      + visualCritique.trustSignalsScore.subscore * 0.1
      + visualCritique.ctaClarityScore.subscore * 0.1)
    : 5;

  const mobile = visualCritique
    ? visualCritique.mobileExperienceScore.subscore
    : (analysis.seo.hasViewportMeta ? 6 : 3); // fallback heuristic

  return {
    designUx: Math.max(0, Math.min(10, designUx)),
    seo: Math.max(0, Math.min(10, seoScore)),
    performance: Math.max(0, Math.min(10, performanceScore)),
    mobile: Math.max(0, Math.min(10, mobile)),
  };
}

function compositeScore(sub: SubScores): { analysisScore: number; leadScore: number } {
  const raw =
    sub.designUx * WEIGHTS.designUx +
    sub.seo * WEIGHTS.seo +
    sub.performance * WEIGHTS.performance +
    sub.mobile * WEIGHTS.mobile;

  const analysisScore = Math.round(Math.max(0, Math.min(10, raw)) * 10); // 0–100
  const leadScore = Math.max(1, Math.min(10, Math.round(raw)));
  return { analysisScore, leadScore };
}

// ─────────────────────────────────────────────────────────────────────────────

export async function POST() {
  try {
    // 1. Find one ENROLLED lead from a RUNNING campaign
    const pendingLead = await prisma.campaignLead.findFirst({
      where: {
        status: 'ENROLLED',
        campaign: { status: 'RUNNING' },
      },
      include: { lead: true, campaign: true },
    });

    if (!pendingLead) {
      return NextResponse.json({ message: 'No pending leads to process.', hasMore: false });
    }

    const { lead, campaign } = pendingLead;
    const workspaceId = campaign.workspaceId;
    console.log(`[process-leads] Processing: ${lead.websiteUrl}`);

    // ── Entitlement pre-check: 1 credit required for website analysis ──────────
    try {
      await checkEntitlement(workspaceId, 'WEBSITE_ANALYSIS', 1);
    } catch (err) {
      if (err instanceof EntitlementError) {
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { status: 'PAUSED' },
        });
        return entitlementErrorResponse(err);
      }
      throw err;
    }

    // 2. Lock this lead against concurrent workers
    await prisma.campaignLead.update({
      where: { id: pendingLead.id },
      data: { status: 'DRAFTING' },
    });

    try {
      // ── Stage 1: Cheap pre-check (no credit charged) ─────────────────────────
      const check = await preCheck(lead.websiteUrl);
      if (!check.passed) {
        console.log(`[process-leads] Stage 1 pre-check failed: ${check.reason} — ${check.detail}`);

        // Route to hold queue with a clear reason code — no credit charged
        await prisma.campaignLead.update({
          where: { id: pendingLead.id },
          data: { status: 'EXCLUDED' },
        });

        const remaining = await prisma.campaignLead.count({
          where: { status: 'ENROLLED', campaign: { status: 'RUNNING' } },
        });

        return NextResponse.json({
          success: true,
          skipped: true,
          reason: check.reason,
          detail: check.detail,
          processedLeadId: lead.id,
          hasMore: remaining > 0,
        });
      }

      // 3. Deduct 1 credit BEFORE analysis (hold the credit)
      await deductCredit(
        workspaceId, 1,
        `analysis_${lead.id}_${Date.now()}`,
        `Website analysis: ${lead.websiteUrl}`,
        'WEBSITE_ANALYSIS',
      );

      // 4. Playwright analysis (Stage 2 + Stage 3)
      const analysisResult = await analyzeWebsite(lead.websiteUrl);

      // Detect parked/bot-wall at render time (Stage 2 heuristic)
      if (analysisResult.preCheckFailed) {
        await refundCredit(
          workspaceId, 1,
          `analysis_${lead.id}_precheck`,
          `Render-time pre-check: ${analysisResult.preCheckFailed}`,
        );
        await prisma.campaignLead.update({
          where: { id: pendingLead.id },
          data: { status: 'EXCLUDED' },
        });
        const remaining = await prisma.campaignLead.count({
          where: { status: 'ENROLLED', campaign: { status: 'RUNNING' } },
        });
        return NextResponse.json({
          success: true,
          skipped: true,
          reason: analysisResult.preCheckFailed,
          processedLeadId: lead.id,
          hasMore: remaining > 0,
        });
      }

      // 5. Stage 4: LLM visual critique using screenshots
      let visualCritique: Awaited<ReturnType<typeof critiqueWithVision>> | undefined;
      if (analysisResult.screenshots) {
        visualCritique = await critiqueWithVision(
          analysisResult.screenshots.desktopBase64,
          analysisResult.screenshots.mobileBase64,
          analysisResult.seo,
          analysisResult.content.text,
          lead.websiteUrl,
        );
      }

      // 6. Weighted composite score (PRD §8.4)
      const subScores = computeSubScores(analysisResult, visualCritique);
      const { analysisScore, leadScore } = compositeScore(subScores);

      // 7. Persist analysis record with raw sub-scores (so weights can be retuned)
      await prisma.analysis.create({
        data: {
          leadId: lead.id,
          score: analysisScore,
          subScores: JSON.stringify(subScores),
          findingsJson: JSON.stringify({
            seo: analysisResult.seo,
            techStack: analysisResult.techStack,
            visualCritique: visualCritique ?? null,
          }),
          assetsJson: JSON.stringify({
            hasScreenshots: !!analysisResult.screenshots,
          }),
          status: analysisResult.error ? 'FAILED' : 'COMPLETED',
        },
      });

      // 8. Build email draft using two-step LLM pipeline (Step A → Step B)
      let subject = 'Quick question';
      let body = 'I noticed your website and would love to connect.';
      let anglesJson: string | null = null;

      if (!analysisResult.error) {
        // Step A: Translate findings to messaging angles
        const angles = await generateMessagingAngles(analysisResult);
        anglesJson = JSON.stringify(angles);

        const rules = (campaign.scheduleRules as Record<string, unknown>) ?? {};
        const goal = (rules.goal as string) || 'Offer our services';
        const language = (rules.language as string) || 'English';
        const personalization = (rules.personalization as Record<string, boolean>) ?? {};

        const personaTips = [
          personalization.includeName && 'use the recipient name naturally if known',
          personalization.includeCompany && 'mention our company name',
          personalization.includeLocation && 'mention our location',
        ]
          .filter(Boolean)
          .join(', ');

        const campaignPrompt = [
          `Campaign goal: ${goal}.`,
          `Write in: ${language}.`,
          personaTips && `Personalization: ${personaTips}.`,
          'Focus on specific improvements we can make to their website.',
        ]
          .filter(Boolean)
          .join(' ');

        // Step B: Draft the email with angles + lead context
        const draft = await draftEmail(campaignPrompt, analysisResult, angles, {
          name: lead.name,
          company: lead.company,
          segment: lead.segment,
        });
        subject = draft.subject;
        body = draft.body;
      }

      // 9. Record usage audit trail
      await trackUsage({
        workspaceId,
        feature: 'WEBSITE_ANALYSIS',
        creditsUsed: 1,
        resourceId: lead.id,
        metadata: { leadUrl: lead.websiteUrl, campaignId: campaign.id },
      });

      // 10. Save email draft + update statuses atomically
      await prisma.$transaction([
        prisma.emailDraft.create({
          data: {
            campaignId: campaign.id,
            leadId: lead.id,
            subject,
            body,
            anglesJson: anglesJson ?? undefined,
            status: 'DRAFT',
          },
        }),
        prisma.lead.update({
          where: { id: lead.id },
          data: { status: 'QUALIFIED', score: leadScore },
        }),
        prisma.campaignLead.update({
          where: { id: pendingLead.id },
          data: { status: 'SCHEDULED' },
        }),
      ]);

      const remaining = await prisma.campaignLead.count({
        where: { status: 'ENROLLED', campaign: { status: 'RUNNING' } },
      });

      return NextResponse.json({
        success: true,
        processedLeadId: lead.id,
        analysisScore,
        leadScore,
        subScores,
        hasMore: remaining > 0,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error(`[process-leads] Failed for lead ${lead.id}:`, message);

      // Refund the credit since analysis failed
      await refundCredit(
        workspaceId, 1,
        `analysis_${lead.id}`,
        `Analysis failed: ${message}`,
      );

      // Release lock so the lead can be retried
      await prisma.campaignLead.update({
        where: { id: pendingLead.id },
        data: { status: 'ENROLLED' },
      });

      return NextResponse.json({ success: false, error: message, hasMore: true });
    }
  } catch (err) {
    console.error('[process-leads] Fatal error:', err);
    return NextResponse.json({ error: 'Failed to process queue' }, { status: 500 });
  }
}
