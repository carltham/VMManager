import { defineConfig,devices } from '@playwright/test';

const root = '/mnt/DATA/Projects/0.present-projects/Active/VMManager';

export default defineConfig( {
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html',{ open: 'never' }],['list']],
  use: {
    baseURL: 'http://localhost:4201',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium',use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: `${root}/VMManager-web/mvnw -f ${root}/VMManager-web/pom.xml spring-boot:run -Dspring-boot.run.arguments=--server.port=18080`,
      url: 'http://localhost:18080/api/manager',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: `npm run start -- --host localhost --port 4201`,
      cwd: `${root}/VMManager-web/angular`,
      url: 'http://localhost:4201',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
} );
