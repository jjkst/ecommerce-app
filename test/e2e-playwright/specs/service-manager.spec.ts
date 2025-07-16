import { test, expect, Page, Browser } from '@playwright/test';
import { HomePage, ServiceManagerPage } from '../pages';
import path from 'path';

let page: Page;
let serviceManagerPage: ServiceManagerPage;

test.beforeAll(async ({ browser }: { browser: Browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  var homePage = new HomePage(page);
  await homePage.init();
  serviceManagerPage = new ServiceManagerPage(page);
  await serviceManagerPage.init();
});

test.describe('smoke', () => {
  test('add new service', async () => {
    await serviceManagerPage.fillTitle('Test Service');
    const imagePath = path.resolve(
      __dirname,
      '../../../public/Outdoor-Dining-and-Vistas.jpg'
    );
    await serviceManagerPage.uploadImage(imagePath);
    await serviceManagerPage.fillDescription('Test Service project');
    await serviceManagerPage.addFeature('Test Service Feature', 1);

    await serviceManagerPage.clickAddPricingPlan();
    await serviceManagerPage.fillPricingPlanName('Test Service Pricing Plan');
    await serviceManagerPage.fillInitialSetupFee('$1000');
    await serviceManagerPage.fillMonthlySubscription('$75');
    await serviceManagerPage.addPricePlanFeature(
      'Test Service Price Plan Feature',
      1
    );

    await serviceManagerPage.submitForm();
    await serviceManagerPage.expectSuccessToast(
      'Service Added/Updated Successfully!'
    );
  });

  test('update service', async () => {
    await serviceManagerPage.clickEditButton();
    await serviceManagerPage.fillTitle('Edit Test Service');
    await serviceManagerPage.fillDescription('Edit Test Service project');
    await serviceManagerPage.updateFeature('Edit Test Service Feature');

    await serviceManagerPage.fillPricingPlanName(
      'Edit Test Service Pricing Plan'
    );
    await serviceManagerPage.fillInitialSetupFee('$10000');
    await serviceManagerPage.fillMonthlySubscription('$750');
    await serviceManagerPage.updatePricePlanFeature(
      'Edit Test Service Price Plan Feature'
    );

    await serviceManagerPage.submitForm();
    await serviceManagerPage.expectSuccessToast(
      'Service Added/Updated Successfully!'
    );
  });

  test('delete service', async () => {
    page.on('dialog', async (dialog) => {
      await dialog.accept('confirm');
    });
    await serviceManagerPage.clickDeleteButton();
    await serviceManagerPage.expectSuccessToast(
      'Service deleted successfully!'
    );
  });
});
