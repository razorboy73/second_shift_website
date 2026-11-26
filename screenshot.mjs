// Usage: node screenshot.mjs <url> [label] [--mobile]
// Saves full-page screenshots to ./temporary screenshots/screenshot-N[-label].png
// Uses your installed Chrome (or Edge) via puppeteer-core; set CHROME_PATH to override.
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const mobile = args.includes('--mobile');
const [url = 'http://localhost:3000', label] = args.filter((a) => a !== '--mobile');
const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean);
const executablePath = candidates.find((p) => existsSync(p));
if (!executablePath) throw new Error('No Chrome/Edge found. Set CHROME_PATH.');

const dir = 'temporary screenshots';
mkdirSync(dir, { recursive: true });
const n = readdirSync(dir).filter((f) => f.startsWith('screenshot-')).length + 1;
const file = join(dir, `screenshot-${n}${label ? `-${label}` : ''}.png`);

const browser = await puppeteer.launch({ executablePath, headless: true });
const page = await browser.newPage();
await page.setViewport(mobile ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true } : { width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 4500)); // let hero animations finish
await page.screenshot({ path: file, fullPage: true });
await browser.close();
console.log('Saved', file);
