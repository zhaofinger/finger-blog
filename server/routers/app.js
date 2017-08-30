/**
 * 管理员用户子路由
 */

const router = require('koa-router')();
const app = require('../controllers/app');

module.exports = router
	.get('/', app.index)
	.get('/index', app.index)
	.get('/article', app.article)
	.get('/detail/:id', app.detail)
	.get('/about', app.about);