import { chromium } from 'playwright';
import { config } from './consts';
import '../utils/enviroment';
import { resolve } from 'path';
import { yachAlarm } from '../utils/api';
import { uploadPoster, deleteLocalImage } from '../utils/cosUpload';
const filePath = resolve(__dirname, process.env.SCREENSHOTDIR);
const env = process.env.NODE_ENV;
const cookiesFile = `cookie${env}.json`;
export async function xhsLoginQr(
  pageUrl = 'https://www.amap.com'
) {
  return new Promise(async (resolve) => {
    console.log('开始高德');
    const browser = await chromium.launch(config.browserConfig);
    const context = await browser.newContext();
    // @ts-ignore
    const page = await context.newPage();
    // 等待页面加载状态为 'load'，表示页面已完全加载
    await page.goto(pageUrl, { waitUntil: 'load' });
    console.log('加载页面',pageUrl);
    await page.waitForTimeout(2000);
   console.log('点击登录');
    await page.getByText('二维码登录').click();
    console.log('请扫码登录');
    await page.waitForTimeout(10000);
    context.storageState({ path: cookiesFile });
    console.log('扫码完成登录完成');
    await page.close();
  });
}
