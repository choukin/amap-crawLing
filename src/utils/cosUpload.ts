import * as COS from 'cos-nodejs-sdk-v5';
import './enviroment';
import * as fs from 'fs';

const cos = new COS({
  Domain: process.env.CDNHOST,
  SecretId: '', //process.env.SecretId, // 推荐使用环境变量获取；用户的 SecretId，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
  SecretKey: '', //process.env.SecretKey, // 推荐使用环境变量获取；用户的 SecretKey，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
  // 可选参数
  FileParallelLimit: 3, // 控制文件上传并发数
  ChunkParallelLimit: 8, // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
  ChunkSize: 1024 * 1024 * 8, // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
  Proxy: '',
  Protocol: 'https:',
  FollowRedirect: false,
});

/**
 *  上传图片
 * @description 上传时使用图片处理
 */
export function uploadPoster(filepath: string, filename: any) {
  // const filepath = resolve(__dirname, process.env.SCREENSHOTDIR, filename);
  console.log('filepath', filepath);
  const cosBaseDir = 'xhs';
  return cos.uploadFile({
    // @ts-ignore
    Bucket: process.env.Bucket, // Bucket 格式：test-1250000000
    FilePath: filepath,
    // @ts-ignore
    Region: process.env.Region,
    Key: cosBaseDir + '/' + filename,
    SliceSize: 8 * 1024 * 1024,
  });
}

/**
 * 删除本地文件
 */
export function deleteLocalImage(posterFilePath: string) {
  // 删除本地图片
  const res = fs.unlinkSync(posterFilePath);
  return res;
}
