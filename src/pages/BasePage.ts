import { expect, type Locator, type Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  protected async expectToast(message: RegExp | string): Promise<void> {
    const toast = this.page.locator('.oxd-toast').filter({ hasText: message }).first();
    await expect(toast).toBeVisible();
  }

  protected async fillInput(label: string, value: string): Promise<void> {
    const input = this.page
      .getByLabel(label)
      .or(this.page.locator(`label:has-text("${label}") + div input`))
      .first();
    await input.fill(value);
  }

  protected tableCell(text: string): Locator {
    return this.page.getByRole('cell', { name: text, exact: true });
  }
}
