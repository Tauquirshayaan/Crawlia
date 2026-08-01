const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function scrapeRemaining() {
  const proxyAddr = "135.87.39.23:80"; // The one that worked

  let browser;
  try {
    browser = await chromium.launch({
      proxy: { server: `http://${proxyAddr}` },
      timeout: 30000
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(30000);

    const remaining = [
      { cat: 'troubleshooting', url: 'https://www.swokei.com/resources/help-center/troubleshooting/mailbox-connection-errors' },
      { cat: 'troubleshooting', url: 'https://www.swokei.com/resources/help-center/troubleshooting/campaign-paused-automatically' },
      { cat: 'troubleshooting', url: 'https://www.swokei.com/resources/help-center/troubleshooting/lead-replies-not-syncing' },
      { cat: 'troubleshooting', url: 'https://www.swokei.com/resources/help-center/troubleshooting/missing-website-analysis-data' }
    ];

    const baseDir = path.join('G:', 'Crawlia', 'documentation');

    for (const article of remaining) {
      console.log(`Scraping article: ${article.url}`);
      try {
        await page.goto(article.url, { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        const data = await page.evaluate(() => {
          const titleEl = document.querySelector('h1');
          const title = titleEl ? titleEl.innerText.trim() : 'Untitled';
          
          const contentEl = document.querySelector('main') || document.querySelector('article') || document.body;
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
          
          return { title, md };
        });

        const catDir = path.join(baseDir, article.cat);
        const safeTitle = data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filepath = path.join(catDir, `${safeTitle}.md`);
        fs.writeFileSync(filepath, `# ${data.title}\n\n${data.md}`);
        
        console.log(`Saved ${filepath}`);
      } catch (err) {
        console.error(`Failed ${article.url}:`, err.message);
      }
    }

    console.log("Finished scraping remaining guides.");
  } finally {
    if (browser) await browser.close();
  }
}

scrapeRemaining();
