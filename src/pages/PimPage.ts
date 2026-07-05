import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { EmployeeData } from '../data/testDataFactory';

/**
 * Page object for OrangeHRM PIM employee workflows.
 *
 * The methods model business operations used by tests: create, search, update,
 * delete, and validate employee records. Locators are centralized here so tests
 * remain readable and resilient to markup changes.
 */
export class PimPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /** Opens the PIM module from the left navigation. */
  async open(): Promise<void> {
    await this.page.getByRole('link', { name: 'PIM' }).click();
    await expect(this.page.getByRole('heading', { name: 'PIM' })).toBeVisible();
  }

  /** Creates an employee with dynamic data and verifies the details page opens. */
  async addEmployee(employee: EmployeeData): Promise<void> {
    await this.page.getByRole('link', { name: 'Add Employee' }).click();
    await expect(this.page.getByRole('heading', { name: 'Add Employee' })).toBeVisible();

    await this.page.getByPlaceholder('First Name').fill(employee.firstName);
    await this.page.getByPlaceholder('Middle Name').fill(employee.middleName);
    await this.page.getByPlaceholder('Last Name').fill(employee.lastName);

    const employeeId = this.page
      .locator('label:has-text("Employee Id")')
      .locator('..')
      .locator('..')
      .getByRole('textbox');
    await employeeId.fill(employee.employeeId);

    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.expectToast(/Successfully Saved/);
    await expect(this.page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
    await expect(this.page.getByPlaceholder('First Name')).toHaveValue(employee.firstName);
  }

  /** Searches Employee List by employee ID and waits until the record is visible. */
  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.page.getByRole('link', { name: 'Employee List' }).click();
    await expect(this.page.getByRole('heading', { name: 'Employee Information' })).toBeVisible();

    const idInput = this.page
      .locator('label:has-text("Employee Id")')
      .locator('..')
      .locator('..')
      .getByRole('textbox');
    await idInput.fill(employeeId);
    await this.page.getByRole('button', { name: 'Search' }).click();
    await expect(this.page.locator('.oxd-table-body')).toContainText(employeeId);
  }

  /** Verifies that an employee search result contains the expected name values. */
  async expectEmployeePresent(employee: EmployeeData): Promise<void> {
    await this.searchByEmployeeId(employee.employeeId);
    await expect(this.page.locator('.oxd-table-body')).toContainText(employee.firstName);
    await expect(this.page.locator('.oxd-table-body')).toContainText(employee.lastName);
  }

  /** Opens an employee record from search results and waits for form hydration. */
  async openEmployeeFromResults(employeeId: string): Promise<void> {
    await this.searchByEmployeeId(employeeId);
    const row = this.employeeRow(employeeId);
    await expect(row).toBeVisible();
    await row.getByRole('button').first().click();
    await expect(this.page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
    await expect(this.personalDetailsInput('Employee Id')).toHaveValue(employeeId);
  }

  /** Updates persisted Personal Details name fields and validates the saved state. */
  async updatePersonalDetails(
    employeeId: string,
    updates: Pick<EmployeeData, 'firstName' | 'middleName' | 'lastName'>
  ): Promise<void> {
    await this.openEmployeeFromResults(employeeId);
    await this.page.getByPlaceholder('First Name').fill(updates.firstName);
    await this.page.getByPlaceholder('Middle Name').fill(updates.middleName);
    await this.page.getByPlaceholder('Last Name').fill(updates.lastName);
    await expect(this.page.getByPlaceholder('First Name')).toHaveValue(updates.firstName);
    await expect(this.page.getByPlaceholder('Middle Name')).toHaveValue(updates.middleName);
    await expect(this.page.getByPlaceholder('Last Name')).toHaveValue(updates.lastName);
    await this.personalDetailsForm().getByRole('button', { name: 'Save' }).click();
    await this.expectToast(/Successfully Updated/);
    await expect(this.page.getByPlaceholder('First Name')).toHaveValue(updates.firstName);
    await expect(this.page.getByPlaceholder('Middle Name')).toHaveValue(updates.middleName);
    await expect(this.page.getByPlaceholder('Last Name')).toHaveValue(updates.lastName);
  }

  /** Deletes an employee from the Employee List search result. */
  async deleteEmployee(employeeId: string): Promise<void> {
    await this.searchByEmployeeId(employeeId);
    const row = this.employeeRow(employeeId);
    await expect(row).toBeVisible();
    await row.getByRole('button').last().click();
    await this.page.getByRole('button', { name: /Yes, Delete/ }).click();
    await this.expectToast(/Successfully Deleted/);
  }

  /** Confirms that searching for a deleted employee does not return its row. */
  async expectEmployeeDeleted(employeeId: string): Promise<void> {
    await this.page.getByRole('link', { name: 'Employee List' }).click();
    const idInput = this.page
      .locator('label:has-text("Employee Id")')
      .locator('..')
      .locator('..')
      .getByRole('textbox');
    await idInput.fill(employeeId);
    await this.page.getByRole('button', { name: 'Search' }).click();
    await expect(this.employeeRow(employeeId)).toHaveCount(0);
  }

  /** Locates a result row by employee ID, which is unique for test-created users. */
  private employeeRow(employeeId: string) {
    return this.page.locator('.oxd-table-card').filter({ hasText: employeeId });
  }

  /** Locates an input inside the Personal Details form by its visible label. */
  private personalDetailsInput(label: string): Locator {
    return this.personalDetailsForm()
      .locator('label')
      .filter({ hasText: label })
      .locator('xpath=ancestor::div[contains(@class, "oxd-input-group")]')
      .getByRole('textbox')
      .first();
  }

  /** Scopes actions to the Personal Details form to avoid unrelated Save buttons. */
  private personalDetailsForm(): Locator {
    return this.page
      .locator('form')
      .filter({ has: this.page.locator('label').filter({ hasText: 'Other Id' }) })
      .first();
  }
}
