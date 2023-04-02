/* eslint-disable */
import { context } from 'esbuild';
import { glob } from 'glob';
import fs from 'fs-extra';

const entryPoints = glob.sync('./src/**/*.{js,ts,tsx}');
const isProduction = process.env.NODE_ENV === 'production';

(async () => {
  const ctx = await context({
    entryPoints,
    bundle: true,
    sourcemap: (!isProduction),
    outdir: 'dist',
    target: 'es2020',
    logLevel: 'info',
    minify: (!!isProduction)
  });
  await fs.remove('./dist');
  await fs.copy('./manifest.json', './dist/manifest.json');
  await fs.copy('./src/popup/popup.html', './dist/popup/popup.html');
  await fs.copy('./src/icons', './dist/icons');
  await ctx.rebuild();
  if (isProduction) {
    ctx.dispose();
  } else {
    await ctx.watch();
  }
})();

