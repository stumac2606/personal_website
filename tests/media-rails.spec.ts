import { test, expect } from "@playwright/test";

test("media rails: each section has a horizontal scroll container when overflow exists", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:3000/media");

  // Wait for the gallery to render (client component)
  await page.waitForSelector('[data-role="media-rail-scroll"]', { timeout: 10_000 });

  const rails = page.locator('[data-role="media-rail-scroll"]');
  const count = await rails.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const rail = rails.nth(i);

    const before = await rail.evaluate((el) => ({
      clientWidth: el.clientWidth,
      scrollWidth: el.scrollWidth,
      scrollLeft: el.scrollLeft,
      overflowX: getComputedStyle(el).overflowX,
      // helpful diagnostics
      id: (el as HTMLElement).getAttribute("data-testid"),
    }));

    // It must be an actual scroll container
    expect(["auto", "scroll"]).toContain(before.overflowX);

    // If it overflows, it must scroll horizontally.
    if (before.scrollWidth > before.clientWidth + 2) {
      // Use programmatic scroll to avoid mouse wheel routing quirks.
      await rail.evaluate((el) => el.scrollBy({ left: 400 }));

      const afterScrollLeft = await rail.evaluate((el) => el.scrollLeft);

      expect(afterScrollLeft).toBeGreaterThan(before.scrollLeft);
    }
  }

  // Extra: ensure page isn't horizontally overflowing
  const pageOverflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - doc.clientWidth;
  });
  expect(pageOverflow).toBeLessThanOrEqual(2);
});
