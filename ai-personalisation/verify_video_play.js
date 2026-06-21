const { chromium } = require('playwright');
const path = require('path');
const { spawn, execSync } = require('child_process');

// Kill any existing Next.js server on port 3001
try {
  execSync('kill $(lsof -t -i :3001) 2>/dev/null');
} catch (e) {
  // It's okay if it fails (no process running)
}

(async () => {
  console.log("Starting Next.js server...");
  const serverProcess = spawn('npm', ['run', 'dev', '--', '-p', '3001'], {
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
    console.log("Navigating to http://localhost:3001");
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Check if there are inputs
    console.log("Waiting for form inputs...");
    await page.waitForSelector('input', { timeout: 30000 });

    // We added template buttons recently: "SaaS Analytics", "DevTool", "Health App"
    console.log("Clicking the DevTool template button...");
    await page.click('button:has-text("DevTool")');

    // Click Generate
    console.log("Generating video...");
    await page.click('button:has-text("Generate Video")');

    // Wait for player to appear
    console.log("Waiting for player to appear...");
    await page.waitForSelector('text=Generated Script:', { state: 'visible', timeout: 60000 });

    console.log("Video generated, waiting a couple seconds for remotion to prepare");

    // Wait for the video element and remotion to be ready
    await page.waitForTimeout(3000);

    // Click on the center of the video player to start playing
    console.log("Clicking player to start");
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
