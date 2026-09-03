import { chromium } from "@playwright/test";

async function run() {
  console.log("Launching Edge...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  console.log("Navigating to http://127.0.0.1:3000 with domcontentloaded...");
  const t0 = Date.now();
  await page.goto("http://127.0.0.1:3000", { waitUntil: "domcontentloaded" });
  console.log(`Loaded in ${Date.now() - t0}ms!`);
  console.log("Title:", await page.title());
  console.log("H1:", await page.textContent("h1"));
  await browser.close();
  console.log("EDGE TEST PASSED SUCCESSFULLY!");
}
run().catch(console.error);
