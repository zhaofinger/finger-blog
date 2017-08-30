const article = require('../models/article');
const calPageIndex = require('../utils/cal-page-index');
const timeFormat = require('../utils/time-format');

module.exports = {
	async index(ctx) {
		let title = '赵的拇指';
		const nowPage = 'index';

		await ctx.render('app/index', {
			nowPage, title
		});
	},
	async article(ctx) {
		const title = '赵的拇指-文章列表';
		const nowPage = 'article';

		// 获取当前页码
		let nowPageIndex = ctx.request.query.page || 1;
		const num = 6;
		// 已发布文章列表
		const articleList = await article.getArticleListWithType({start: (nowPageIndex - 1) * num, end: num});
		articleList.map(item => {
			item.created_at = timeFormat(new Date(item.created_at), 'yyyy-MM-dd');
			return item;
		});
		// 已发布文章总页数
		const totalCount = (await article.getArticlePubCount())[0].total_count;
		// 显示分页
		let pageArr = calPageIndex(nowPageIndex, Math.ceil(totalCount / num));

		await ctx.render('app/article', {
			nowPage, title, articleList, pageArr, nowPageIndex, totalCount
		});
	},
	async detail(ctx) {
		const id = ctx.params.id;
		const articleDetail = await article.getArticleDetail(id);
		const title = articleDetail.title;
		articleDetail.created_at = timeFormat(new Date(articleDetail.created_at), 'yyyy-MM-dd');
		await ctx.render('app/detail', {
			title, articleDetail
		});
	},
	async about(ctx) {
		const title = '赵的拇指-关于';
		const nowPage = 'about';
		await ctx.render('app/about', {
			title, nowPage
		});

	}
};