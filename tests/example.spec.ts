import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const URL = process.env.APP_URL || 'https://fe-delivery.tallinn-learning.ee/signin';

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
});

test('Check for incorrect credentials message and close pop up message', async ({ page }) => {
  const randomUsername = faker.internet.username();
  const randomPassword = faker.internet.password();

  const usernameField = page.getByTestId("username-input");
  const passwordField = page.getByTestId("password-input");
  const signInButton = page.getByTestId("signIn-button");
  const errorPopUpMessage = page.getByTestId("authorizationError-popup");
  const closeButton = page.getByTestId("authorizationError-popup-close-button");

  await usernameField.fill(randomUsername);
  console.log(randomUsername);
  await passwordField.fill(randomPassword);
  console.log(randomPassword);
  await signInButton.click();
  await expect(errorPopUpMessage).toBeVisible();

  await closeButton.click();
  await expect(signInButton).toBeEnabled();
});

test('Check for error messages for login input', async ({ page }) => {
  const usernameField = page.getByTestId("username-input");
  const passwordField = page.getByTestId("password-input");
  const emptyErrorMessageForUserName = page.getByTestId('username-input-error').nth(0);
  const emptyErrorMessageForPassword = page.getByTestId('username-input-error').nth(1);

  const emptyErrorMessageForShortUserName = page.getByText('The field must contain at least of characters: 2');
  const emptyErrorMessageForShortPassword = page.getByText('The field must contain at least of characters: 8');

  await usernameField.fill("t");
  await expect(emptyErrorMessageForShortUserName).toBeVisible();

  await usernameField.fill("");
  await expect(emptyErrorMessageForUserName).toBeVisible();

  await passwordField.fill("test");
  await expect(emptyErrorMessageForShortPassword).toBeVisible();

  await passwordField.fill("");
  await expect(emptyErrorMessageForPassword).toBeVisible();
});
