import { test } from '@playwright/test';
import { env } from '../../src/config/env';
import { createEmployeeData } from '../../src/data/testDataFactory';
import { LoginPage } from '../../src/pages/LoginPage';
import { PimPage } from '../../src/pages/PimPage';

test.describe('Question #1: OrangeHRM web automation', () => {
  test('creates, validates, updates, deletes, and verifies employee records', async ({ page }) => {
    const employeeOne = createEmployeeData();
    const employeeTwo = createEmployeeData();
    const updatedEmployeeOne = createEmployeeData();

    const loginPage = new LoginPage(page);
    const pimPage = new PimPage(page);

    await loginPage.goto();
    await loginPage.login(env.orangeUsername, env.orangePassword);

    await pimPage.open();
    await pimPage.addEmployee(employeeOne);
    await pimPage.addEmployee(employeeTwo);

    await pimPage.expectEmployeePresent(employeeOne);
    await pimPage.expectEmployeePresent(employeeTwo);

    await pimPage.updatePersonalDetails(employeeOne.employeeId, {
      firstName: updatedEmployeeOne.firstName,
      middleName: updatedEmployeeOne.middleName,
      lastName: updatedEmployeeOne.lastName
    });

    await pimPage.deleteEmployee(employeeOne.employeeId);
    await pimPage.expectEmployeeDeleted(employeeOne.employeeId);
    await pimPage.expectEmployeePresent(employeeTwo);
  });
});
