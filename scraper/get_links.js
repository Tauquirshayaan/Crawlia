const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log("Navigating to https://help.swokei.com/");
  await page.goto('https://help.swokei.com/', { waitUntil: 'networkidle' });

  // Get all links on the page that could be categories or guides
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .map(a => ({
        text: a.innerText.trim().replace(/\n/g, ' '),
        href: a.href
      }))
      .filter(l => l.href.startsWith('https://help.swokei.com/') && l.text);
  });

  console.log(`Found ${links.length} total valid links.`);
  
  fs.writeFileSync('links.json', JSON.stringify(links, null, 2));

  await browser.close();
})();
