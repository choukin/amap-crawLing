import '../utils/enviroment';
export const APIWHITELIST = [
  //  笔记详情接口
  'https://edith.xiaohongshu.com/api/sns/web/v1/feed',
  // 笔记查询接口
  'https://edith.xiaohongshu.com/api/sns/web/v1/search/notes',
  // 首页笔记列表
  'https://edith.xiaohongshu.com/api/sns/web/v1/homefeed',
  // 用户笔记
  'https://edith.xiaohongshu.com/api/sns/web/v1/user_posted',
];
export const COMMENTAPI =
  'https://edith.xiaohongshu.com/api/sns/web/v2/comment/page';

export const login =
  'https://edith.xiaohongshu.com/api/sns/web/v1/login/qrcode/status?qr_id=';

export const detailURL = `https://www.xiaohongshu.com/explore/`;
export const homeURL = `https://www.xiaohongshu.com/explore`;
export const searchURL = `https://www.xiaohongshu.com/search_result`;
/**
 * 链接池相关配置
 */
console.log(process.env.NODE_ENV, 'process.env.NODE_ENV');

export const config = {
  browserConfig: {
    headless: ['production', 'test'].includes(process.env.NODE_ENV)
      ? true
      : false, // 是否启用无头模式页面
    ignoreHTTPSErrors: true,
    timeout: 0,
    // 把无头浏览器 进程的 stderr 和 stdout pip 到主进程 chromium console 的输出会在主进程中打印出来
    dumpio: true,
    permissions: ['geolocation'],
    geolocation: {
      longitude: 113.938891,
      latitude: 22.536589,
      accuracy: 114.085753,
    },
    args: [
      '--disable-blink-features=AutomationControlled', //个参数用于禁用 Chrome 的某些 Blink 引擎特性，具体来说是禁用了让网站能够检测到浏览器正在被自动化控制的特性。这有助于避免被一些网站检测到使用自动化工具
      '--disable-dev-shm-usage', // 告诉 Chrome 不要使用 /dev/shm，这对于在资源受限的环境（如某些 Docker 容器配置）中运行浏览器特别有用。
      '-–no-sandbox', // 这个参数用于禁用 Chrome 的沙盒模式。沙盒模式是一种安全机制，用于隔离运行在浏览器中的程序，防止它们造成系统级的破坏。在某些环境（如 Docker 容器）中，可能需要禁用沙盒模式以避免权限问题。
      '--disable-setuid-sandbox',
      // '--start-maximized', // 网页加载时就最大化的窗口
    ], // 添加启动参数
    slowMo: 500,

    // chrome 路径
    executablePath: ['production', 'test'].includes(process.env.NODE_ENV)
      ? '/ms-playwright/chromium-1112/chrome-linux/chrome'
      : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    // viewport: { width: 1280, height: 900 },
  },
  browserPool: {
    min: 1,
    max: 5,
    idleTimeoutMillis: 3600000,
  },
  pagePool: {
    min: 1,
    max: 10,
    idleTimeoutMillis: 300000,
  },
};
