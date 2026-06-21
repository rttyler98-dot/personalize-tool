const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  // Wait for the preset button to be visible
  await page.waitForSelector('text=SaaS Analytics', { state: 'visible' });

  // Click the "DevTool" preset
  await page.click('text=DevTool');

  // Wait a bit for the state to update
  await page.waitForTimeout(500);

  // Take a screenshot
  await page.screenshot({ path: 'screenshot11.png' });

  await browser.close();
})();
