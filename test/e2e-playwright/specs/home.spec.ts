import { test, expect, Page, Browser } from '@playwright/test';
import { HomePage } from '../pages';

let page: Page;
let homePage: HomePage;

test.beforeAll(async ({ browser }: { browser: Browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  homePage = new HomePage(page);
  await homePage.init();
});

test('homepage has title', async () => {
  const title = await homePage.getTitle();
  await homePage.expectTitle(title);
});