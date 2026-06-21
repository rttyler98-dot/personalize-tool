const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');

  await page.fill('input#name', 'TestCorp');
  await page.fill('textarea#topic', 'My users need a fast dashboard to see their stats.');

  await page.click('button[type="submit"]');

  // Wait 3 seconds, should be past the loading state and into the beginning of the video
  await page.waitForTimeout(4000);

  // The UI starts at frame 120 (2 seconds in). So if we wait 4 seconds we should see it

  await page.screenshot({ path: 'screenshot5.png' });

  await browser.close();
})();
