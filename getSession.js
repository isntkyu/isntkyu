import * as puppeteer from "puppeteer";

const githubId = process.env.GITHUB_ID || ''
const githubPw = process.env.GITHUB_PW || ''

console.log(githubId)
export const getVelogCookie = async (loginType) => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',  // 공유 메모리 사용을 비활성화
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080',  // 해상도 설정
    ],
    headless: true,
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

  await page.waitForSelector('body > div > div.Modal_backdrop__JxQ1v.keyframes_fadeIn__9Emp7 > div > div.AuthModal_white-block__SuoSm > div.AuthModal_block-content__3Dk7K > div > div.AuthForm_upper-warepper__r7h_t > section:nth-child(3) > div > a:nth-child(1)',{
    visible: true
  })
  const url = await page.$eval('body > div > div.Modal_backdrop__JxQ1v.keyframes_fadeIn__9Emp7 > div > div.AuthModal_white-block__SuoSm > div.AuthModal_block-content__3Dk7K > div > div.AuthForm_upper-warepper__r7h_t > section:nth-child(3) > div > a:nth-child(1)', el => el.href);
  await page.goto(url);

  await page.waitForSelector("#login_field",{
    timeout: 100000,
    visible: true
  });
  await page.type("#login_field", githubId);
  await page.type("#password", githubPw);
  await page.click("input[type='submit']");

  await page.waitForNavigation({
    timeout: 100000,
    waitUntil: 'load'
  });

  await page.waitForSelector('body > div > div.HomeLayout_block__ZqnqH > div.responsive_mainResponsive___uG64 > div > header > div > div.Header_right__IaiY4 > a.Header_notification__cTNS6',{
    timeout: 100000,
    visible: true
  })
  const url2 = await page.$eval('body > div > div.HomeLayout_block__ZqnqH > div.responsive_mainResponsive___uG64 > div > header > div > div.Header_right__IaiY4 > a.Header_notification__cTNS6', el => el.href);
  await page.goto(url2);

  const cookies = await page.cookies()

  const cookieString = cookies.map(cookie => {
    return `${cookie.name}=${cookie.value}`
  }).join(';')

  await page.close()

  return cookieString
}
