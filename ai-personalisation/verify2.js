const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3003');

  await page.fill('input#name', 'TestCorp');
  await page.fill('textarea#topic', 'My users need a fast dashboard to see their stats.');

  await page.click('button[type="submit"]');

  // Wait 12 seconds for full video generation and play to the UI segment
  await page.waitForTimeout(12000);

  await page.screenshot({ path: 'screenshot2.png' });

  await browser.close();
})();
