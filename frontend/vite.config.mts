/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd());
  const noBackend = env.VITE_NO_BACKEND === 'true';
  
  // Use root base path for both local and GitHub Pages
  const base = '/';

  return {
    root: __dirname,
    base: base,
    cacheDir: '../node_modules/.vite/frontend',
    server: {
      port: 4200,
      host: 'localhost',
    },
    preview: {
      port: 4300,
      host: 'localhost',
    },
    plugins: [
      vue(),
      tailwindcss(),
    ],
    build: {
      outDir: path.resolve(__dirname, './dist'),
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    define: {
      __NO_BACKEND__: noBackend,
    },
    test: {
      name: '@sae-project-but2/frontend',
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: './test-output/vitest/coverage',
        provider: 'v8' as const,
      },
    },
  };
});
