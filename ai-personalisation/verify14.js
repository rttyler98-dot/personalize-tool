const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  // Wait for the preset button to be visible
  await page.waitForSelector('text=DevTool', { state: 'visible' });

  // wait 2s for hydration
  await page.waitForTimeout(2000);

  // Click the "DevTool" preset
  await page.click('text=DevTool');

  // Click generate
  await page.click('button[type="submit"]');

  // Wait for the UI block to be rendered (wait up to 10s as it calls our mock api)
  await page.waitForSelector('.bg-neutral-900', { timeout: 15000 });

  // wait 2s for layout shift
  await page.waitForTimeout(2000);

  // set video current time to 4s to see the Generative UI mockup
  await page.evaluate(() => {
    const video = document.querySelector('video');
    if (video) {
        video.pause();
        video.currentTime = 4.0;
    }
  });

  // Wait a bit to let the video frame render
  await page.waitForTimeout(1000);

  // Take a screenshot
  await page.screenshot({ path: 'screenshot14.png' });

  await browser.close();
})();
