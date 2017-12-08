const article = require('../models/article');
const timeFormat = require('../utils/time-format');
const marked = require('marked');
const generateToken = require('./upload');

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