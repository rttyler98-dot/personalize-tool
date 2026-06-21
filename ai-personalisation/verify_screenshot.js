const { chromium } = require('playwright');
const path = require('path');
const { spawn, execSync } = require('child_process');

try {
  execSync('kill $(lsof -t -i :3001) 2>/dev/null');
} catch (e) {}

(async () => {
  console.log("Starting Next.js server...");
  const serverProcess = spawn('npm', ['run', 'dev', '--', '-p', '3001'], {
    stdio: 'pipe',
    detached: true,
  });

  serverProcess.stdout.on('data', (data) => {
     console.log(`[Next.js]: ${data.toString().trim()}`);
  });

  await new Promise(resolve => setTimeout(resolve, 5000));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1024 }
  });

  const page = await context.newPage();

  try {
    console.log("Navigating to http://localhost:3001");
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Take a screenshot of the new landing page
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshot_landing.png', fullPage: true });

    console.log("Screenshot taken: screenshot_landing.png");
  } catch (err) {
    console.error("Error during test:", err);
  } finally {
    await context.close();
    await browser.close();

    try {
        process.kill(-serverProcess.pid);
    } catch(e){}
  }
})();
