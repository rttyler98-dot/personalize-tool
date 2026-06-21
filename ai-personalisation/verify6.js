const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');

  await page.fill('input#name', 'TestCorp');
  await page.fill('textarea#topic', 'My users need a fast dashboard to see their stats.');

  await page.click('button[type="submit"]');

  // Wait longer for the generation to finish... since it might be slow in this env
  await page.waitForTimeout(10000);

  await page.screenshot({ path: 'screenshot6.png' });

  await browser.close();
})();
