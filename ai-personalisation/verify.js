const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3003');

  await page.fill('input#name', 'TestCorp');
  await page.fill('textarea#topic', 'My users need a fast dashboard to see their stats.');

  await page.click('button[type="submit"]');

  // Wait for generative UI or Remotion player
  await page.waitForTimeout(5000);

  // Playwright can interact with elements
  await page.evaluate(() => {
    // Jump to the middle of the video (e.g., 3.5 seconds)
    // Actually we can just wait 3.5 seconds since it autoPlays
  });

  await page.screenshot({ path: 'screenshot.png' });

  await browser.close();
})();
