import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ServiceManagerPage extends BasePage {
  readonly admin: Locator;
  readonly managerServices: Locator;
  readonly titleInput: Locator;
  readonly imageInput: Locator;
  readonly descriptionInput: Locator;
  readonly addFeatureButton: Locator;
  readonly updateFeatureText: Locator;

  readonly pricingPlanSection: Locator;
  readonly pricingPlanNameInput: Locator;
  readonly addPricingPlanButton: Locator;
  readonly initialSetupFeeInput: Locator;
  readonly monthlySubscriptionInput: Locator;
  readonly addPricingPlanFeatureButton: Locator;
  readonly updatePricingPlanFeatureText: Locator;
  readonly submitButton: Locator;

  addFeatureText: Locator
  addPricingPlanFeatureText: Locator;
  successToast: Locator;

  readonly editButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.admin = page.locator('a:has-text("Admin")');
    this.managerServices = page.locator('a:has-text("Manage Services")');
    this.titleInput = page.locator('input[formcontrolname="title"]');
    this.imageInput = page.locator('input[type="file"]');
    this.descriptionInput = page.locator('textarea[formcontrolname="description"]');
    this.addFeatureButton = page.getByRole('button', { name: 'Add Feature' });
    this.addFeatureText = page.getByLabel('Feature 1');
    this.updateFeatureText = page.getByPlaceholder('Enter feature');
    this.pricingPlanSection = page.locator('.pricing-plans-section');
    this.addPricingPlanButton = this.pricingPlanSection.getByRole('button', { name: 'Add Pricing Plan' });
    this.pricingPlanNameInput = page.getByPlaceholder('Plan name');
    this.initialSetupFeeInput = this.pricingPlanSection.locator('input[formcontrolname="initialSetupFee"]');
    this.monthlySubscriptionInput = this.pricingPlanSection.locator('input[formcontrolname="monthlySubscription"]');
    this.addPricingPlanFeatureButton = this.pricingPlanSection.getByRole('button', { name: 'Add Plan Feature' });
    this.addPricingPlanFeatureText = this.pricingPlanSection.getByLabel('Feature 1');
    this.updatePricingPlanFeatureText = this.pricingPlanSection.getByPlaceholder('Enter plan feature');

    this.submitButton = page.locator('button[type="submit"]');
    this.successToast = page.locator('.toast-success:visible');

    this.editButton = page.getByRole('button', { name: 'Edit' });
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
  }

  async init() {
    await this.admin.hover();
    await this.managerServices.click();
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async uploadImage(filePath: string) {
    await this.imageInput.setInputFiles(filePath);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async addFeature(feature: string, index: number) {
    await this.addFeatureButton.click();
    this.addFeatureText = this.page.getByLabel(`Feature ${index}`);
    await this.addFeatureText.fill(feature);
  }

  async updateFeature(feature: string) {
    await this.updateFeatureText.fill(feature);
  }

  async clickAddPricingPlan() {
    await this.addPricingPlanButton.click();
  }

  async fillPricingPlanName(name: string) {
    await this.pricingPlanNameInput.fill(name);
  }

  async fillInitialSetupFee(fee: string) {
    await this.initialSetupFeeInput.fill(fee);
  }

  async fillMonthlySubscription(subscription: string) {
    await this.monthlySubscriptionInput.fill(subscription);
  }

  async addPricePlanFeature(feature: string, index: number) {
    await this.addPricingPlanFeatureButton.click();
    this.addPricingPlanFeatureText = this.pricingPlanSection.getByLabel(`Feature ${index}`);
    await this.addPricingPlanFeatureText.fill(feature);
  }

  async updatePricePlanFeature(feature: string) {
    await this.updatePricingPlanFeatureText.fill(feature);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async expectSuccessToast(message: string) {
    this.successToast = this.page.locator(`.toast-success:has-text('${message}')`)
    await expect(this.successToast).toBeVisible();
  }

  async clickEditButton() {
    await this.editButton.click();
  }

  async clickDeleteButton() {
    await this.deleteButton.click();
  }
} 