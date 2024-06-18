import { AppService } from './../app.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { clollectMapList, clollectBusinessDistrict } from '../crawLing/collect';
import { dailySummary } from '../utils/api';
import * as dayjs from 'dayjs';
import { randomWait } from '../utils/index';
import { appendFileSync } from 'fs';
const nodeenv = process.env.NODE_ENV ? process.env.NODE_ENV : '';
@Injectable()
export class TaskService {
  constructor(
    private readonly logger: Logger,
    private readonly appService: AppService,
  ) {}

  /**
   * 搜索乐读关键字
   * @param query
   */
  async handleSearchNotes(keyWord?: string) {
    //'小猿学练机',
    const keyworkds = ['']; //['作业帮', '科大讯飞', '小度全屋智能'];
    // 北京、上海、广州、深圳、成都、杭州、南京、武汉、天津、西安、重庆、青岛、沈阳、长沙、大连、
    const oneLine = '厦门、无锡、福州、济南'.split('、').map((item) => {
      return { name: item, type: 'oneLine' };
    });
    const twoLine =
      '宁波、昆明、苏州、郑州、长春、合肥、南昌、哈尔滨、常州、烟台、南宁、温州、石家庄、太原、珠海、南通、扬州、贵阳、东莞、徐州、大庆、佛山、威海、洛阳、淮安、呼和浩特、镇江、潍坊、桂林、中山、临沂、咸阳、包头、嘉兴、惠州、泉州'
        .split('、')
        .map((item) => {
          return { name: item, type: 'twoLine' };
        });
    // 宜兴市、
    const threeLine =
      '三亚、赣州、九江、金华、泰安、榆林、许昌、新乡、舟山、慈溪、南阳、聊城、海口、东营、淄博、漳州、保定、沧州、丹东、绍兴、唐山、湖州、揭阳、江阴、营口、衡阳、郴州、鄂尔多斯、泰州、义乌、汕头、宜昌、大同、鞍山、湘潭、盐城、马鞍山、襄樊、长治、日照、常熟、安庆、吉林市、乌鲁木齐、兰州、秦皇岛、肇庆、西宁、介休、滨州、台州、廊坊、邢台、株洲、德阳、绵阳、双流、平顶山、龙岩、银川、芜湖、晋江、连云港、张家港、锦州、岳阳、长沙县、济宁、邯郸、江门、齐齐哈尔、昆山、柳州、绍兴县、运城、齐河'
        .split('、')
        .map((item) => {
          return { name: item, type: 'threeLine' };
        });
    // 宜兴市、

    const fourLine =
      '张家口、湛江、眉山、常德、盘锦、枣庄、资阳、宜宾、赤峰、余姚、清远、蚌埠、宁德、德州、宝鸡、牡丹江、阜阳、莆田、诸暨、黄石、吉安、延安、拉萨、海宁、通辽、黄山、长乐、安阳、增城、桐乡、上虞、辽阳、遵义、韶关、泸州、南平、滁州、温岭、南充、景德镇、抚顺、乌海、荆门、阳江、曲靖、邵阳、宿迁、荆州、焦作、丹阳、丽水、延吉、延边朝鲜族自治州、茂名、梅州、渭南、葫芦岛、娄底、滕州、上饶、富阳、内江、三明、淮南、孝感、溧阳、乐山、临汾、攀枝花、阳泉、长葛'
        .split('、')
        .map((item) => {
          return { name: item, type: 'fourLine' };
        });
    const fiveLine =
      '晋城、自贡、三门峡、赤峰、本溪、防城港、铁岭、随州、广安、广元、天水、遂宁、萍乡、西双版纳、绥化、鹤壁、湘西、松原、阜新、酒泉、张家界、黔西南、保山、昭通、河池、来宾、玉溪、梧州、鹰潭、钦州、云浮、佳木斯、克拉玛依、呼伦贝尔、贺州、通化、阳泉、朝阳、百色、毕节、贵港、丽江、安康、通辽、德宏、朔州、伊犁、文山、楚雄、嘉峪关、凉山、资阳、锡林郭勒盟、雅安'
        .split('、')
        .map((item) => {
          return { name: item, type: 'fiveLine' };
        });

    const cities = [].concat(oneLine, twoLine, threeLine, fourLine, fiveLine);
    // const cities = [].concat(fiveLine);

    const addresses = [];
    for (let i = 0; i < keyworkds.length; i++) {
      for (let j = 0; j < cities.length; j++) {
        const keyword = keyworkds[i];
        console.log(
          `${i + 1}/${keyworkds.length}  🚀 ~ keyword: ${keyword} 🚀 ~ city${
            j + 1
          }/${cities.length}:    ${cities[j].name}`,
        );

        const city = cities[j];
        // const keywordstr = `${keyword} ${city.name}`;
        const targetHost = `https://www.amap.com`;
        const items = (await clollectMapList(
          targetHost,
          keyword,
          city.name,
        )) as any;
        try {
          let prefix = '';
          if (j !== 0) {
            prefix = ',';
          } else {
            appendFileSync(`${keyword}.json`, '[');
          }
          appendFileSync(
            `${keyword}.json`,
            prefix + JSON.stringify({ items, keyword, city }),
          );

          if (j + 1 === cities.length) {
            appendFileSync(`${keyword}.json`, ']');
          }
        } catch (error) {
          console.error('保存失败');
        }
      }
    }

    // 通知知音楼开始爬取数据
    try {
      // 排除广告 非笔记类型数据
    } catch (error) {
      console.error(error);
    }
    return '获取小红书搜索数据结束';
  }

  async handleSearchtBusinessDistrict(keyWord?: string) {
    //'小猿学练机',
    const keyworkds = ['商圈']; //['作业帮', '科大讯飞', '小度全屋智能'];
    // 北京、上海、广州、深圳、成都、杭州、南京、武汉、天津、西安、重庆、青岛、沈阳、长沙、大连、
    const oneLine =
      '北京、上海、广州、深圳、成都、杭州、南京、武汉、天津、西安、重庆、青岛、沈阳、长沙、大连、厦门、无锡、福州、济南'
        .split('、')
        .map((item) => {
          return { name: item, type: 'oneLine' };
        });
    const twoLine =
      '宁波、昆明、苏州、郑州、长春、合肥、南昌、哈尔滨、常州、烟台、南宁、温州、石家庄、太原、珠海、南通、扬州、贵阳、东莞、徐州、大庆、佛山、威海、洛阳、淮安、呼和浩特、镇江、潍坊、桂林、中山、临沂、咸阳、包头、嘉兴、惠州、泉州'
        .split('、')
        .map((item) => {
          return { name: item, type: 'twoLine' };
        });
    // 宜兴市、
    const threeLine =
      '三亚、赣州、九江、金华、泰安、榆林、许昌、新乡、舟山、慈溪、南阳、聊城、海口、东营、淄博、漳州、保定、沧州、丹东、绍兴、唐山、湖州、揭阳、江阴、营口、衡阳、郴州、鄂尔多斯、泰州、义乌、汕头、宜昌、大同、鞍山、湘潭、盐城、马鞍山、襄樊、长治、日照、常熟、安庆、吉林市、乌鲁木齐、兰州、秦皇岛、肇庆、西宁、介休、滨州、台州、廊坊、邢台、株洲、德阳、绵阳、双流、平顶山、龙岩、银川、芜湖、晋江、连云港、张家港、锦州、岳阳、长沙县、济宁、邯郸、江门、齐齐哈尔、昆山、柳州、绍兴县、运城、齐河'
        .split('、')
        .map((item) => {
          return { name: item, type: 'threeLine' };
        });
    // 宜兴市、

    const fourLine =
      '张家口、湛江、眉山、常德、盘锦、枣庄、资阳、宜宾、赤峰、余姚、清远、蚌埠、宁德、德州、宝鸡、牡丹江、阜阳、莆田、诸暨、黄石、吉安、延安、拉萨、海宁、通辽、黄山、长乐、安阳、增城、桐乡、上虞、辽阳、遵义、韶关、泸州、南平、滁州、温岭、南充、景德镇、抚顺、乌海、荆门、阳江、曲靖、邵阳、宿迁、荆州、焦作、丹阳、丽水、延吉、延边朝鲜族自治州、茂名、梅州、渭南、葫芦岛、娄底、滕州、上饶、富阳、内江、三明、淮南、孝感、溧阳、乐山、临汾、攀枝花、阳泉、长葛'
        .split('、')
        .map((item) => {
          return { name: item, type: 'fourLine' };
        });
    const fiveLine =
      '晋城、自贡、三门峡、赤峰、本溪、防城港、铁岭、随州、广安、广元、天水、遂宁、萍乡、西双版纳、绥化、鹤壁、湘西、松原、阜新、酒泉、张家界、黔西南、保山、昭通、河池、来宾、玉溪、梧州、鹰潭、钦州、云浮、佳木斯、克拉玛依、呼伦贝尔、贺州、通化、阳泉、朝阳、百色、毕节、贵港、丽江、安康、通辽、德宏、朔州、伊犁、文山、楚雄、嘉峪关、凉山、资阳、锡林郭勒盟、雅安'
        .split('、')
        .map((item) => {
          return { name: item, type: 'fiveLine' };
        });
// , twoLine, threeLine, fourLine, fiveLine
    const cities = [].concat(oneLine);
    // const cities = [].concat(fiveLine);

    const addresses = [];
    for (let i = 0; i < keyworkds.length; i++) {
      for (let j = 0; j < cities.length; j++) {
        const keyword = keyworkds[i];
        console.log(
          `${i + 1}/${keyworkds.length}  🚀 ~ keyword: ${keyword} 🚀 ~ city${
            j + 1
          }/${cities.length}:    ${cities[j].name}`,
        );

        const city = cities[j];
        // const keywordstr = `${keyword} ${city.name}`;
        const targetHost = `https://www.amap.com`;
        const items = (await clollectBusinessDistrict(
          targetHost,
          keyword,
          city.name,
        )) as any;
        try {
          let prefix = '';
          if (j !== 0) {
            prefix = ',';
          } else {
            appendFileSync(`businessDistricts/${city.type}.json`, '[');
          }
          appendFileSync(
            `businessDistricts/${city.type}.json`,
            prefix + JSON.stringify({ items, keyword, city }),
          );

          if (j + 1 === cities.length) {
            appendFileSync(`${keyword}.json`, ']');
          }
        } catch (error) {
          console.error('保存失败');
        }
      }
    }

    // 通知知音楼开始爬取数据
    try {
      // 排除广告 非笔记类型数据
    } catch (error) {
      console.error(error);
    }
    return '搜索数据结束';
  }
}
