import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapeResult {
  url: string;
  title: string;
  metaDescription: string;
  textContent: string;
  success: boolean;
  error?: string;
}

export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  // Ensure url has http/https
  let normalizedUrl = url;
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  try {
    const response = await axios.get(normalizedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, noscript, iframe, img, svg').remove();

    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
    
    // Extract text and clean up whitespace
    let textContent = $('body').text();
    textContent = textContent.replace(/\s+/g, ' ').trim();

    // Limit text to ~3000 chars for LLM context window safety
    if (textContent.length > 3000) {
      textContent = textContent.substring(0, 3000) + '...';
    }

    return {
      url: normalizedUrl,
      title,
      metaDescription,
      textContent,
      success: true
    };
  } catch (error: any) {
    console.error(`Error scraping ${normalizedUrl}:`, error.message);
    return {
      url: normalizedUrl,
      title: '',
      metaDescription: '',
      textContent: '',
      success: false,
      error: error.message
    };
  }
}
