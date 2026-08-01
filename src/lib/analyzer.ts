/**
 * src/lib/analyzer.ts — Multi-stage website analysis engine.
 *
 * Implements the full PRD §8.3 five-stage pipeline:
 *   Stage 1 — Cheap pre-check (DNS, HTTP status, parked-domain heuristic)
 *   Stage 2 — Headless render at desktop + mobile viewports, screenshots
 *   Stage 3 — Objective signal extraction (rule-based, no LLM)
 *   Stage 4 — LLM visual critique via multimodal Gemini call (in llm.ts)
 *   Stage 5 — Composite score (in process-leads/route.ts)
 *
 * Credits are charged ONLY after Stage 4 succeeds. A Stage 1/2 failure
 * returns { preCheckFailed: true } and must never reach a charge.
 */

import dns from 'dns/promises';
import { chromium } from 'playwright';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PreCheckFailureReason =
  | 'DNS_FAIL'
  | 'HTTP_ERROR'
  | 'TIMEOUT'
  | 'PARKED_DOMAIN'
  | 'BOT_WALL';

export type PreCheckResult =
  | { passed: true }
  | { passed: false; reason: PreCheckFailureReason; detail: string };

export interface SeoSignals {
  title: string | null;
  description: string | null;
  h1: string[];
  h2: string[];
  hasOpenGraph: boolean;
  structuredDataTypes: string[];
  hasCanonical: boolean;
  hasViewportMeta: boolean;
  /** 0.0–1.0 — ratio of <img> tags that have a non-empty alt attribute */
  altTextCoverage: number;
  robotsTxtReachable: boolean;
  sitemapReachable: boolean;
}

export interface PerformanceSignals {
  /** Wall-clock ms from navigation start to networkidle */
  loadTimeMs: number;
  /** Approximate total transferred bytes from all network responses */
  totalPageWeightBytes: number;
}

export interface TechStack {
  /** e.g. ['WordPress', 'WooCommerce'] */
  detected: string[];
}

export interface ContentSignals {
  text: string;
  links: number;
  images: number;
  imagesWithoutAlt: number;
}

/** Base64-encoded PNG screenshots, ready to pass to Gemini multimodal */
export interface Screenshots {
  desktopBase64: string;
  mobileBase64: string;
}

export interface AnalysisResult {
  url: string;
  seo: SeoSignals;
  performance: PerformanceSignals;
  techStack: TechStack;
  content: ContentSignals;
  screenshots?: Screenshots;
  /** Set when Stage 1 fails — credits must NOT be charged */
  preCheckFailed?: PreCheckFailureReason;
  error?: string;
}

// ─── Parked-domain heuristics ─────────────────────────────────────────────────

const PARKED_SIGNATURES = [
  'this domain is for sale',
  'buy this domain',
  'domain is parked',
  'parked by',
  'sedo.com',
  'godaddy.com/domainqueries',
  'hugedomains.com',
  'afternic',
  'dan.com',
  'efty.com',
  'undeveloped',
];

function isParked(bodyText: string): boolean {
  const lower = bodyText.toLowerCase();
  return PARKED_SIGNATURES.some((sig) => lower.includes(sig));
}

// ─── Bot-wall heuristics ──────────────────────────────────────────────────────

const BOT_WALL_SIGNATURES = [
  'enable javascript and cookies',
  'please enable cookies',
  'ddos-guard',
  'cloudflare ray id',
  'access denied',
  'security check',
  'checking your browser',
  'human verification',
];

function hasBotWall(bodyText: string): boolean {
  const lower = bodyText.toLowerCase();
  return BOT_WALL_SIGNATURES.some((sig) => lower.includes(sig));
}

// ─── Tech-stack fingerprinting ────────────────────────────────────────────────

const TECH_PATTERNS: Array<{ name: string; patterns: string[] }> = [
  { name: 'WordPress', patterns: ['/wp-content/', '/wp-includes/', 'wp-json'] },
  { name: 'WooCommerce', patterns: ['woocommerce', '/wc-api/'] },
  { name: 'Shopify', patterns: ['cdn.shopify.com', 'Shopify.theme', 'shopify-section'] },
  { name: 'Webflow', patterns: ['webflow.com/css', 'data-wf-page', 'webflow.js'] },
  { name: 'Wix', patterns: ['static.wixstatic.com', 'wix-warmup-data', '_wix_'] },
  { name: 'Squarespace', patterns: ['squarespace.com', 'static1.squarespace', 'sqsp'] },
  { name: 'Framer', patterns: ['framerusercontent.com', 'framer.com/events'] },
  { name: 'Drupal', patterns: ['drupal.org/files', 'Drupal.settings', '/sites/default/'] },
  { name: 'Joomla', patterns: ['joomla', '/media/jui/', 'com_content'] },
  { name: 'Ghost', patterns: ['ghost.io', 'ghost-sdk.min.js', 'content/ghost/'] },
  { name: 'HubSpot', patterns: ['hs-scripts.com', 'hubspot.com/analytics'] },
  { name: 'Next.js', patterns: ['__NEXT_DATA__', '_next/static', 'next/router'] },
  { name: 'Nuxt.js', patterns: ['__nuxt', '_nuxt/', 'nuxt.config'] },
  { name: 'React', patterns: ['react-dom', '__reactFiber', 'data-reactroot'] },
];

function detectTechStack(pageSource: string): string[] {
  const detected: string[] = [];
  for (const tech of TECH_PATTERNS) {
    if (tech.patterns.some((p) => pageSource.includes(p))) {
      detected.push(tech.name);
    }
  }
  return detected;
}

// ─── Stage 1: Cheap pre-check ─────────────────────────────────────────────────

export async function preCheck(url: string): Promise<PreCheckResult> {
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return { passed: false, reason: 'DNS_FAIL', detail: 'Invalid URL format' };
  }

  // DNS lookup
  try {
    await dns.lookup(hostname);
  } catch {
    return { passed: false, reason: 'DNS_FAIL', detail: `DNS lookup failed for ${hostname}` };
  }

  // HTTP head request — fast status check, follow up to 3 redirects
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);

    let finalStatus = 0;
    try {
      const res = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ClearpitchBot/1.0)' },
      });
      finalStatus = res.status;
    } finally {
      clearTimeout(timeout);
    }

    if (finalStatus >= 400 && finalStatus !== 405) {
      // 405 Method Not Allowed is fine — server rejected HEAD but is alive; GET will work
      return { passed: false, reason: 'HTTP_ERROR', detail: `HTTP ${finalStatus}` };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('abort') || message.includes('timeout')) {
      return { passed: false, reason: 'TIMEOUT', detail: 'Pre-check request timed out in 5s' };
    }
    return { passed: false, reason: 'HTTP_ERROR', detail: message };
  }

  return { passed: true };
}

// ─── Utility: Probe a URL reachability ───────────────────────────────────────

async function probeUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(5_000),
    });
    return res.status < 400;
  } catch {
    return false;
  }
}

// ─── Empty/fallback signal objects ───────────────────────────────────────────

const EMPTY_SEO: SeoSignals = {
  title: null,
  description: null,
  h1: [],
  h2: [],
  hasOpenGraph: false,
  structuredDataTypes: [],
  hasCanonical: false,
  hasViewportMeta: false,
  altTextCoverage: 0,
  robotsTxtReachable: false,
  sitemapReachable: false,
};

// ─── Main analysis function ───────────────────────────────────────────────────

/**
 * Run the full Stage 2–3 analysis pipeline.
 * Callers MUST call preCheck() first and bail out if it fails.
 *
 * Returns screenshots as Base64 PNG strings for passing to the LLM.
 */
export async function analyzeWebsite(url: string): Promise<AnalysisResult> {
  const browser = await chromium.launch({ headless: true });

  try {
    // ── Stage 3 auxiliary checks that don't need the browser ──────────────────
    let origin: string;
    try {
      origin = new URL(url).origin;
    } catch {
      origin = url;
    }

    const [robotsTxtReachable, sitemapReachable] = await Promise.all([
      probeUrl(`${origin}/robots.txt`),
      probeUrl(`${origin}/sitemap.xml`),
    ]);

    // ── Stage 2: Render at desktop + mobile viewports ─────────────────────────
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    });
    const desktopPage = await desktopContext.newPage();

    // Track total page weight
    let totalPageWeightBytes = 0;
    desktopPage.on('response', (response) => {
      const len = parseInt(response.headers()['content-length'] ?? '0', 10);
      if (!isNaN(len)) totalPageWeightBytes += len;
    });

    const startTime = Date.now();
    await desktopPage.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
    const loadTimeMs = Date.now() - startTime;

    // ── Stage 3: Objective signal extraction ─────────────────────────────────
    const [
      title,
      description,
      h1,
      h2,
      hasOpenGraph,
      structuredDataTypes,
      hasCanonical,
      hasViewportMeta,
      altStats,
      links,
      images,
      pageSource,
      bodyText,
    ] = await Promise.all([
      desktopPage.title().catch(() => null),
      desktopPage.locator('meta[name="description"]').getAttribute('content').catch(() => null),
      desktopPage.$$eval('h1', (els) => els.map((el) => el.textContent?.trim()).filter(Boolean) as string[]).catch(() => [] as string[]),
      desktopPage.$$eval('h2', (els) => els.map((el) => el.textContent?.trim()).filter(Boolean) as string[]).catch(() => [] as string[]),
      desktopPage.$$eval('meta[property^="og:"]', (els) => els.length > 0).catch(() => false),
      desktopPage.$$eval('script[type="application/ld+json"]', (els) => {
        const types = new Set<string>();
        for (const el of els) {
          try {
            const json = JSON.parse(el.textContent?.trim() || '{}');
            const extract = (obj: unknown): void => {
              if (!obj || typeof obj !== 'object') return;
              const o = obj as Record<string, unknown>;
              if (o['@type']) types.add(String(o['@type']));
              if (Array.isArray(o['@graph'])) (o['@graph'] as unknown[]).forEach(extract);
            };
            extract(json);
          } catch { /* ignore malformed JSON-LD */ }
        }
        return Array.from(types);
      }).catch(() => [] as string[]),
      desktopPage.locator('link[rel="canonical"]').count().then((n) => n > 0).catch(() => false),
      desktopPage.locator('meta[name="viewport"]').count().then((n) => n > 0).catch(() => false),
      desktopPage.$$eval('img', (imgs) => ({
        total: imgs.length,
        withAlt: imgs.filter((img) => img.getAttribute('alt') && img.getAttribute('alt')!.trim().length > 0).length,
      })).catch(() => ({ total: 0, withAlt: 0 })),
      desktopPage.locator('a').count().catch(() => 0),
      desktopPage.locator('img').count().catch(() => 0),
      desktopPage.content().catch(() => ''),
      desktopPage.evaluate(() => document.body?.innerText?.substring(0, 5000) ?? '').catch(() => ''),
    ]);

    // Parked/bot-wall detection on rendered text
    if (isParked(bodyText)) {
      return {
        url,
        seo: EMPTY_SEO,
        performance: { loadTimeMs, totalPageWeightBytes },
        techStack: { detected: [] },
        content: { text: bodyText.substring(0, 500), links: 0, images: 0, imagesWithoutAlt: 0 },
        preCheckFailed: 'PARKED_DOMAIN',
      };
    }

    if (hasBotWall(bodyText)) {
      return {
        url,
        seo: EMPTY_SEO,
        performance: { loadTimeMs, totalPageWeightBytes },
        techStack: { detected: [] },
        content: { text: bodyText.substring(0, 500), links: 0, images: 0, imagesWithoutAlt: 0 },
        preCheckFailed: 'BOT_WALL',
      };
    }

    // Tech-stack fingerprinting
    const techDetected = detectTechStack(pageSource);

    // Alt-text coverage
    const altTextCoverage = altStats.total > 0 ? altStats.withAlt / altStats.total : 1;

    // ── Screenshots (desktop) ─────────────────────────────────────────────────
    const desktopScreenshot = await desktopPage.screenshot({ fullPage: false, type: 'png' });
    const desktopBase64 = desktopScreenshot.toString('base64');
    await desktopContext.close();

    // ── Mobile viewport ───────────────────────────────────────────────────────
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(url, { waitUntil: 'networkidle', timeout: 25_000 });
    const mobileScreenshot = await mobilePage.screenshot({ fullPage: false, type: 'png' });
    const mobileBase64 = mobileScreenshot.toString('base64');
    await mobileContext.close();

    return {
      url,
      seo: {
        title,
        description,
        h1,
        h2,
        hasOpenGraph,
        structuredDataTypes,
        hasCanonical,
        hasViewportMeta,
        altTextCoverage,
        robotsTxtReachable,
        sitemapReachable,
      },
      performance: { loadTimeMs, totalPageWeightBytes },
      techStack: { detected: techDetected },
      content: { text: bodyText, links, images, imagesWithoutAlt: altStats.total - altStats.withAlt },
      screenshots: { desktopBase64, mobileBase64 },
    };
  } catch (err) {
    console.error(`[analyzer] Error scraping ${url}:`, err);
    return {
      url,
      seo: EMPTY_SEO,
      performance: { loadTimeMs: 0, totalPageWeightBytes: 0 },
      techStack: { detected: [] },
      content: { text: '', links: 0, images: 0, imagesWithoutAlt: 0 },
      error: err instanceof Error ? err.message : 'Unknown scrape error',
    };
  } finally {
    await browser.close();
  }
}
