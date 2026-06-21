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

  // Wait for the ad label to appear indicating video is ready
  await page.waitForSelector('text=Previewing 7s Ad for DevTool', { timeout: 15000 });

  // wait 2s for layout shift
  await page.waitForTimeout(2000);

  // set video current time to 6.5s to see the CTA mockup
  await page.evaluate(() => {
    const video = document.querySelector('video');
    if (video) {
        video.pause();
        // The total video is 7 seconds, so 6.5s is well within the 3rd CTA sequence (which starts at frame 300 / 5 seconds)
        video.currentTime = 6.5;
    }
  });

  // Wait a bit to let the video frame render
  await page.waitForTimeout(1000);

  // Take a screenshot
  await page.screenshot({ path: 'screenshot17.png' });

  await browser.close();
})();
