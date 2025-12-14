// tests/calculator.spec.js
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:5173/";

class CalculatorPage {
  constructor(page) {
    this.page = page;
    this.calculator = page.getByTestId("calculator");
    this.display = page.getByTestId("display");
  }

  async goto() {
    await this.page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await expect(this.calculator).toBeVisible();
  }

  btn(id) {
    return this.page.getByTestId(id);
  }

  async press(ids) {
    for (const id of ids) {
      await this.btn(id).click();
    }
  }

  async expectDisplay(text) {
    await expect(this.display).toHaveText(text);
  }
}

test.describe("Calculator", () => {
  test("loads with default display of 0", async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.goto();
    await calc.expectDisplay("0");
  });

  test("enters multi-digit numbers", async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.goto();

    await calc.press(["btn-1", "btn-2", "btn-3"]);
    await calc.expectDisplay("123");
  });

  test("decimal behaviour", async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.goto();

    await calc.press(["btn-decimal", "btn-5"]);
    await calc.expectDisplay("0.5");

    await calc.press(["btn-decimal", "btn-2"]);
    await calc.expectDisplay("0.52");
  });

  test("addition: 7 + 8 = 15", async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.goto();

    await calc.press(["btn-7", "btn-plus", "btn-8", "btn-equals"]);
    await calc.expectDisplay("15");
  });

  test("chained ops: 9 × 9 - 3 = 78", async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.goto();

    await calc.press(["btn-9", "btn-multiply", "btn-9", "btn-minus", "btn-3", "btn-equals"]);
    await calc.expectDisplay("78");
  });

  test("clear resets everything", async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.goto();

    await calc.press(["btn-9", "btn-9", "btn-divide", "btn-3"]);
    await calc.btn("btn-clear").click();

    await calc.expectDisplay("0");
  });

  test("egg: shows image if triggered, then clears display (known bug)", async ({ page }) => {
    const calc = new CalculatorPage(page);
    await calc.goto();

    // Adjust this sequence to whatever your EasterEgg() trigger is.
    await calc.press(["btn-6", "btn-6", "btn-6", "btn-equals"]);

    await expect(page.getByTestId("egg-image")).toBeVisible({ timeout: 2000 });
    await expect(calc.display).toHaveText("", { timeout: 4000 });
  });
});
