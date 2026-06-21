const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3003');

  await page.fill('input#name', 'TestCorp');
  await page.fill('textarea#topic', 'My users need a fast dashboard to see their stats.');

  await page.click('button[type="submit"]');

  // Wait for the response and player to load
  await page.waitForTimeout(5000);

  // Take a full page screenshot
  await page.screenshot({ path: 'screenshot4.png', fullPage: true });

  // Use Remotion Player's API or just wait for the right visual moment
  // Since we don't have access to remotion player internal API here, let's just click pause and set the frame roughly

  await browser.close();
})();
