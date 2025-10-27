import { build } from 'esbuild';
import { mkdir, cp, writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';

const isWatch = process.argv.includes('--watch');

const common = {
  bundle: true,
  sourcemap: isWatch,
  minify: !isWatch,
  target: ['chrome110'],
};

async function ensureDir(path) {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }
}

async function copyStatic() {
  await ensureDir('dist');
  await cp('manifest.json', 'dist/manifest.json', { force: true });
  await ensureDir('dist/options');
  await cp('src/options/options.html', 'dist/options/options.html', { force: true });
  await ensureDir('dist/content');
  await cp('src/content/content.css', 'dist/content.css', { force: true });
}

async function buildAll() {
  await copyStatic();

  await build({
    entryPoints: ['src/content/contentScript.tsx'],
    outfile: 'dist/contentScript.js',
    ...common,
  });

  await build({
    entryPoints: ['src/background/serviceWorker.ts'],
    outfile: 'dist/serviceWorker.js',
    ...common,
  });

  await build({
    entryPoints: ['src/options/options.tsx'],
    outfile: 'dist/options/options.js',
    ...common,
  });

  if (isWatch) {
    console.log('Watching for changes...');
  }
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});