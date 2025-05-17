import * as puppeteer from "puppeteer";
import * as speakeasy from 'speakeasy';

const CONFIG = {
  SELECTORS: {
    LOGIN_BUTTON: "div.HomeLayout_block__ZqnqH > div.responsive_mainResponsive___uG64 button",
    GITHUB_LOGIN: 'body > div > div.Modal_backdrop__JxQ1v.keyframes_fadeIn__9Emp7 > div > div.AuthModal_white-block__SuoSm > div.AuthModal_block-content__3Dk7K > div > div.AuthForm_upper-warepper__r7h_t > section:nth-child(3) > div > a:nth-child(1)',
    GITHUB_USERNAME: "#login_field",
    GITHUB_PASSWORD: "#password",
    GITHUB_SUBMIT: "input[type='submit']",
    TOTP_INPUT: '#app_totp'
  },
  URLS: {
    VELOG: 'https://velog.io',
  },
  TIMEOUTS: {
    NAVIGATION: 100000,
    TOTP: 30000,
    WAIT: 30
  }
};

const getBrowserConfig = () => ({
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920,1080',
  ],
  headless: true,
});

const sleep = (seconds) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const generateTOTP = () => speakeasy.totp({
  secret: process.env.TOTP_SECRET,
  encoding: 'base32'
});

const formatCookies = (cookies) =>
  cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';');

const waitAndClick = async (page, selector, timeout = CONFIG.TIMEOUTS.NAVIGATION) => {
  await page.waitForSelector(selector, { timeout, visible: true });
  await page.click(selector);
};

const handleGithubLogin = async (page) => {
  await page.type(CONFIG.SELECTORS.GITHUB_USERNAME, process.env.GITHUB_ID);
  await page.type(CONFIG.SELECTORS.GITHUB_PASSWORD, process.env.GITHUB_PW);
  await page.click(CONFIG.SELECTORS.GITHUB_SUBMIT);

  await page.waitForNavigation({
    timeout: CONFIG.TIMEOUTS.NAVIGATION,
    waitUntil: 'load'
  });
};

const handleTOTPAuth = async (page) => {
  const token = generateTOTP();
  await page.type(CONFIG.SELECTORS.TOTP_INPUT, token);
  await page.waitForNavigation({
    timeout: CONFIG.TIMEOUTS.TOTP,
    waitUntil: 'load'
  });
};

const waitForVelogRedirect = async (page) => {
  await sleep(CONFIG.TIMEOUTS.WAIT);
  if (!(await page.url()).includes('velog.io')) {
    await sleep(CONFIG.TIMEOUTS.WAIT);
  }
};

export const getVelogCookie = async () => {
  const browser = await puppeteer.launch(getBrowserConfig());
  const page = await browser.newPage();

  try {
    // 초기 페이지 로드 및 로그인 버튼 클릭
    await page.goto(CONFIG.URLS.VELOG);
    await waitAndClick(page, CONFIG.SELECTORS.LOGIN_BUTTON);

    // GitHub 로그인 링크 가져오기 및 이동
    await page.waitForSelector(CONFIG.SELECTORS.GITHUB_LOGIN, { visible: true });
    const githubUrl = await page.$eval(CONFIG.SELECTORS.GITHUB_LOGIN, el => el.href);
    await page.goto(githubUrl);

    // GitHub 로그인 처리
    await handleGithubLogin(page);

    // TOTP 인증
    await handleTOTPAuth(page);

    // Velog 리다이렉트 대기
    await waitForVelogRedirect(page);

    // 쿠키 수집 및 변환
    const cookies = await page.cookies();
    return formatCookies(cookies);
  } finally {
    await page.close();
    await browser.close();
  }
};
