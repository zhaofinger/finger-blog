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
	 * 获取文章列表
	 * @param {object} page 文章分页开始结束
	 */
	async getArticleList(page) {
		let result = await dbUtils.findDataByPage('article', 'created_at', 'DESC', '*', page.start, page.end);
		return result;
	},
	/**
	 * 获取文章详情
	 * @param {*} id 文章id
	 */
	async getArticleDetail(id) {
		let result = await dbUtils.findDataById('article', id);
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
	 * @param {*} model
	 */
	async updateArticle(model, id) {
		let result = await dbUtils.updateData('article', model, id);
		return result;
	},
};

module.exports = article;