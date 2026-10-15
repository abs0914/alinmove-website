import { expect, test, type Page } from "@playwright/test";
import type { PublicTrackingSuccess } from "@/lib/tracking/types";

const cargoResult: PublicTrackingSuccess = {
  success: true,
  trackingNumber: "ALN-123456",
  shipmentType: "cargo",
  serviceType: "Branch to branch",
  currentStatus: {
    code: "IN_TRANSIT",
    label: "In transit",
    description: "The shipment is moving through the ALiN network.",
    timestamp: "2026-08-02T09:50:00.000Z",
    category: "moving",
    semanticColor: "info",
    terminal: false,
  },
  origin: { branchName: "ALiN Cebu", city: "Cebu City" },
  destination: { branchName: "ALiN Tacloban", city: "Tacloban City" },
  milestones: [
    {
      id: "cargo-received",
      code: "SHIPMENT_RECEIVED",
      label: "Shipment received",
      description: "The shipment was accepted by ALiN Cargo.",
      timestamp: "2026-08-01T09:00:00.000Z",
      state: "completed",
      source: "cargo",
    },
    {
      id: "cargo-transit",
      code: "IN_TRANSIT",
      label: "In transit",
      description: "The shipment is moving through the ALiN network.",
      timestamp: "2026-08-02T09:50:00.000Z",
      state: "current",
      source: "cargo",
    },
  ],
  lastMile: {
    active: false,
    status: null,
    riderAssigned: false,
    vehicleType: null,
    locationAvailable: false,
    locationFreshness: "unavailable",
    location: null,
    locationUpdatedAt: null,
    estimatedArrivalStart: null,
    estimatedArrivalEnd: null,
  },
  proofOfDelivery: null,
  lastUpdatedAt: "2026-08-02T09:50:01.000Z",
  dataFreshness: { label: "Last verified update", isLive: false },
};

async function mockTracking(page: Page, response: PublicTrackingSuccess = cargoResult) {
  await page.route("**/api/public/tracking/*", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(response) }),
  );
}

test("idle and invalid states contain no fabricated shipment", async ({ page }) => {
  await page.goto("/tracking");
  await expect(page.getByRole("heading", { name: "Where is your package?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Track every movement" })).toBeVisible();
  await expect(page.getByText("ALiN North Hub")).toHaveCount(0);
  await expect(page.getByText("35 min")).toHaveCount(0);

  await page.getByLabel("Tracking number").fill("bad!");
  await page.getByRole("button", { name: "Track package" }).click();
  await expect(page.locator("#tracking-error")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Tracking number" })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});

test("keyboard-only Cargo lookup renders one continuous timeline and no rider map", async ({ page }) => {
  await mockTracking(page);
  await page.goto("/tracking");
  await page.getByLabel("Tracking number").focus();
  await page.keyboard.type("ALN-123456");
  await page.keyboard.press("Enter");

  const resultHeading = page.getByRole("heading", { name: "In transit", level: 2 });
  await expect(resultHeading).toBeFocused();
  await expect(page.getByRole("heading", { name: "Shipment journey" })).toBeVisible();
  await expect(page.getByText("Shipment received")).toBeVisible();
  await expect(page.getByTitle("Latest verified rider location")).toHaveCount(0);
  await expect(page).toHaveURL(/tracking=ALN-123456/);
});

test("deep-linked active last mile displays only verified location behavior", async ({ page }) => {
  await mockTracking(page, {
    ...cargoResult,
    shipmentType: "combined",
    currentStatus: {
      ...cargoResult.currentStatus,
      code: "OUT_FOR_DELIVERY",
      label: "Out for delivery",
      description: "The package is moving to its final destination.",
      category: "out_for_delivery",
    },
    lastMile: {
      active: true,
      status: { code: "OUT_FOR_DELIVERY", label: "Out for delivery" },
      riderAssigned: true,
      vehicleType: "Motorcycle",
      locationAvailable: true,
      locationFreshness: "fresh",
      location: { latitude: 10.3157, longitude: 123.8854 },
      locationUpdatedAt: "2026-08-02T09:59:00.000Z",
      estimatedArrivalStart: null,
      estimatedArrivalEnd: null,
    },
    dataFreshness: { label: "Last verified update", isLive: true },
  });
  await page.goto("/tracking?tracking=ALN-123456");
  await expect(page.getByRole("heading", { name: "Latest rider location" })).toBeVisible();
  await expect(page.getByText("Verified rider location received")).toBeVisible();
  await expect(page.getByText("Location is current")).toBeVisible();
});

test("supported viewports have no horizontal overflow and keep the form before results", async ({ page }) => {
  for (const width of [320, 375, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/tracking");
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth, `${width}px viewport overflowed`).toBeLessThanOrEqual(
      dimensions.clientWidth,
    );
    const headlineLines = await page
      .getByRole("heading", { name: "Where is your package?" })
      .evaluate((heading) => {
        const lineHeight = Number.parseFloat(getComputedStyle(heading).lineHeight);
        return Math.round(heading.getBoundingClientRect().height / lineHeight);
      });
    expect(headlineLines, `${width}px headline exceeded two lines`).toBeLessThanOrEqual(2);
    if (width < 1024) {
      const inputBox = await page.getByLabel("Tracking number").boundingBox();
      const resultBox = await page.getByRole("heading", { name: "Track every movement" }).boundingBox();
      expect(inputBox?.y ?? Infinity).toBeLessThan(resultBox?.y ?? -Infinity);
      await expect(page.getByText("Get the App", { exact: true })).toHaveCount(0);
    }
  }
});
