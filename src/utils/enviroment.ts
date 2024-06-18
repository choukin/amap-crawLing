import { config } from 'dotenv';
import { join } from 'path';
const nodeenv = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : '';
const configPath = join(__dirname, `../../.env${nodeenv}`);
console.log(`🚀 ~ nodeenv:当前环境变量路径`, configPath);

config({ path: configPath });
// export const envs = process.env;
