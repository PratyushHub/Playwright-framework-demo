import { expect, test } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import logger from "../utils/LoggerUtil";
import { decrypt, encrypt } from "../utils/CryptojsUtil";
import { encryptEnvFile, decryptEnvFile } from "../utils/EncryptEnvFile";


const authFile = "src/config/auth.json";

test("simple login test with self heal", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  await loginPage.fillUsername_selfheal("demo_selfheal");
});

test("simple login test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  await loginPage.fillUsername(process.env.userid!);
  await loginPage.fillPassword(process.env.password!);
//   await loginPage.fillUsername(decrypt(process.env.username!));
//   await loginPage.fillPassword(decrypt(process.env.password!));
  const homePage = await loginPage.clickLoginButton();
  await homePage.expectServiceTitleToBeVisible();
   logger.info("Test for service is completed");
  await page.context().storageState({ path: authFile });
  logger.info("Auth state is saved");
});

test.skip("Login with auth file", async ({ browser }) => {
  const context = await browser.newContext({ storageState: authFile });
  const page = await context.newPage();
  await page.goto(
    "https://mukunthanr2-dev-ed.lightning.force.com/lightning/page/home"
  );
  await expect(page.getByRole("link", { name: "Accounts" })).toBeVisible();
});

test.skip("Sample env test", async({page}) => {
const plaintext ="Pswd@123";
const encryptedText = encrypt(plaintext);
console.log('SALT', process.env.SALT);
console.log('Encrypted:',encryptedText);
const decryptedText = decrypt(encryptedText);
console.log('Decrypted:',decryptedText);
encryptEnvFile();

});
