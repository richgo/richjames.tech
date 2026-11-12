import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './test/browser',
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:3210' },
  webServer: {
    command: 'node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3210',
    url: 'http://127.0.0.1:3210',
    timeout: 30_000,
  },
})
