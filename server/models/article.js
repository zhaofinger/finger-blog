const dbUtils = require('../utils/db-utils');

const article = {
	/**
	 * 获取是所有文章type
	 */
	async getArticleType() {
		let result = await dbUtils.select('article_type', ['name', 'id']);
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
	}
};

module.exports = article;