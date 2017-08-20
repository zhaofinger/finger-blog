const bcrypt = require('bcryptjs');
const user = require('../models/user');
const article = require('../models/article');
const calPageIndex = require('../utils/calPageIndex');

/**
 * 判断用户是否登录
 * @param {object} ctx 上下文对象
 */
const isLogin = function(ctx) {
	// 是否登录重定向到登录
	if (!(ctx.session && ctx.session.isLogin)) {
		return ctx.redirect('./login');
	}
};

module.exports = {
	// 登录
	async login(ctx) {
		// 自动登录
		if (ctx.session && ctx.session.isLogin) {
			ctx.redirect('./list');
		}
		const title = '赵的拇指管理后台';
		if (ctx.method === 'GET') {
			await ctx.render('admin/login', {
				title
			});
		// 登录处理
		} else if (ctx.method === 'POST') {
			const formData = ctx.request.body;
			const userInfo = await user.signIn(formData.username);
			const result = bcrypt.compareSync(formData.password, userInfo.password);
			if (result) {
				let session = ctx.session;
				session.isLogin = true;
				session.username = userInfo.username;
				session.userId = userInfo.id;
				ctx.redirect('./list');
			} else {
				ctx.body = '账号密码错误';
			}
		}
	},
	// 创建用户
	async create(ctx) {
		let salt = bcrypt.genSaltSync(10);
		const userModal = {
			id: null,
			role: 0,
			username: 'admin',
			email: 'zhbqsj@126.com',
			password: bcrypt.hashSync('123456', salt),
			nickname: '赵的拇指',
			created_at: (new Date()).getTime(),
			updated_at: (new Date()).getTime()
		};
		let result = await user.create(userModal);
		console.log(result);
		ctx.body = result;
	},
	// 后台首页
	async index(ctx) {
		isLogin(ctx);

		let session = ctx.session;
		const title = '赵的拇指管理后台';
		const userInfo = {
			username: session.username,
			id: session.id
		};
		await ctx.render('admin/index', {
			title, userInfo
		});
	},
	// 文章列表
	async list(ctx) {
		isLogin(ctx);
		// 获取当前页码
		let nowPage = ctx.request.query.page || 1;
		const num = 10;
		const title = '赵的拇指管理后台-文章列表';
		// 文章列表
		const articleList = await article.getArticleList({start: (nowPage - 1) * num, end: num});
		// 文章总页数
		const totalCount = (await article.getArticleCount())[0].total_count;
		// 显示分页
		let pageArr = calPageIndex(nowPage, Math.ceil(totalCount / num));
		// 现在页数
		await ctx.render('admin/list', {
			title, articleList, pageArr
		});
	},
	// 编辑页面
	async edit(ctx) {
		isLogin(ctx);
		if (ctx.method === 'GET') {
			let articleModel = null;
			let title = '发表文章';
			if (ctx.request.query.id) {
				articleModel = await article.getArticleDetail(ctx.request.query.id);
				if (articleModel) {
					title = '编辑文章';
				}
			}
			let articleType = await article.getArticleTypes();
			await ctx.render('admin/edit', {
				title,
				articleType,
				articleModel
			});
		} else if (ctx.method === 'POST') {
			let formData = ctx.request.body;
			if (formData.newType) {
				try {
					// 文章type model
					let result = await article.createType({
						name: formData.newType,
						created_at: (new Date()).getTime(),
						updated_at: (new Date()).getTime()
					});
					formData.type = result.insertId;
				} catch (error) {
					throw(error);
				}
			}
			// 文章model
			let articleModel = {
				id: formData.id,
				title: formData.title,
				type: formData.type,
				desc: formData.desc,
				label: formData.label,
				content_md: formData['editormd-markdown-doc'],
				content_render: formData['editormd-html-code'],
				is_show: formData.status,
				created_at: formData.created_at || (new Date()).getTime(),
				updated_at: (new Date()).getTime()
			};
			if (formData.id) {
				// 更新
				await article.updateArticle(articleModel, formData.id);
			} else {
				// 新建
				await article.createArticle(articleModel);
			}
			ctx.redirect('./list');
		}
	}
};