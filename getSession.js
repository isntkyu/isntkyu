import * as puppeteer from "puppeteer";

const githubId = process.env.GITHUB_ID || ''
const githubPw = process.env.GITHUB_PW || ''

export const getVelogCookie = async (loginType) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto("https://velog.io");
  await page.waitForSelector(
    "div.HomeLayout_block__ZqnqH > div.responsive_mainResponsive___uG64 button"
  );

  await page.click(
    "div.HomeLayout_block__ZqnqH > div.responsive_mainResponsive___uG64 button"
  );
  await page.waitForSelector("a:nth-of-type(1) g > path");
  await page.click("a:nth-of-type(1) g > path");

  await page.waitForSelector("#login_field");
  await page.type("#login_field", githubId);
  await page.type("#password", githubPw);
  await page.click("input[type='submit']");

  await page.waitForNavigation();
  await page.waitForSelector(
    'xpath///*[@id="html"]/body/div/div[2]/div[2]/div/header/div/div[2]/div/div/img'
  );

  const cookies = await page.cookies()

  const cookieString = cookies.map(cookie => {
    return `${cookie.name}=${cookie.value}`
  }).join(';')

  await page.close()

  return cookieString
}
