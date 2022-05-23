const { IMG_PRE } = require('../../const');
const article = require('../models/article');
const timeFormat = require('../utils/time-format');
const marked = require('marked');
const generateToken = require('../utils/generate-qiniu-token');
const sendMail = require('../utils/mail');
const { adminMail } = require('../../config');

marked.setOptions({ sanitize: true });

module.exports = {
  /**
   * 文章浏览次数
   * @param {object} ctx
   */
  async views(ctx) {
    const articleId = ctx.params.articleId;
    let result = await article.updateArticleViewCount(articleId);
    return ctx.body = {
      status: 200,
      data: {
        viewCount: result.view_count
      }
    };
  },
  /**
   * 获取电影页
   * @param {object} ctx
   */
  async getFilmList(ctx) {
    let nowPageIndex = ctx.request.query.start || 1;
    let num = ctx.request.query.num || 6;
    let filmList = await article.getFilmList({start: (nowPageIndex - 1) * num, end: num});
    filmList = filmList.map(item => {
      item.created_at = timeFormat(item.created_at);
      item.cover = IMG_PRE + item.cover;
      return item;
    });
    return ctx.body = {
      status: 200,
      data: { filmList }
    };
  },
  /**
   * 发表评论
   * @param {object} ctx
   */
  async comment(ctx) {
    const commentModel = ctx.request.body;
    if (!commentModel.author || !commentModel.email || !commentModel.content) {
      return ctx.body = {
        status: 500,
        message: '请输入正确的字段'
      };
    }
    if (!commentModel.parent_id) {
      commentModel.parent_id = null;
    }
    commentModel.content_md = commentModel.content;
    commentModel.content = marked(commentModel.content);
    commentModel.article_id = ctx.params.articleId;
    commentModel.created_at = (new Date()).getTime();

    let result = await article.addComment(commentModel);

    // 评论文章，发送邮件给管理员
    // sendMail(adminMail, '文章收到新的评论', `${commentModel.author}评论了您的<a href="http://www.zhaofinger.com/detail/${commentModel.article_id}">文章</a>`)
    // if (commentModel.parent_id) {
    //   // 发送邮件给父评论者
    //   let parentCommentDetail = await article.getCommentDetail(commentModel.parent_id);
    //   console.log(parentCommentDetail);
    //   sendMail(parentCommentDetail.email, '有人评论了您', `${commentModel.author}评论了您的<a href="http://www.zhaofinger.com/detail/${commentModel.article_id}">评论</a>`);
    // }

    result.created_at = timeFormat(result.created_at, 'yyyy-MM-dd hh:mm:ss');
    return ctx.body = {
      status: 200,
      data: result
    };
  },
  /**
   * 删除文章
   * @param {object} ctx
   */
  async deleteArticle(ctx) {
    const articleId = ctx.params.articleId;
    await article.deleteArticle(articleId);
    return ctx.body = {
      status: 200,
      data: '删除成功'
    };
  },
  /**
   * 生成七牛 token
   * @param {object} ctx
   */
  async generateQiniuToken(ctx) {
    let token = generateToken();
    return ctx.body = {
      status: 200,
      data: { token }
    };
  }
};