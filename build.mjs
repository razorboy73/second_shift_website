// Generates the static HTML in public/ from src/. Run: npm run build
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHome } from './src/pages/home.mjs';
import { renderIndustry } from './src/pages/industry.mjs';
import { industries } from './src/content/industries.mjs';
import { page } from './src/layout.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'public');

async function write(rel, html) {
  const file = join(out, rel);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  console.log('  wrote', rel);
}

const simple = (title, heading, text) =>
  page({
    title,
    path: `/${title.toLowerCase()}`,
    description: text,
    hasContact: false,
    body: `<section class="hero hero--simple"><div class="container"><h1 class="h1--industry">${heading}</h1><p class="hero__detail hero__detail--lg">${text}</p><div class="hero__actions"><a class="button button--primary" href="/">Back to home</a></div></div></section>`,
  });

console.log('Building site…');
// brand.css in brand_assets/ is the source of truth; copy it so the site always uses the current tokens.
await mkdir(join(out, 'css'), { recursive: true });
await copyFile(join(root, 'brand_assets', 'brand.css'), join(out, 'css', 'brand.css'));
await write('index.html', renderHome());
for (const ind of industries) await write(`solutions/${ind.slug}/index.html`, renderIndustry(ind));
await write('thanks.html', simple('Thanks', 'Thanks. Your message is on its way.', 'We will reply within one business day.'));
await write('404.html', simple('Not found', 'That page took the day off.', 'The page you were looking for doesn’t exist. Try the home page instead.'));
console.log('Done.');
