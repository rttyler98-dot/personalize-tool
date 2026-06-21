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

  // Wait a bit for the state to update
  await page.waitForTimeout(500);

  // Take a screenshot
  await page.screenshot({ path: 'screenshot13.png' });

  const nameVal = await page.$eval('input#name', el => el.value);
  const topicVal = await page.$eval('textarea#topic', el => el.value);

  console.log(`Name input: ${nameVal}`);
  console.log(`Topic textarea: ${topicVal}`);

  await browser.close();
})();
