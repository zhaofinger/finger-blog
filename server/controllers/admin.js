// const user = require('../services/user');
const bcrypt = require('bcryptjs');
const userInfoService = require('./../services/user');

module.exports = {
	async login(ctx) {
		// const userInfo = await user.getExistOne({ username: 'admin', email: '' });
		const title = 'Finger管理后台';
		if (ctx.method === 'GET') {
			await ctx.render('admin/login', {
				title
			});
		// 登录处理
		} else if (ctx.method === 'POST') {
			let formData = ctx.request.body;
			let userInfo = await userInfoService.signIn(formData);
			let result = bcrypt.compareSync(formData.password, userInfo.password);
			if (result) {
				console.log(userInfo);
				return userInfo;
			}
		}
	},
};