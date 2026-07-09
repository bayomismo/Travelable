// Cross-platform helper for Windows + Mac/Linux: copies .next/static and public
// into the standalone build. Run after `next build` if `cp` isn't available.
import fs from 'node:fs';
import path from 'node:path';

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

const root = process.cwd();
copyDir(path.join(root, '.next/static'), path.join(root, '.next/standalone/.next/static'));
copyDir(path.join(root, 'public'),         path.join(root, '.next/standalone/public'));
console.log('✓ Copied static + public into .next/standalone/');