import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, AuthError } from "@/lib/session";

// ── Deduplication helper (shared with campaigns/route.ts) ────────────────────
// dedupeKey = normalized root domain (strips protocol, www, path, trailing slash)
// or email as fallback — ensures we never create duplicate leads for the same site.
function normalizeDedupeKey(url: string, email?: string): string {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const host = parsed.hostname.replace(/^www\./, "");
    return host.toLowerCase();
  } catch {
    return email?.toLowerCase() ?? url.toLowerCase();
  }
}

export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await getAuthContext();

    const body = await req.json();
    const { leads } = body;

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: "No leads provided" }, { status: 400 });
    }

    let imported = 0;
    let skipped = 0;

    for (const lead of leads as Array<{
      name?: string;
      email?: string;
      websiteUrl?: string;
      company?: string;
      segment?: string;
    }>) {
      const websiteUrl = lead.websiteUrl || "";
      const dedupeKey = normalizeDedupeKey(websiteUrl, lead.email);

      try {
        await prisma.lead.upsert({
          where: { workspaceId_dedupeKey: { workspaceId, dedupeKey } },
          create: {
            workspaceId,
            name: lead.name || null,
            email: lead.email || null,
            company: lead.company || null,
            websiteUrl: websiteUrl || "unknown",
            segment: lead.segment || null,
            dedupeKey,
            status: "NEW",
            score: 0,
          },
          update: {
            // On re-import: update contact info, preserve status/score
            name: lead.name || undefined,
            email: lead.email || undefined,
            company: lead.company || undefined,
            segment: lead.segment || undefined,
          },
        });
        imported++;
      } catch {
        // Skip individual lead errors without failing the whole batch
        skipped++;
      }
    }

    return NextResponse.json({ success: true, imported, skipped });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Lead import error:", error);
    return NextResponse.json({ error: "Failed to import leads" }, { status: 500 });
  }
}
