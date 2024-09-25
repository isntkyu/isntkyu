import * as puppeteer from "puppeteer";

const githubId = process.env.GITHUB_ID || ''
const githubPw = process.env.GITHUB_PW || ''

export const getVelogCookie = async (loginType) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: false,
  });

  const page = await browser.newPage();
  await page.goto("https://velog.io");
  await page.waitForSelector(
    "div.HomeLayout_block__ZqnqH > div.responsive_mainResponsive___uG64 button"
  ,{
    timeout: 100000,
    visible: true
  });

  await page.click(
    "div.HomeLayout_block__ZqnqH > div.responsive_mainResponsive___uG64 button"
  );

  await page.waitForSelector('body > div > div.Modal_backdrop__JxQ1v.keyframes_fadeIn__9Emp7 > div > div.AuthModal_white-block__SuoSm > div.AuthModal_block-content__3Dk7K > div > div.AuthForm_upper-warepper__r7h_t > section:nth-child(3) > div > a:nth-child(1)')
  await page.click('body > div > div.Modal_backdrop__JxQ1v.keyframes_fadeIn__9Emp7 > div > div.AuthModal_white-block__SuoSm > div.AuthModal_block-content__3Dk7K > div > div.AuthForm_upper-warepper__r7h_t > section:nth-child(3) > div > a:nth-child(1)');

  // await page.wait
  // await page.evaluate(() => document.querySelector(".svgPath").click())
  // await page.click("body > div > div.Modal_backdrop__JxQ1v.keyframes_fadeIn__9Emp7 > div > div.AuthModal_white-block__SuoSm > div.AuthModal_block-content__3Dk7K > div > div.AuthForm_upper-warepper__r7h_t > section:nth-child(3) > div > a:nth-child(1) > svg")
  //   .catch(async err => {
  //     console.error(err)
  //     console.log(await page.content())
  //   });

  await page.waitForSelector("#login_field",{
    timeout: 100000,
    visible: true
  });
  await page.type("#login_field", githubId);
  await page.type("#password", githubPw);
  await page.click("input[type='submit']");

  await page.waitForNavigation({
    timeout: 50000
  });
  await page.waitForSelector(
    'xpath///*[@id="html"]/body/div/div[2]/div[2]/div/header/div/div[2]/div/div/img'
  ,{
      timeout: 50000
  });

  const cookies = await page.cookies()

  const cookieString = cookies.map(cookie => {
    return `${cookie.name}=${cookie.value}`
  }).join(';')

  await page.close()

  return cookieString
}
