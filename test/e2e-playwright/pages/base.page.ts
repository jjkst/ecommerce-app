import { Page, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to a given path (relative to baseURL)
  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  // Get the page title
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // Wait for a selector to be visible
  async waitForVisible(selector: string) {
    await this.page.waitForSelector(selector, { state: 'visible' });
  }

  // Click an element by selector
  async click(selector: string) {
    await this.page.click(selector);
  }

  // Fill an input field
  async fill(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  // Assert that a selector contains text
  async expectText(selector: string, expected: string) {
    await expect(this.page.locator(selector)).toHaveText(expected);
  }
}