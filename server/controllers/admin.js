const bcrypt = require('bcryptjs');
const user = require('../models/user');
const article = require('../models/article');

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
	async login(ctx) {
		// 自动登录
		if (ctx.session && ctx.session.isLogin) {
			ctx.redirect('./index');
		}
		const title = 'Finger管理后台';
		if (ctx.method === 'GET') {
			await ctx.render('admin/login', {
				title
			});
		// 登录处理
		} else if (ctx.method === 'POST') {
			let formData = ctx.request.body;
			let userInfo = await user.signIn(formData.username);
			let result = bcrypt.compareSync(formData.password, userInfo.password);
			if (result) {
				let session = ctx.session;
				session.isLogin = true;
				session.username = userInfo.username;
				session.userId = userInfo.id;
				ctx.redirect('./index');
			} else {
				ctx.body = userInfo;
			}
		}
	},
	// 后台首页
	async index(ctx) {
		isLogin(ctx);

		let session = ctx.session;
		const title = 'Finger管理后台';
		const userInfo = {
			username: session.username,
			id: session.id
		};
		await ctx.render('admin/index', {
			title, userInfo
		});
	},
	// 编辑页面
	async edit(ctx) {
		isLogin(ctx);
		if (ctx.method === 'GET') {
			let title = '发表文章';
			let articleType = await article.getArticleType();
			await ctx.render('admin/edit', {
				title,
				articleType
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
				id: null,
				title: formData.title,
				type: formData.type,
				desc: formData.desc,
				label: formData.label,
				content_md: formData['editormd-markdown-doc'],
				content_render: formData['editormd-html-code'],
				is_show: formData.status,
				created_at: (new Date()).getTime(),
				updated_at: (new Date()).getTime()
			};
			await article.createArticle(articleModel);
			return ctx.redirect('./login');
		}
	}
};