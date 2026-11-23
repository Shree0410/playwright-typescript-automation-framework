import { Page, Locator } from '@playwright/test';
import { BasePage } from './base_page';
import { CheckoutInfo } from '../types';
import { parsePrice } from '../utils/price';

// The three checkout screens: "Your Information", "Overview" and "Complete".
export class CheckoutPage extends BasePage {
  // Step one: Your Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step two: Overview
  readonly itemTotalLabel: Locator;
  readonly finishButton: Locator;

  // Complete
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.itemTotalLabel = page.locator('[data-test="subtotal-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  // Empty strings are allowed so tests can leave a field blank on purpose.
  async fillInformation(info: CheckoutInfo) {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
    await this.continueButton.click();
  }

  // Reads "Item total: $39.98" on the Overview step and returns 39.98.
  async getItemTotal(): Promise<number> {
    return parsePrice(await this.itemTotalLabel.innerText());
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
