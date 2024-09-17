import * as puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: false,
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
  await page.type("#login_field", ""); // id
  await page.type("#password", ""); // pw
  await page.click("input[type='submit']");

  await page.waitForNavigation();
  await page.waitForSelector(
    'xpath///*[@id="html"]/body/div/div[2]/div[2]/div/header/div/div[2]/div/div/img'
  );
  // await page.goto("https://velog.io/@isntkyu/posts");
  console.log(await page.cookies());
})();

// import url from 'url';
// import { createRunner } from '@puppeteer/replay';

// export async function run(extension) {
//     const runner = await createRunner(extension);

//     await runner.runBeforeAllSteps();

//     await runner.runStep({
//         type: 'setViewport',
//         width: 800,
//         height: 600,
//         deviceScaleFactor: 1,
//         isMobile: false,
//         hasTouch: false,
//         isLandscape: false
//     });
//     await runner.runStep({
//         type: 'navigate',
//         url: 'https://velog.io/',
//         assertedEvents: [
//             {
//                 type: 'navigation',
//                 url: 'https://velog.io/',
//                 title: 'velog'
//             }
//         ]
//     });
//     await runner.runStep({
//         type: 'click',
//         target: 'main',
//         selectors: [
//             [
//                 'div.HomeLayout_block__ZqnqH > div.responsive_mainResponsive___uG64 button'
//             ],
//             [
//                 'xpath///*[@id="html"]/body/div/div[2]/div[2]/div/header/div/div[2]/button'
//             ],
//             [
//                 'pierce/div.HomeLayout_block__ZqnqH > div.responsive_mainResponsive___uG64 button'
//             ]
//         ],
//         offsetY: 14,
//         offsetX: 58.5234375,
//     });
//     await runner.runStep({
//         type: 'click',
//         target: 'main',
//         selectors: [
//             [
//                 'a:nth-of-type(1) g > path'
//             ],
//             [
//                 'xpath///*[@id="html"]/body/div/div[3]/div/div[2]/div[2]/div/div[1]/section[2]/div/a[1]/svg/g/path'
//             ],
//             [
//                 'pierce/a:nth-of-type(1) g > path'
//             ]
//         ],
//         offsetY: 12.5,
//         offsetX: 12,
//         assertedEvents: [
//             {
//                 type: 'navigation',
//                 url: 'https://github.com/login?client_id=7c3902d881910d52ae3e&return_to=%2Flogin%2Foauth%2Fauthorize%3Fclient_id%3D7c3902d881910d52ae3e%26integrateState%3D%26isIntegrate%3D0%26redirect_uri%3Dhttps%253A%252F%252Fv2.velog.io%252Fapi%252Fv2%252Fauth%252Fsocial%252Fcallback%252Fgithub%253Fnext%253D%26scope%3Duser%253Aemail',
//                 title: ''
//             }
//         ]
//     });
//     await runner.runStep({
//         type: 'change',
//         value: 'isntkyu',
//         selectors: [
//             [
//                 'aria/Username or email address'
//             ],
//             [
//                 '#login_field'
//             ],
//             [
//                 'xpath///*[@id="login_field"]'
//             ],
//             [
//                 'pierce/#login_field'
//             ]
//         ],
//         target: 'main'
//     });
//     await runner.runStep({
//         type: 'keyDown',
//         target: 'main',
//         key: 'Tab'
//     });
//     await runner.runStep({
//         type: 'keyUp',
//         key: 'Tab',
//         target: 'main'
//     });
//     await runner.runStep({
//         type: 'change',
//         value: 'dkxhvl!12',
//         selectors: [
//             [
//                 'aria/Password'
//             ],
//             [
//                 '#password'
//             ],
//             [
//                 'xpath///*[@id="password"]'
//             ],
//             [
//                 'pierce/#password'
//             ]
//         ],
//         target: 'main'
//     });
//     await runner.runStep({
//         type: 'click',
//         target: 'main',
//         selectors: [
//             [
//                 'aria/Sign in'
//             ],
//             [
//                 "input[type='submit']"
//             ],
//             [
//                 'xpath///*[@id="login"]/div[3]/form/div/input[13]'
//             ],
//             [
//                 "pierce/input[type='submit']"
//             ]
//         ],
//         offsetY: 14.5,
//         offsetX: 125,
//         assertedEvents: [
//             {
//                 type: 'navigation',
//                 url: 'https://github.com/login/oauth/authorize?client_id=7c3902d881910d52ae3e&integrateState=&isIntegrate=0&redirect_uri=https%3A%2F%2Fv2.velog.io%2Fapi%2Fv2%2Fauth%2Fsocial%2Fcallback%2Fgithub%3Fnext%3D&scope=user%3Aemail',
//                 title: ''
//             }
//         ]
//     });

//     await runner.runAfterAllSteps();
// }

// if (process && import.meta.url === url.pathToFileURL(process.argv[1]).href) {
//     run()
// }
