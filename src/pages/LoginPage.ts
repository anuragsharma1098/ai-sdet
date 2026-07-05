import { expect, type Page } from '@playwright/test';

/** Page object for the OrangeHRM login screen. */
export class LoginPage {
  constructor(private readonly page: Page) {}

  /**
   * Opens OrangeHRM and waits for the login form to be usable.
   * The public demo can delay non-critical assets, so DOM readiness plus the
   * login heading is more reliable than waiting for the full load event.
   */
  async goto(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible();
  }

  /** Logs in and verifies that the Dashboard landing page is displayed. */
  async login(username: string, password: string): Promise<void> {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  }
}
