/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import {
  updateOrCreateNotes,
  updateNote,
  updateOrCreateComment,
} from './utils/api';
@Injectable()
export class AppService {
  constructor(private readonly logger: Logger) {}
  getHello() {
    const info = 'hello world';
    return info;
  }

  /**
   * 新增/更新笔记列表
   * @param items
   * @returns
   */
  async createFeeds(items: any) {
    this.logger.log('开始保存小红书笔记');
    if (!items || items.length === 0) {
      this.logger.log(
        '没有获取到小红书笔记数据',
        AppService.name + '保存小红书数据',
      );
      return false;
    }
    items = items?.filter(
      (item) => item.model_type === 'note' || item.modelType === 'note',
    );
    items = items.map((item) => {
      // 兼容接口和 ssr 数据格式不一致问题
      const note_card = item?.note_card || item?.noteCard;
      const user = note_card.user;
      delete user.nickName;
      return {
        note_id: item.id,
        type: item.model_type || item.modelType,
        desc: '',
        interact_info: note_card.interact_info || note_card.interactInfo,
        title: note_card.display_title || note_card.displayTitle,
        user: note_card.user,
        image_list: note_card.image_list || note_card.imageList,
        create_time: new Date(),
      };
    });
    const [result, error] = await updateOrCreateNotes(items);
    if (!error && result.data.code === 0) {
      this.logger.log(
        `保存条数 ${items.length}`,
        AppService.name + '保存小红书笔记列表成功',
      );
    } else {
      this.logger.warn(
        `错误内容 ${error}`,
        AppService.name + '保存小红书笔记列表错误 ',
      );
      this.logger.warn(
        `错误内容 ${error.data}`,
        AppService.name + '保存小红书笔记列表错误 ',
      );
    }
    return result;
  }
  /**
   * 插入或更新笔记评论
   * @param comments
   * @returns
   */
  async createComments(res, keyword) {
    const { note } = res;
    let { comments } = res;
    comments = comments.list;
    if (!comments || comments.length === 0) {
      this.logger.log(
        '没有获取到小红书评论数据',
        AppService.name + '保存小红书评论数据',
      );
      return;
    }
    // 笔记爬取时间
    const crawling_time = new Date().getTime();
    comments.forEach(async (commentDoc) => {
      // 爬取时间
      commentDoc.crawling_time = crawling_time;
      commentDoc.keyword = keyword;
      if (!commentDoc.note_id) {
        commentDoc.note_id = commentDoc.noteId;
        commentDoc.at_users = commentDoc.atUsers;
        commentDoc.like_count = commentDoc.like_count;
        commentDoc.sub_comment_count = commentDoc.subCommentCount;
        commentDoc.sub_comments = commentDoc.subComments;
        commentDoc.create_time = commentDoc.createTime;
        commentDoc.user_info = commentDoc.userInfo;

        delete commentDoc.noteId;
        delete commentDoc.atUsers;
        delete commentDoc.like_count;
        delete commentDoc.subCommentCount;
        delete commentDoc.subComments;
        delete commentDoc.userInfo;
        delete commentDoc.createTime;
      }
    });
    const noteTitle = note.title;
    const noteUpdateTime = note.last_update_time || note.lastUpdateTime;
    const ipLocation = note.ipLocation;
    const [result, error] = await updateOrCreateComment({
      noteTitle,
      ipLocation,
      noteUpdateTime,
      data: comments,
    });
    if (!error && result.data.code === 0) {
      this.logger.log(
        `评论条数 ${comments.length}`,
        AppService.name + '保存小红书笔记评论数据成功',
      );
    } else {
      this.logger.warn(
        `错误内容 ${error}`,
        AppService.name + '保存小红书笔记评论数据错误 ',
      );
      this.logger.warn(
        `错误内容 ${error}`,
        AppService.name + '保存小红书笔记评论数据错误 ',
      );
    }
    return null;
  }
  /**
   * 更新单个笔记内容，不更新 creteTime
   * @param note
   */
  async updateNote(note, keyword) {
    // 没有这个字段服务端报错
    note.create_time = new Date();
    note.keyword = keyword;
    if (!note.note_id) {
      note.note_id = note.noteId;
      note.interact_info = note.interactInfo;
      note.tag_list = note.tagList;
      note.last_update_time = note.lastUpdateTime;
      note.at_user_list = note.atUserList;
      note.image_list = note.imageList;

      delete note.noteId;
      delete note.interactInfo;
      delete note.tagList;
      delete note.lastUpdateTime;
      delete note.atUserList;
      delete note.imageList;
    }

    // 只有笔记最后更新日期是近一个月的笔记才更新 后端限制爬虫不做限制
    // const now = dayjs();
    // const before90 = now.subtract(90, 'day');
    // // 是否是 90天 内的时间
    // const isValidTime = dayjs(note.last_update_time).isBetween(
    //   now,
    //   before90,
    //   'day',
    //   '[]',
    // );
    // this.logger.log(
    //   `🚀 ~ AppService ~ ${note.last_update_time} ~ isValidTime: ${isValidTime}`,
    //   AppService.name + '判断笔记更新时间是否在最近 90 天内',
    // );

    // 不在就不记录
    // if (!isValidTime) {
    //   // 不满足条件的笔记删除笔记操作
    //   return false;
    // }

    const [result, error] = await updateNote(note);
    if (!error && result.data.code === 0) {
      this.logger.log(
        `笔记内容 ${result.config.data}`,
        AppService.name + '更新小红书笔记数据成功',
      );
    } else {
      this.logger.warn(
        `错误内容 ${error}`,
        AppService.name + '更新小红书笔记数据错误 ',
      );
    }
    return null;
  }

  /**
   * 查询笔记列表
   * */
  findNotes() {
    console.log('查询笔记列表');
  }
}
