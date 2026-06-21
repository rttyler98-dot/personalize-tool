const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');

  await page.fill('input#name', 'TestCorp');
  await page.fill('textarea#topic', 'My users need a fast dashboard to see their stats.');

  await page.click('button[type="submit"]');

  // Wait for the video wrapper element to appear
  await page.waitForSelector('video', { timeout: 15000 });

  // Give it a moment to play
  await page.waitForTimeout(3500);

  await page.screenshot({ path: 'screenshot7.png' });

  await browser.close();
})();
