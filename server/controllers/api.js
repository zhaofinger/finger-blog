const article = require('../models/article');

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
	 * 发表评论
	 * @param {object} ctx
	 */
	async comment(ctx) {
		const commentModel = ctx.request.body;
		if (!commentModel.username || !commentModel.email || !commentModel.content) {
			return ctx.body = {
				status: 500,
				message: '请输入正确的字段'
			};
		}
		commentModel.article_id = ctx.params.articleId;
		commentModel.created_at = (new Date()).getTime();
		let result = await article.addComment(commentModel);
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
	}
};