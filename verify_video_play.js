const { chromium } = require('playwright');
const path = require('path');
const { spawn, execSync } = require('child_process');

// Kill any existing Next.js server on port 3000
try {
  execSync('kill $(lsof -t -i :3000) 2>/dev/null');
} catch (e) {
  // It's okay if it fails (no process running)
}

(async () => {
  console.log("Starting Next.js server...");
  const serverProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    detached: true,
  });

  serverProcess.stdout.on('data', (data) => {
     console.log(`[Next.js]: ${data.toString().trim()}`);
  });

  // Give the server time to boot completely
  console.log("Waiting for server to be ready (10s)...");
  await new Promise(resolve => setTimeout(resolve, 10000));

  console.log("Launching browser and starting video recording...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/',
      size: { width: 1280, height: 720 },
    }
  });

  const page = await context.newPage();

  try {
    console.log("Navigating to http://localhost:3000");
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Fill in the form using more general selectors just in case
    await page.waitForSelector('input', { timeout: 30000 });
    await page.fill('input[placeholder="e.g. Acme Corp"]', 'Vercel');
    await page.fill('input[placeholder="e.g. Alice"]', 'Lee');
    await page.fill('input[placeholder="e.g. We need a faster way to deploy code"]', 'I want the fastest global deployments for frontend apps');

    // Click Generate
    console.log("Generating video...");
    await page.click('button:has-text("Generate Video")');

    // Wait for player to appear
    console.log("Waiting for player to appear...");
    await page.waitForSelector('text=Generated Script:', { state: 'visible', timeout: 60000 });

    console.log("Video generated, waiting a couple seconds for remotion to prepare");

    // Click on the center of the video player to start playing
    await page.waitForTimeout(3000);

    // Look for the remotion player container
    await page.click('.aspect-video');

    console.log("Watching video for 8 seconds...");
    await page.waitForTimeout(8000);

    console.log("Interaction complete. Closing context to save video...");
  } catch (err) {
    console.error("Error during test:", err);
  } finally {
    // Closing the context saves the video
    await context.close();
    await browser.close();

    // Kill the server
    try {
        process.kill(-serverProcess.pid);
    } catch(e){}
    console.log("Killed Next.js server");
  }
})();
