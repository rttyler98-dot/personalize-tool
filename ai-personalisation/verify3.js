const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3003');

  await page.fill('input#name', 'TestCorp');
  await page.fill('textarea#topic', 'My users need a fast dashboard to see their stats.');

  await page.click('button[type="submit"]');

  // Wait for the video to be generated
  await page.waitForTimeout(5000);

  // Playwright can interact with elements
  await page.evaluate(() => {
    const video = document.querySelector('video');
    if(video) {
        // Pause and set time to 3.5 seconds
        video.pause();
        video.currentTime = 3.5;
    }
  });

  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'screenshot3.png' });

  await browser.close();
})();
