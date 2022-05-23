const dbUtils = require('../utils/db-utils');

const article = {
  /**
   * 获取是所有文章type
   */
  async getArticleTypes() {
    const result = await dbUtils.select('article_type', ['name', 'id']);
    return result;
  },
  /**
   * 分页获取文章列表
   * @param {object} page 分页开始结束
   * @param {string} typeId 分类id
   * @param {boolean} isPub 是否发布
   */
  async getArticleList(page, typeId, isPub = true) {
    const _sql = `
      SELECT * FROM article
        ${typeId || isPub ? 'WHERE' : ''}
        ${isPub ? 'is_publish = 1' : ''}
        ${typeId && isPub ? 'AND' : ''}
        ${typeId ? 'type = ' + typeId : ''}
        ${typeId || isPub ? 'AND' : 'WHERE'}
        is_film = 0 AND is_delete = 0
      ORDER BY article.created_at DESC
      LIMIT ${page.start} , ${page.end}`;
    const result = await dbUtils.query(_sql);
    return result;
  },
  /**
   * 分页获取照片列表
   * @param {object} page 分页开始结束
   */
  async getPhotoList(page) {
    const _sql = `
      SELECT * FROM article
      WHERE is_photo = 1 AND is_delete = 0 AND is_publish = 1
      ORDER BY article.created_at DESC
      LIMIT ${page.start} , ${page.end}`;
    const result = await dbUtils.query(_sql);
    return result;
  },
  /**
   * 分页获取电影列表
   * @param {object} page 分页开始结束
   */
  async getFilmList(page) {
    const _sql = `
      SELECT * FROM article
      WHERE is_film = 1 AND is_delete = 0 AND is_publish = 1
      ORDER BY article.created_at DESC
      LIMIT ${page.start} , ${page.end}`;
    const result = await dbUtils.query(_sql);
    return result;
  },
  /**
   * 获取文章详情
   * @param {string} id 文章id
   */
  async getArticleDetail(id) {
    const _sql = `
      SELECT article.*, article_type.name AS type_name FROM article, article_type
      WHERE article.id = ${id} AND article.type = article_type.id`;
    const result = await dbUtils.query(_sql);

    if (result.length) {
      return result[0];
    }
    return null;
  },
  /**
   * 获取文章总数
   */
  async getArticleCount() {
    const result = await dbUtils.count('article');
    return result;
  },
  /**
   * 获取对应文章评论
   * @param {string} id 文章id
   */
  async getCommentList(id) {
    const _sql = `
      SELECT * FROM comment WHERE article_id = ${id}
      ORDER BY comment.created_at DESC`;
    const result = await dbUtils.query(_sql);
    return result;
  },
  /**
   * 获取评论详情
   * @param {string} id
   */
  async getCommentDetail(id) {
    const _sql = `
      SELECT * FROM comment
      WHERE id = ${id}`;
    const result = await dbUtils.query(_sql);
    if (result.length) {
      return result[0];
    }
    return null;
  },
  /**
   * 获取已经发布文章总数
   * @param {string} typeId 文章typeid
   */
  async getArticlePubCount(typeId = null) {
    const _sql = `
      SELECT COUNT(*) AS total_count FROM article
      WHERE is_publish = 1 AND is_delete = 0 AND is_film = 0 ${typeId ? 'AND type = ' + typeId : ''}
    `;
    const result = dbUtils.query(_sql);
    return result;
  },
  /**
   * 获取photo总页数
   */
  async getPhotoPubCount() {
    const _sql = `
      SELECT COUNT(*) AS total_count FROM article
      WHERE is_publish = 1 AND is_delete = 0 AND is_photo = 1
    `;
    const result = dbUtils.query(_sql);
    return result;
  },
  /**
   * 新建文章分类
   * @param {object} model 新建文章type
   */
  async createType(model) {
    const result = await dbUtils.insertData('article_type', model);
    return result;
  },
  /**
   * 新文章
   * @param {object} model 文章数据模型
   */
  async createArticle(model) {
    const result = await dbUtils.insertData('article', model);
    return result;
  },
  /**
   * 更新文章
   * @param {object} model
   * @param {string} id
   */
  async updateArticle(model, id) {
    const result = await dbUtils.updateData('article', model, id);
    return result;
  },
  /**
   * 更新文章阅读次数
   * @param {string} id
   */
  async updateArticleViewCount(id) {
    // 更新文章浏览次数
    const _updateArticleViewsSql = `
      UPDATE article SET view_count = view_count + 1
      WHERE id = ${id}
    `;
    await dbUtils.query(_updateArticleViewsSql);

    // 获取文章浏览次数
    const _getArticleViewsSql = `
      SELECT view_count FROM article
      WHERE id = ${id}
    `;
    const viewCount = (await dbUtils.query(_getArticleViewsSql))[0];
    return viewCount;
  },
  /**
   * 删除文章
   * @param {string} id
   */
  async deleteArticle(id) {
    // 删除文章 软删除
    const _sql = `
      UPDATE article SET is_delete = 1
      WHERE id = ${id}
    `;
    const result = await dbUtils.query(_sql);
    return result;
  },
  /**
   * 增加文章评论
   * @param {object} model 评论model
   */
  async addComment(model) {
    const result = await dbUtils.insertData('comment', model);
    const comment = (await dbUtils.findDataById('comment', result.insertId))[0];
    // 父级评论内容
    if (comment.parent_id) {
      comment.parent = (await dbUtils.findDataById('comment', comment.parent_id))[0];
    }
    return comment;
  }
};

module.exports = article;