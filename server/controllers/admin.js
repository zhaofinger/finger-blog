const bcrypt = require('bcryptjs');
const userService = require('./../services/user');

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
			let userInfo = await userService.signIn(formData);
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
	async index(ctx) {
		// 是否登录
		if (ctx.session && ctx.session.isLogin) {
			let session = ctx.session;
			const title = 'Finger管理后台';
			const userInfo = {
				username: session.username,
				id: session.id
			};
			await ctx.render('admin/index', {
				title, userInfo
			});
		} else {
			ctx.redirect('./login');
		}
	},
	async edit(ctx) {
		let title = '编辑';
		await ctx.render('admin/edit', {
			title
		});
	}
};