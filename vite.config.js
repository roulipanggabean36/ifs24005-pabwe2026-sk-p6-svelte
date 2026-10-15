import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.APP_PORT) || 3004

  return {
    plugins: [tailwindcss(), svelte(), svelteTesting()],
    server: { port, strictPort: true, host: true },
    preview: { port, strictPort: true, host: true },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./setupTests.js'],
      env: {
        VITE_DELCOM_BASEURL: 'https://api.test/api/v1'
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{js,svelte}'],
        exclude: ['src/**/*.test.js', 'src/main.js', 'src/test-utils.js'],
        thresholds: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100
        }
      }
    }
  }
})
