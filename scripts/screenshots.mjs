// Visual + overflow check. Needs a running server (npm run build && npm start).
//   node scripts/screenshots.mjs [url]
// Uses the locally installed Chrome (playwright-core, no browser download).
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:3000";
const sizes = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
];
mkdirSync("shots", { recursive: true });

const browser = await chromium.launch({ channel: "chrome", args: ["--autoplay-policy=no-user-gesture-required"] });
let failed = false;

for (const s of sizes) {
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height },
    isMobile: !!s.isMobile,
    hasTouch: !!s.hasTouch,
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `shots/${s.name}-hero.png` });

  // walk the page so every reveal / counter fires, screenshotting each section
  const ids = await page.$$eval("main section[id]", (els) => els.map((e) => e.id));
  for (const id of ids) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
    }, id);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `shots/${s.name}-${id}.png` });
  }

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  const video = await page.evaluate(() => {
    const v = document.querySelector("video");
    return v ? { paused: v.paused, muted: v.muted, readyState: v.readyState } : null;
  });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(1200);
  const videoBack = await page.evaluate(() => {
    const v = document.querySelector("video");
    return v ? { paused: v.paused, muted: v.muted } : null;
  });

  const ok = overflow.scrollWidth === overflow.innerWidth;
  if (!ok || errors.length) failed = true;
  console.log(
    JSON.stringify({ size: s.name, overflowOk: ok, ...overflow, videoAtBottom: video, videoAtTop: videoBack, errors }, null, 0),
  );
  await ctx.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
