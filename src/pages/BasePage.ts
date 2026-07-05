import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Base class for OrangeHRM page objects.
 *
 * Shared helpers stay here so page-specific classes can focus on business actions
 * instead of repeating synchronization and locator fallback patterns.
 */
export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  /**
   * Waits for an OrangeHRM toast containing the expected text.
   * Toast assertions double as synchronization after save/delete actions.
   */
  protected async expectToast(message: RegExp | string): Promise<void> {
    const toast = this.page.locator('.oxd-toast').filter({ hasText: message }).first();
    await expect(toast).toBeVisible();
  }

  /**
   * Fills a labeled input using accessible labels first, then OrangeHRM markup
   * as a fallback for controls without stable labels.
   */
  protected async fillInput(label: string, value: string): Promise<void> {
    const input = this.page
      .getByLabel(label)
      .or(this.page.locator(`label:has-text("${label}") + div input`))
      .first();
    await input.fill(value);
  }

  /** Returns an exact table cell locator for reusable table assertions. */
  protected tableCell(text: string): Locator {
    return this.page.getByRole('cell', { name: text, exact: true });
  }
}
