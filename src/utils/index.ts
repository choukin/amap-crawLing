import * as crypto from 'crypto';
/*
 * @Description: promise 封装
 */
export function to<T>(promise: Promise<T>): Promise<any> {
  return promise
    .then((res?: any) => [res, null])
    .catch((error?: any) => [null, error]);
}

/*
 * 生成模糊搜索语句
 */

export const generateFuzzyQuery = (paramsArr, query) => {
  const params = {};
  paramsArr.forEach((key) => {
    // 如果请求体为空值的时候则不加入判断 （这块具体逻辑看你需求写）
    if (!query[key]) return;
    // 创建一个正则表达式，'i'标志表示不区分大小写
    params[key] = { $regex: new RegExp(query[key], 'i') };
  });
  return params;
};

// 你的AppKey作为密钥，确保它是16字节的
const appKey = Buffer.from('8c300921a6303d13', 'utf8');

// AES-128-ECB解密
export function decryptAes128Ecb(encryptedText) {
  const decipher = crypto.createDecipheriv('aes-128-ecb', appKey, null);
  decipher.setAutoPadding(true);
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// AES-128-ECB加密函数
export function encryptAes128Ecb(text) {
  const cipher = crypto.createCipheriv('aes-128-ecb', appKey, null);
  cipher.setAutoPadding(true);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

// setTimeout promise 版本
export function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// 随机等待一个时间范围
export function randomWait(min, max) {
  const sleepTime = Math.floor(Math.random() * (max - min) + min);
  console.log('sleepTime', sleepTime);
  return sleep(sleepTime);
}
