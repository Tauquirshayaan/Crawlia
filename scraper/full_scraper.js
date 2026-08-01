const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Simple fetch wrapper to download images
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        resolve(null);
      }
    }).on('error', reject);
  });
}

// Convert simple HTML to markdown manually to avoid extra dependencies, 
// or I can just use `page.evaluate` to get the text or we can just install turndown
async function scrapeAll() {
  let browser;
  try {
    const proxyList = fs.readFileSync('proxies.txt', 'utf8').trim().split('\n');
    const proxyAddr = "135.87.39.23:80"; // The one that worked

    browser = await chromium.launch({
      proxy: { server: `http://${proxyAddr}` },
      timeout: 30000
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(30000);

    const categories = [
      'getting-started',
      'account-billing',
      'campaigns',
      'website-analysis',
      'email-sending',
      'troubleshooting'
    ];

    const baseDir = path.join('G:', 'Crawlia', 'documentation');
    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

    let allArticleLinks = [];

    for (const cat of categories) {
      const catUrl = `https://www.swokei.com/resources/help-center/${cat}`;
      console.log(`Scraping category: ${catUrl}`);
      await page.goto(catUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000); // Wait for React to render

      const links = await page.evaluate((cat) => {
        return Array.from(document.querySelectorAll('a'))
          .filter(a => a.href.includes(`/resources/help-center/${cat}/`) && a.href !== location.href)
          .map(a => a.href);
      }, cat);
      
      const uniqueLinks = [...new Set(links)];
      console.log(`Found ${uniqueLinks.length} articles in ${cat}`);
      uniqueLinks.forEach(link => {
        allArticleLinks.push({ cat, url: link });
      });
    }

    // Now scrape each article
    for (const article of allArticleLinks) {
      console.log(`Scraping article: ${article.url}`);
      await page.goto(article.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);

      // Extract title and content
      const data = await page.evaluate(() => {
        const titleEl = document.querySelector('h1');
        const title = titleEl ? titleEl.innerText.trim() : 'Untitled';
        
        // Find the main content container. Usually prose or a specific wrapper
        // The easiest way is to find the h1's parent or the main tag
        const contentEl = document.querySelector('main') || document.querySelector('article') || document.body;
        
        // We'll extract basic Markdown by walking the DOM of the content area
        // but it's easier to just grab all paragraphs, headings, lists, and images
        const elements = Array.from(contentEl.querySelectorAll('h1, h2, h3, h4, p, li, img, pre, code'));
        
        let md = '';
        elements.forEach(el => {
          if (el.tagName === 'H1' && el === titleEl) return;
          if (el.tagName === 'H1') md += `# ${el.innerText}\n\n`;
          if (el.tagName === 'H2') md += `## ${el.innerText}\n\n`;
          if (el.tagName === 'H3') md += `### ${el.innerText}\n\n`;
          if (el.tagName === 'P') md += `${el.innerText}\n\n`;
          if (el.tagName === 'LI') md += `- ${el.innerText}\n`;
          if (el.tagName === 'IMG') md += `![${el.alt || 'image'}](${el.src})\n\n`;
        });
        
        const images = Array.from(contentEl.querySelectorAll('img')).map(img => img.src);

        return { title, md, images };
      });

      const catDir = path.join(baseDir, article.cat);
      if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });

      // Clean title for filename
      const safeTitle = data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filepath = path.join(catDir, `${safeTitle}.md`);
      fs.writeFileSync(filepath, `# ${data.title}\n\n${data.md}`);
      
      console.log(`Saved ${filepath}`);
    }

    console.log("Finished scraping all guides.");
    await browser.close();

  } catch (err) {
    console.error(err);
    if (browser) await browser.close();
  }
}

scrapeAll();
