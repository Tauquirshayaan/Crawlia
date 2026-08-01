const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log("Navigating to https://webproxy.to/");
  await page.goto('https://webproxy.to/', { waitUntil: 'networkidle' });

  // Webproxy usually has an input field for URL and a form to submit
  await page.fill('input[type="url"]', 'https://help.swokei.com/');
  // Some webproxies use 'form' submit or a 'Go' button
  await page.keyboard.press('Enter');
  
  console.log("Waiting for Swokei help to load via proxy...");
  await page.waitForTimeout(5000); // Give it time to load

  const html = await page.content();
  fs.writeFileSync('proxy_help.html', html);
  
  await page.screenshot({path: 'proxy_test.png'});

  await browser.close();
})();
