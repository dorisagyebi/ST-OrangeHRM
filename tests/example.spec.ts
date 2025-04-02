import { test, expect } from '@playwright/test';


const url = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';


test.describe('OrangeHRM Page Automation', () => {
  
  test.beforeEach('Extract Login Credentials', async ({ page }) => {
    
    await page.goto(url);
    // await page.setViewportSize({ width: 1700, height: 1000 });

    const rawUsername = await page.locator("//p[normalize-space()='Username : Admin']").textContent();
    const rawPassword = await page.locator("//p[normalize-space()='Password : admin123']").textContent();


    console.log(rawUsername);
    console.log(rawPassword);


    const username = rawUsername?.replace("Username : ", "").trim();
    const password = rawPassword?.replace("Password : ", "").trim(); 
    
    console.log(username);
    console.log(password);

    await page.locator("//input[@name='username']").fill(username?? '');
    await page.locator("//input[@name='password']").fill(password?? '');

    await page.locator("//button[normalize-space()='Login']").click();
    await expect(page.locator('h6:has-text("Dashboard")')).toBeVisible();

  })



  test('Search for Candidate and Verify Toast Notification', async ({page}) => {
    await page.locator("//span[@class='oxd-text oxd-text--span oxd-main-menu-item--name'][normalize-space()='Recruitment']").click();

    await expect(page.locator("//h5[normalize-space()='Candidates']")).toBeVisible();

    const jobTitleDropdown = page.locator('//div[contains(@class, "oxd-select-text-input")]').nth(0);
    await jobTitleDropdown.click();

    await page.waitForTimeout(1000);

    await page.click('//div[@role="listbox"]//span[text()="Chief Technical Officer"]');

 
    await page.fill('input[placeholder="Type for hints..."]', 'Tanmay');
   
    const dropDownList = page.locator('.oxd-autocomplete-dropdown').locator('.oxd-autocomplete-option');

    await dropDownList.nth(1).click({force: true});

    await page.click('button:has-text("Search")');



    // await page.getByText('No Records Found');



    await page.evaluate(() => {
      return new Promise(resolve => {
          const observer = new MutationObserver(mutations => {
              mutations.forEach(mutation => {
                  mutation.addedNodes.forEach(node => {
                      if (node.textContent?.includes('No Records Found')) {
                          observer.disconnect();
                          resolve(node.textContent);
                      }
                  });
              });
          });
  
          observer.observe(document.body, { childList: true, subtree: true });
      });
  });
  



  });


  test('Filter by Date of Application and Assert Results', async ({ page }) => {
    // await page.waitForLoadState('domcontentloaded');
  
    await page.click('a:has-text("Recruitment")');
    // await page.click("//span[@class='oxd-text oxd-text--span oxd-main-menu-item--name'][normalize-space()='Recruitment']");
    await page.click('button:has-text("Reset")');
 
    await page.fill('input[placeholder="From"]', '17-03-2025');
    await page.press('input[placeholder="From"]', 'Enter');
    await page.waitForTimeout(2000);

   
    await page.fill('input[placeholder="To"]', '23-04-2025');
    await page.press('input[placeholder="To"]', 'Enter');
    await page.waitForTimeout(2000);

    await page.click('button:has-text("Search")');


    await expect(page.locator('.oxd-table')).toBeVisible();
    //await expect(page.locator('.oxd-table')).toContainText("No Record Found");


   

    // await page.getByText('No Record Found')


    await page.evaluate(() => {
      return new Promise(resolve => {
          const observer = new MutationObserver(mutations => {
              mutations.forEach(mutation => {
                  mutation.addedNodes.forEach(node => {
                      if (node.textContent?.includes('No Records Found')) {
                          observer.disconnect();
                          resolve(node.textContent);
                      }
                  });
              });
          });
  
          observer.observe(document.body, { childList: true, subtree: true });
      });
  });
  

    

  });

})