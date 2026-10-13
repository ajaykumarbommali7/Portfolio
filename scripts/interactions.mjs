// Interaction checks: ID card flip (keyboard + tap), sound button, mobile menu.
//   node scripts/interactions.mjs [url]
import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "chrome" });
const out = {};

// desktop: keyboard flip + sound toggle
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const btn = page.locator(".hero-sound");
  out.soundBefore = await btn.getAttribute("aria-label");
  await btn.click();
  await page.waitForTimeout(300);
  out.soundAfterClick = await btn.getAttribute("aria-label");
  out.videoMuted = await page.evaluate(() => document.querySelector("video").muted);
  await btn.click();
  await page.waitForTimeout(300);
  out.soundAfterSecondClick = await btn.getAttribute("aria-label");

  const card = page.locator(".idcard");
  await page.evaluate(() => document.getElementById("about").scrollIntoView()); await page.waitForTimeout(600);
  await card.focus();
  await page.keyboard.press("Enter");
  out.cardFlippedByEnter = await card.getAttribute("data-flipped");
  await page.keyboard.press(" ");
  out.cardUnflippedBySpace = await card.getAttribute("data-flipped");
  const before = await page.evaluate(() => getComputedStyle(document.querySelector(".lanyard")).transform);
  await page.mouse.move(300, 400);
  for (let x = 300; x < 1200; x += 60) await page.mouse.move(x, 420);
  await page.waitForTimeout(250);
  const after = await page.evaluate(() => getComputedStyle(document.querySelector(".lanyard")).transform);
  out.lanyardSwings = before !== after;
  await page.close();
}

// mobile: tap flip + menu open / Esc
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const card = page.locator(".idcard");
  await page.evaluate(() => document.getElementById("about").scrollIntoView()); await page.waitForTimeout(600);
  await card.tap({ force: true });
  out.cardFlippedByTap = await card.getAttribute("data-flipped");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator(".nav-menu-btn").tap();
  await page.waitForTimeout(500);
  out.menuOpen = await page.locator(".nav-menu-btn").getAttribute("aria-expanded");
  out.scrollLocked = await page.evaluate(() => document.documentElement.style.overflow === "hidden");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  out.menuClosedByEsc = (await page.locator(".nav-menu-btn").getAttribute("aria-expanded")) === "false";
  await ctx.close();
}

console.log(JSON.stringify(out, null, 2));
await browser.close();
