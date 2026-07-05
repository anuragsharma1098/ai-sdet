import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { EmployeeData } from '../data/testDataFactory';

export class PimPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.getByRole('link', { name: 'PIM' }).click();
    await expect(this.page.getByRole('heading', { name: 'PIM' })).toBeVisible();
  }

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

  async expectEmployeePresent(employee: EmployeeData): Promise<void> {
    await this.searchByEmployeeId(employee.employeeId);
    await expect(this.page.locator('.oxd-table-body')).toContainText(employee.firstName);
    await expect(this.page.locator('.oxd-table-body')).toContainText(employee.lastName);
  }

  async openEmployeeFromResults(employeeId: string): Promise<void> {
    await this.searchByEmployeeId(employeeId);
    const row = this.employeeRow(employeeId);
    await expect(row).toBeVisible();
    await row.getByRole('button').first().click();
    await expect(this.page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
    await expect(this.personalDetailsInput('Employee Id')).toHaveValue(employeeId);
  }

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

  async deleteEmployee(employeeId: string): Promise<void> {
    await this.searchByEmployeeId(employeeId);
    const row = this.employeeRow(employeeId);
    await expect(row).toBeVisible();
    await row.getByRole('button').last().click();
    await this.page.getByRole('button', { name: /Yes, Delete/ }).click();
    await this.expectToast(/Successfully Deleted/);
  }

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

  private employeeRow(employeeId: string) {
    return this.page.locator('.oxd-table-card').filter({ hasText: employeeId });
  }

  private personalDetailsInput(label: string): Locator {
    return this.personalDetailsForm()
      .locator('label')
      .filter({ hasText: label })
      .locator('xpath=ancestor::div[contains(@class, "oxd-input-group")]')
      .getByRole('textbox')
      .first();
  }

  private personalDetailsForm(): Locator {
    return this.page
      .locator('form')
      .filter({ has: this.page.locator('label').filter({ hasText: 'Other Id' }) })
      .first();
  }
}
