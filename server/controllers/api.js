const article = require('../models/article');

module.exports = {
	/**
	 * 文章浏览次数
	 * @param {*} ctx
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
	}
};