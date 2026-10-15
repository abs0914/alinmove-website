import { expect, test } from "@playwright/test";

test("branch locator filters, expands cards, and synchronizes the map", async ({ page }) => {
  await page.goto("/branches");

  await expect(page.getByRole("heading", { name: /Find your nearest ALiN branch/i })).toBeVisible();
  await expect(page.getByText("47", { exact: true }).first()).toBeVisible();
  await expect(page.locator(".leaflet-container")).toBeVisible();
  await expect(page.locator(".alin-leaflet-marker")).toHaveCount(47);

  const search = page.getByRole("searchbox", { name: "Search branches" });
  await search.fill("Davao City");
  await expect(page.getByText("1 branch found")).toBeVisible();
  await expect(page.getByText("Davao City", { exact: true })).toBeVisible();
  await expect(page.locator(".alin-leaflet-marker")).toHaveCount(1);

  await page.locator(".alin-leaflet-marker").click();
  const card = page.locator("#branch-card-davao-city");
  await expect(card.getByText(/Geralde's Building/)).toBeVisible();
  await expect(card.getByRole("link", { name: "Get Directions" })).toHaveAttribute(
    "href",
    /google\.com\/maps\/dir/,
  );

  await page.getByRole("button", { name: "Clear branch search" }).click();
  await page.getByRole("button", { name: "Visayas" }).click();
  await expect(page).toHaveURL(/region=visayas/);
  await expect(page.getByText("20 branches found")).toBeVisible();
});

test("branch locator supports mobile map toggle and legacy coverage redirects", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/coverage/cebu-city");
  await expect(page).toHaveURL(/\/branches\?q=Cebu%20City/i);
  await expect(page.getByRole("searchbox", { name: "Search branches" })).toHaveValue("Cebu City");

  const map = page.locator(".leaflet-container");
  await expect(map).toBeHidden();
  await page.getByRole("button", { name: "Show Map" }).click();
  await expect(map).toBeVisible();
  await expect(page.getByRole("button", { name: "Show List" })).toBeVisible();
});
