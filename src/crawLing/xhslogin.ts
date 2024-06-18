import { chromium } from 'playwright';
import { config } from './consts';
import '../utils/enviroment';
import { resolve } from 'path';
import { yachAlarm } from '../utils/api';
import { uploadPoster, deleteLocalImage } from '../utils/cosUpload';
const filePath = resolve(__dirname, process.env.SCREENSHOTDIR);
export async function xhsLogin(
  userInfo: { phone: string; code: string },
  pageUrl = 'https://www.xiaohongshu.com/explore',
) {
  return new Promise(async (resolve) => {
    console.log('开始登录小红书');
    const browser = await chromium.launch(config.browserConfig);
    const context = await browser.newContext();
    // @ts-ignore
    const page = await context.newPage();
    // 等待页面加载状态为 'load'，表示页面已完全加载
    await page.goto(pageUrl, { waitUntil: 'load' });

    await page.locator('.agree-icon').click();
    await page.locator('.phone input').fill(userInfo.phone);
    await page.locator('.auth-code input').fill(userInfo.code);
    await page.locator('.submit').click();

    const timep = new Date().getTime() + '.png';
    const imagePath = filePath + '/' + timep;
    await page.screenshot({ path: filePath + '/' + timep });
    const fileRes = await uploadPoster(imagePath, timep);
    const imageUrl = 'https://' + fileRes?.Location;
    deleteLocalImage(imagePath);
    yachAlarm({
      title: '获取列表页面被拦截 请重新登录',
      content: `### <span style="color:red">爬虫被拦截报警</span>  \n 获取详情页面被拦截 请重新登录! \n 页面链接:[${pageUrl}](${pageUrl}) \n ![图片](${imageUrl})`,
    });
    page.on('response', async (response) => {
      const request = response.request();
      const resourceType = request.resourceType();
      const url = request.url();
      console.log(resourceType, `🚀 ~ page.on ~ url:`, url);
      if (['xhr', 'fetch'].includes(resourceType)) {
        const body = await response.json();

        console.log(`🚀 ~ page.on ~ body:`, body);
        context.storageState({ path: 'cookie.json' });
      }
    });
  });
}
