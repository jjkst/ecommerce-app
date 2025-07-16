import { BasePage } from './base.page';
import { expect, Page } from '@playwright/test';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async init() {
    await this.goto('/');
  }

  async expectTitle(title: string) {
    expect(title).toMatch(/Ruku IT Services/i);
  }

}