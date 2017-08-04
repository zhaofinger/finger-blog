/**
 * 管理员用户子路由
 */

const router = require('koa-router')();
const admin = require('../controllers/admin');

module.exports = router
	.get('/login', admin.login)
	.post('/login', admin.login)
	.get('/index', admin.index)
	.get('/edit', admin.edit)
	.post('/edit', admin.edit);