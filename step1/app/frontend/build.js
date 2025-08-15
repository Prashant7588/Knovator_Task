const esbuild = require('esbuild');
esbuild.build({
  entryPoints: ['src/index.jsx'],
  bundle: true,
  minify: true,
  outfile: 'dist/assets/app.js',
  loader: { '.js': 'jsx', '.jsx': 'jsx' }
}).catch(() => process.exit(1));
