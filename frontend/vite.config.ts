/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd());
  const noBackend = env.VITE_NO_BACKEND === 'true';

  return {
    root: __dirname,
    base: noBackend ? '/SAE_Project_BUT2/' : '/',
    cacheDir: '../node_modules/.vite/frontend',
    server: {
      port: 4200,
      host: 'localhost',
    },
    preview: {
      port: 4300,
      host: 'localhost',
    },
    plugins: [vue()],
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
