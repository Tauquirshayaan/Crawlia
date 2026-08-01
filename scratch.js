const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the Wayback machine snapshot of Swokei
    await page.goto('https://web.archive.org/web/20260715000000/https://swokei.com', { waitUntil: 'networkidle', timeout: 60000 });
    
    // Remove the wayback machine top header so we can see the real page
    await page.evaluate(() => {
      const header = document.getElementById('wm-ipp-base');
      if (header) header.remove();
    });

    // Extract headings
    const headings = await page.evaluate(() => {
      const h1s = Array.from(document.querySelectorAll('h1')).map(el => el.innerText.trim());
      const h2s = Array.from(document.querySelectorAll('h2')).map(el => el.innerText.trim());
      const h3s = Array.from(document.querySelectorAll('h3')).map(el => el.innerText.trim());
      return { h1s, h2s, h3s };
    });
    
    // Extract text in sections
    const sections = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('section, div')).map(el => el.innerText.trim()).filter(text => text.length > 50).slice(0, 10);
    });

    console.log("HEADINGS:", JSON.stringify(headings, null, 2));
    
  } catch (err) {
    console.error("Error scraping:", err);
  } finally {
    await browser.close();
  }
})();
