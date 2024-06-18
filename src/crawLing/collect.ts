import { chromium } from 'playwright';
import { config } from './consts';

import '../utils/enviroment';
import { resolve } from 'path';
import { uploadPoster, deleteLocalImage } from '../utils/cosUpload';

const env = process.env.NODE_ENV;
const filePath = resolve(__dirname, process.env.SCREENSHOTDIR);
const poiInfo = 'https://www.amap.com/service/poiInfo';
// console.log(`🚀 ~ process.env.NODE_ENV;:`, process.env.NODE_ENV);
const cookiesFile = `cookie${env}.json`;

function closeBrowser(browser, page, context) {
  // page.close();
  // context.close();
  browser.close();
}
export async function clollectMapList(pageUrl, keyword, city) {
  // console.log(`🚀 ~ cookiesFile:`, cookiesFile);
  console.log(`🚀 ~ 开始爬取列表数据页面链接 ~ clollectNotes:`, pageUrl);
  return new Promise(async (resolve) => {
    console.log(`🚀 ~ 开始 ~ clollectNotes:`);
    const browser = await chromium.launch(config.browserConfig);
    const context = await browser.newContext({
      storageState: cookiesFile,
      userAgent: config.browserConfig.userAgent,
      // viewport: config.browserConfig.viewport,
      geolocation: {
        longitude: 113.938891,
        latitude: 22.536589,
        accuracy: 114.085753,
      },
      permissions: ['geolocation'],
    });
    // @ts-ignore
    const page = await context.newPage();
    // 超过 40 条会被拦截，只获取 ssr 得到笔记信息
    const total = 0;
    let address = [];
    page.on('response', handleRequest);
    // 设置页面视口大小
    await page.setViewportSize({ width: 1080, height: 1080 });
    // 等待页面加载状态为 'load'，表示页面已完全加载
    await page.goto(pageUrl, { waitUntil: 'load' });

    await page.waitForTimeout(2000);

    await page.locator('#citybox').click();
    await page.getByPlaceholder('请输入城市').click();
    await page.getByPlaceholder('请输入城市').fill(city);
    await page.getByPlaceholder('请输入城市').press('Enter');

    await page.getByPlaceholder('搜索位置、公交站、地铁站').click();
    await page.getByPlaceholder('搜索位置、公交站、地铁站').fill(keyword);
    await page.locator('#searchbtn i').click();

    async function handleRequest(response) {
      const request = response.request();
      const resourceType = request.resourceType();
      const url = request.url();

      if (['xhr', 'fetch'].includes(resourceType) && url.includes(poiInfo)) {
        // console.debug('打印接口地址', url.includes(poiInfo));
        // console.log(`🚀 ~ handleRequest ~ response:`, response)
        // await page.waitForTimeout(1000);
        const bodyText = await response.text();
        console.log(`🚀 ~ handleRequest ~ bodyText:`, bodyText);
        try {
          const body = await response.json();
          console.log(`🚀 ~ handleRequest ~ body:`, body);
          const { total, poi_list } = body.data;
          if (!body.data.poi_list) {
            console.log('没有搜到数据');
            resolve(address);
            closeBrowser(browser, page, context);
            return false;
          }
          // console.log(`🚀 ~ handleRequest ~ poi_list:`, poi_list)
          address = address.concat(poi_list);
          console.log(
            `🚀 ~ handleRequest ~ body: poi_list length`,
            poi_list.length,
          );
          console.log(
            `🚀 ~ handleRequest ~ body: total `,
            +total + '  address.length:' + address.length,
          );
          console.log(
            `🚀 ~ handleRequest ~ address.length >= +total:`,
            address.length >= +total,
          );
          if (poi_list.length < 20 || address.length >= +total) {
            resolve(address);
            closeBrowser(browser, page, context);
            return false;
          } else {
            // 检查页面中是否存在选择器匹配的元素
            const element = await page.$('.serp-paging');
            // console.log(`🚀 ~ handleRequest ~ element:`, element)
            if (element) {
              await page.waitForTimeout(2000);
              console.log(`🚀 ~ handleRequest ~ element:  下一页`);
              await page.locator('#serp .paging-next').click();
            } else {
              resolve(address);
              closeBrowser(browser, page, context);
              return false;
            }
          }
        } catch (error) {
          console.log(`🚀 ~ `, error);
          resolve(address);
          closeBrowser(browser, page, context);
          return false;
        }
      }
    }
  });
}

export async function clollectBusinessDistrict(pageUrl, keyword, city) {
  console.log(`🚀 ~ 开始爬取列表数据页面链接 ~ clollectNotes:`, pageUrl);
  return new Promise(async (resolve) => {
    console.log(`🚀 ~ 开始 ~ clollectNotes:`);
    const browser = await chromium.launch(config.browserConfig);
    const context = await browser.newContext({
      storageState: cookiesFile,
      userAgent: config.browserConfig.userAgent,
      // viewport: config.browserConfig.viewport,
      geolocation: {
        longitude: 113.938891,
        latitude: 22.536589,
        accuracy: 114.085753,
      },
      permissions: ['geolocation'],
    });
    // @ts-ignore
    const page = await context.newPage();
    // 超过 40 条会被拦截，只获取 ssr 得到笔记信息
    const total = 0;
    let address = [];
    page.on('response', handleRequest);
    // 设置页面视口大小
    await page.setViewportSize({ width: 1080, height: 1080 });
    // 等待页面加载状态为 'load'，表示页面已完全加载
    await page.goto(pageUrl, { waitUntil: 'load' });

    await page.waitForTimeout(2000);

    await page.getByPlaceholder('搜索位置、公交站、地铁站').click();
    await page
      .getByPlaceholder('搜索位置、公交站、地铁站')
      .fill(`${keyword} ${city}`);
    await page.locator('#searchbtn i').click();

    async function handleRequest(response) {
      const request = response.request();
      const resourceType = request.resourceType();
      const url = request.url();

      if (['xhr', 'fetch'].includes(resourceType) && url.includes(poiInfo)) {
        const bodyText = await response.text();
        console.log(`🚀 ~ handleRequest ~ bodyText:`, bodyText);
        try {
          const body = await response.json();
          console.log(`🚀 ~ handleRequest ~ body:`, body);
          const { total, poi_list } = body.data;
          if (!body.data.poi_list) {
            console.log('没有搜到数据');
            resolve(address);
            closeBrowser(browser, page, context);
            return false;
          }
          // console.log(`🚀 ~ handleRequest ~ poi_list:`, poi_list)
          address = address.concat(poi_list);
          console.log(
            `🚀 ~ handleRequest ~ body: poi_list length`,
            poi_list.length,
          );
          console.log(
            `🚀 ~ handleRequest ~ body: total `,
            +total + '  address.length:' + address.length,
          );
          console.log(
            `🚀 ~ handleRequest ~ address.length >= +total:`,
            address.length >= +total,
          );
          if (poi_list.length < 20 || address.length >= +total) {
            resolve(address);
            closeBrowser(browser, page, context);
            return false;
          } else {
            // 检查页面中是否存在选择器匹配的元素
            const element = await page.$('.serp-paging');
            // console.log(`🚀 ~ handleRequest ~ element:`, element)
            if (element) {
              await page.waitForTimeout(2000);
              console.log(`🚀 ~ handleRequest ~ element:  下一页`);
              await page.locator('#serp .paging-next').click();
            } else {
              resolve(address);
              closeBrowser(browser, page, context);
              return false;
            }
          }
        } catch (error) {
          console.log(`🚀 ~ `, error);
          resolve(address);
          closeBrowser(browser, page, context);
          return false;
        }
      }
    }
  });
}
