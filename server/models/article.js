const dbUtils = require('../utils/db-utils');

const article = {
	/**
	 * 获取是所有文章type
	 */
	async getArticleTypes() {
		let result = await dbUtils.select('article_type', ['name', 'id']);
		return result;
	},
	/**
	 * 分页获取文章列表
	 * @param {object} page 分页开始结束
	 * @param {string} typeId 分类id
	 * @param {boolean} isPub 是否发布
	 */
	async getArticleList(page, typeId, isPub = true) {
		let _sql = `
			SELECT * FROM article
				${typeId || isPub ? 'WHERE' : '' }
				${isPub ? 'is_publish = 1' : ''}
				${typeId && isPub ? 'AND' : '' }
				${typeId ? 'type = ' + typeId : ''}
				${typeId || isPub ? 'AND' : 'WHERE' } is_delete = 0
			ORDER BY article.created_at DESC
			LIMIT ${page.start} , ${page.end}`;
		let result = await dbUtils.query(_sql);
		return result;
	},
	/**
	 * 获取文章详情
	 * @param {string} id 文章id
	 */
	async getArticleDetail(id) {
		let _sql = `
			SELECT article.*, article_type.name AS type_name FROM article, article_type
			WHERE article.id = ${id} AND article.type = article_type.id`;
		let result = await dbUtils.query(_sql);

		if (result.length) {
			return result[0];
		}
		return null;
	},
	/**
	 * 获取文章总数
	 */
	async getArticleCount() {
		let result = await dbUtils.count('article');
		return result;
	},
	/**
	 * 获取已经发布文章总数
	 * @param {string} typeId 文章typeid
	 */
	async getArticlePubCount(typeId = null) {
		let _sql = `
			SELECT COUNT(*) AS total_count FROM article
			WHERE is_publish = 1 AND is_delete = 1 ${typeId ? 'AND type = ' + typeId : ''}
			`;
		let result = dbUtils.query(_sql);
		return result;
	},
	/**
	 * 新建文章分类
	 * @param {object} model 新建文章type
	 */
	async createType(model) {
		let result = await dbUtils.insertData('article_type', model);
		return result;
	},
	/**
	 * 新文章
	 * @param {object} model 文章数据模型
	 */
	async createArticle(model) {
		let result = await dbUtils.insertData('article', model);
		return result;
	},
	/**
	 * 更新文章
	 * @param {object} model
	 * @param {string} id
	 */
	async updateArticle(model, id) {
		let result = await dbUtils.updateData('article', model, id);
		return result;
	},
	/**
	 * 更新文章阅读次数
	 * @param {string} id
	 */
	async updateArticleViewCount(id) {
		// 更新文章浏览次数
		let _updateArticleViewsSql = `
			UPDATE article SET view_count = view_count + 1
			WHERE id = ${id}
		`;
		await dbUtils.query(_updateArticleViewsSql);

		// 获取文章浏览次数
		let _getArticleViewsSql = `
			SELECT view_count FROM article
			WHERE id = ${id}
		`;
		let viewCount = (await dbUtils.query(_getArticleViewsSql))[0];
		return viewCount;
	},
	/**
	 * 删除文章
	 * @param {string} id
	 */
	async deleteArticle(id) {
		// 删除文章 软删除
		let _sql = `
			UPDATE article SET is_delete = 1
			WHERE id = ${id}
		`;
		let result = await dbUtils.query(_sql);
		return result;
	}
};

module.exports = article;