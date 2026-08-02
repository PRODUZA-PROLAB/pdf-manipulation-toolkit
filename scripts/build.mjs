/**
 * Build script: publishes the ESM sources into `dist/`.
 *
 * The library ships as plain ES modules, so "building" consists of copying
 * `src/` into `dist/`. Run with `npm run build`.
 */

import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'src');
const distDir = join(root, 'dist');

await mkdir(distDir, { recursive: true });

const files = await readdir(srcDir);
for (const file of files) {
  if (!file.endsWith('.js')) continue;
  await copyFile(join(srcDir, file), join(distDir, file));
}

const written = await readdir(distDir);
console.log(`build ok: ${written.length} arquivos copiados de src/ para dist/`);
