const article = require('../models/article');
const calPageIndex = require('../utils/cal-page-index');
const timeFormat = require('../utils/time-format');
const { IMG_PRE } = require('../../const');

module.exports = {
	/**
	 * 首页
	 * @param {*} ctx
	 */
	async index(ctx) {
		let title = '赵的拇指';
		const nowPage = 'index';

		await ctx.render('app/index', {
			nowPage, title
		});
	},
	/**
	 * 文章列表
	 * @param {*} ctx
	 */
	async article(ctx) {
		const title = '赵的拇指-文章列表';
		const nowPage = 'article';

		// 获取当前页码
		let nowPageIndex = ctx.request.query.page || 1;
		const num = 6;

		// 有分类，取分类Id
		let typeId = '';
		if (ctx.path.split('/')[2] === 'type') {
			typeId = ctx.params.typeId;
		}

		// 已发布文章列表
		let articleList = await article.getArticleList({start: (nowPageIndex - 1) * num, end: num}, typeId);
		articleList = articleList.map(item => {
			item.created_at = timeFormat(item.created_at);
			return item;
		});

		// 已发布文章总页数
		const totalCount = (await article.getArticlePubCount(typeId))[0].total_count;

		// 显示分页
		let pageArr = calPageIndex(nowPageIndex, Math.ceil(totalCount / num));

		await ctx.render('app/article', {
			nowPage, title, articleList, pageArr, nowPageIndex, totalCount
		});
	},
	/**
	 * 文章章节
	 * @param {*} ctx
	 */
	async type(ctx) {
		const title = '赵的拇指-文章列表';
		const nowPage = 'type';
		const articleType = await article.getArticleTypes();

		await ctx.render('app/type', {
			nowPage, title, articleType
		});
	},
	/**
	 * 文章详情
	 * @param {*} ctx
	 */
	async detail(ctx) {
		const id = ctx.params.id;
		const articleDetail = await article.getArticleDetail(id);
		const title = articleDetail.title;
		articleDetail.created_at = timeFormat(articleDetail.created_at);

		// 标签
		const labelArr = articleDetail.label && articleDetail.label.split(' ');

		// 浏览次数
		const viewCount = articleDetail.view_count;

		// 评论列表
		let commentList = await article.getCommentList(id);
		commentList = commentList.map(item => {
			item.created_at = timeFormat(item.created_at, 'yyyy-MM-dd hh:mm:ss');
			if (item.parent_id) {
				for (let _item of commentList) {
					if (_item.id === item.parent_id) {
						item.parent = _item;
						break;
					}
				}
			}
			return item;
		});

		if (articleDetail.is_photo) {
			articleDetail.content_render = articleDetail.content_render.split('||').map(item => IMG_PRE + item);
		}

		await ctx.render('app/detail', {
			title, articleDetail, labelArr, viewCount, commentList
		});
	},
	/**
	 * 摄影
	 * @param {*} ctx
	 */
	async photo(ctx) {
		const title = '赵的拇指-摄影';
		const nowPage = 'photo';

		// 获取当前页码
		let nowPageIndex = ctx.request.query.page || 1;
		const num = 6;

		// 已发布文章列表
		let photoList = await article.getPhotoList({start: (nowPageIndex - 1) * num, end: num});
		photoList = photoList.map(item => {
			item.created_at = timeFormat(item.created_at);
			item.cover = IMG_PRE + item.content_render.split('||')[0];
			return item;
		});

		// 已发布文章总页数
		const totalCount = (await article.getPhotoPubCount())[0].total_count;

		// 显示分页
		let pageArr = calPageIndex(nowPageIndex, Math.ceil(totalCount / num));

		await ctx.render('app/photo', {
			nowPage, title, photoList, pageArr, nowPageIndex, totalCount
		});
	},
	/**
	 * 摄影
	 * @param {*} ctx
	 */
	async film(ctx) {
		const title = '赵的拇指-电影';
		const nowPage = 'film';

		// 获取当前页码
		let nowPageIndex = ctx.request.query.page || 1;
		const num = 6;

		// 已发布文章列表
		let filmList = await article.getFilmList({start: (nowPageIndex - 1) * num, end: num});
		filmList = filmList.map(item => {
			item.created_at = timeFormat(item.created_at);
			item.cover = IMG_PRE + item.cover;
			return item;
		});

		await ctx.render('app/film', {
			nowPage, title, filmList
		});
	},
	/**
	 * 关于
	 * @param {*} ctx
	 */
	async about(ctx) {
		const title = '赵的拇指-关于';
		const nowPage = 'about';
		await ctx.render('app/about', {
			title, nowPage
		});
	},
	/**
	 * 关于
	 * @param {*} ctx
	 */
	async notFound(ctx) {
		const title = '赵的拇指';
		const nowPage = '404';
		await ctx.render('app/404', {
			title, nowPage
		});
	}
};