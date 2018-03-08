/**
 * 管理员用户子路由
 */

const router = require('koa-router')();
const admin = require('../controllers/admin');

module.exports = router
	.get('/create', admin.create)
	.get('/login', admin.login)
	.post('/login', admin.login)
	.get('/index', admin.index)
	.get('/edit', admin.edit)
	.post('/edit', admin.edit)
	.get('/list', admin.list)
	.get('/user', admin.user)
	.post('/user', admin.user)
	.get('/photo', admin.photo)
	.get('/film', admin.film);