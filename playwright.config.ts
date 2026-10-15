import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:39017",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "corepack pnpm exec next start -p 39017",
    url: "http://127.0.0.1:39017/tracking",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
