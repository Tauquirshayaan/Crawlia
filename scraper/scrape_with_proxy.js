const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  const proxyList = fs.readFileSync('proxies.txt', 'utf8').trim().split('\n');

  for (const proxyAddr of proxyList) {
    console.log(`Trying proxy: ${proxyAddr}`);
    let browser;
    try {
      browser = await chromium.launch({
        proxy: { server: `http://${proxyAddr}` },
        timeout: 15000
      });
      const page = await browser.newPage();
      page.setDefaultTimeout(15000);

      await page.goto('https://www.swokei.com/resources/help-center', { waitUntil: 'networkidle' });
      
      // Check if it's geo-blocked
      const content = await page.content();
      if (content.includes("Not available in your country")) {
        console.log("Geo-blocked with this proxy.");
        await browser.close();
        continue;
      }

      // If we got here, we bypassed the geo-block and loaded the SPA
      console.log("Success! Proxy worked.");
      await page.screenshot({ path: 'success.png' });
      
      // Wait for content to render (React SPA)
      await page.waitForTimeout(5000);
      
      const html = await page.content();
      fs.writeFileSync('help_center_rendered.html', html);
      console.log("Saved rendered HTML to help_center_rendered.html");
      
      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map(a => ({
          text: a.innerText.trim(),
          href: a.href
        }));
      });
      fs.writeFileSync('help_links.json', JSON.stringify(links, null, 2));

      await browser.close();
      return; // Exit on first success
    } catch (e) {
      console.log(`Proxy ${proxyAddr} failed: ${e.message}`);
      if (browser) await browser.close();
    }
  }
  console.log("All proxies failed.");
}

main();
