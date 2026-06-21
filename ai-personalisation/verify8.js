const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');

  await page.fill('input#name', 'TestCorp');
  await page.fill('textarea#topic', 'My users need a fast dashboard to see their stats.');

  await page.click('button[type="submit"]');

  // Wait 20 seconds.
  // It's generating from API, then playing video. The 2nd sequence is at 120-300 frames (2-5s).
  // Total wait about 8 seconds
  await page.waitForTimeout(8000);

  await page.screenshot({ path: 'screenshot8.png' });

  await browser.close();
})();
