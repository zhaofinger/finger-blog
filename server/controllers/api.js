const article = require('../models/article');

module.exports = {
	/**
	 * 文章浏览次数
	 * @param {object} ctx
	 */
	async views(ctx) {
		const articleId = ctx.params.articleId;
		let result = await article.updateArticleViewCount(articleId);
		ctx.body = {
			status: 200,
			data: {
				viewCount: result.view_count
			}
		};
	},
	/**
	 * 删除文章
	 * @param {object} ctx
	 */
	async deleteArticle(ctx) {
		const articleId = ctx.params.articleId;
		await article.deleteArticle(articleId);
		ctx.body = {
			status: 200,
			data: '删除成功'
		};
	}
};