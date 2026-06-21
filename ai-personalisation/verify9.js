const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');

  await page.fill('input#name', 'TestCorp');
  await page.fill('textarea#topic', 'My users need a fast dashboard to see their stats.');

  await page.click('button[type="submit"]');

  // Wait for the video generator. The mock response takes like 100ms.
  await page.waitForTimeout(1000);

  // Remotion player doesn't start properly in headless due to Audio restrictions or whatever.
  // Instead let's just manually trigger it by pausing and setting currentTime on video element.
  await page.evaluate(() => {
    const v = document.querySelector('video');
    if (v) {
        v.pause();
        v.currentTime = 3.5; // frame 210
    }
  });

  await page.waitForTimeout(500);

  await page.screenshot({ path: 'screenshot9.png' });

  await browser.close();
})();
