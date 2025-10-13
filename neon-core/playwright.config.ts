import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
    testDir: '.',
    testMatch: ['e2e/*e2e.spec.ts'],      // only E2E files
    outputDir: 'reports/e2e',
    // Run all tests in parallel.
    fullyParallel: true,

    // Retry on CI only.
    retries: 0,

    // Opt out of parallel tests on CI.
    workers: undefined,
    timeout: 10_000,
    // Reporter to use
    reporter: 'html',

    use: {
        // Base URL to use in actions like `await page.goto('/')`.
        baseURL: 'http://localhost:4200',

        // Collect trace when retrying the failed test.
        trace: 'on-first-retry',
    },
    // Configure projects for major browsers.
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    // Run your local dev server before starting the tests.
    webServer: {
        command: 'npm run start',
        url: 'http://localhost:4200',
    },
});