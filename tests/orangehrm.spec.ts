import { test, expect } from '@playwright/test';
// import { waitForToastNotification } from '../utils/toastUtil.js';

const url = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test.describe('OrangeHRM Page Automation', () => {
  let username, password;
  
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url);
    
    const rawUsername = await page.locator("//p[normalize-space()='Username : Admin']").textContent();
    const rawPassword = await page.locator("//p[normalize-space()='Password : admin123']").textContent();
    
    username = rawUsername?.replace("Username : ", "").trim();
    password = rawPassword?.replace("Password : ", "").trim();
    
    console.log(`Extracted Credentials: ${username}, ${password}`);
    await context.close();
  });
  
  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    await page.fill("//input[@name='username']", username ?? '');
    await page.fill("//input[@name='password']", password ?? '');
    await page.click("//button[normalize-space()='Login']");
    await expect(page.locator('h6:has-text("Dashboard")')).toBeVisible();
  });
  
  test('Search for Candidate and Verify Toast Notification', async ({ page }) => {
    await page.click("//span[normalize-space()='Recruitment']");
    await expect(page.locator("//h5[normalize-space()='Candidates']")).toBeVisible();
    
    const jobTitleDropdown = page.locator('//div[contains(@class, "oxd-select-text-input")]').nth(0);
    await jobTitleDropdown.click();
    await page.waitForTimeout(1000);

    await page.click("//div[@role='listbox']//span[text()='Chief Technical Officer']");
    await page.fill("input[placeholder='Type for hints...']", 'Tanmay');
    
    const dropDownList = page.locator('.oxd-autocomplete-dropdown').locator('.oxd-autocomplete-option');
    await dropDownList.nth(1).click({force: true});

    await page.click("button:has-text('Search')");
    await page.waitForTimeout(1000);
    
    const toasterContent = await page.locator('.oxd-text oxd-text--p oxd-text--toast-message oxd-toast-content-text').textContent();
    expect(toasterContent).toContain('No Records Found');
  });
  
  test('Filter by Date of Application and Assert Results', async ({ page }) => {
    await page.click("//span[normalize-space()='Recruitment']");
    await page.click("button:has-text('Reset')");
    
    await page.fill("input[placeholder='From']", '2025-17-03');
    await page.press("input[placeholder='From']", 'Enter');
    await page.waitForTimeout(1000);
    
    await page.fill("input[placeholder='To']", '2025-23-04');
    await page.press("input[placeholder='To']", 'Enter');
    await page.waitForTimeout(1000);
    
    await page.click("button:has-text('Search')");
    await expect(page.locator('.oxd-table')).toBeVisible();
    
    const toasterContent = await page.locator('.oxd-text oxd-text--p oxd-text--toast-message oxd-toast-content-text').textContent();
    expect(toasterContent).toContain('No Records Found');
  });
});
