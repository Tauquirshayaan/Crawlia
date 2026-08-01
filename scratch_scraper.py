import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        print("Navigating to https://help.swokei.com/...")
        await page.goto("https://help.swokei.com/", wait_until="networkidle")
        
        # Get all links
        links = await page.evaluate('''() => {
            return Array.from(document.querySelectorAll('a')).map(a => ({
                text: a.innerText.trim(),
                href: a.href
            }));
        }''')
        
        print(f"Found {len(links)} links:")
        for link in links:
            if link['href'].startswith('https://help.swokei.com'):
                print(f"- {link['text']}: {link['href']}")
                
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
