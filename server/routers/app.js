/**
 * 管理员用户子路由
 */

const router = require('koa-router')();
const app = require('../controllers/app');

module.exports = router
	.get('/', app.index)
	.get('/index', app.index)
	.get('/article', app.article)
	.get('/article/type/:typeId', app.article)
	.get('/article/label/:labelId', app.article)
	.get('/film', app.film)
	.get('/photo', app.photo)
	.get('/type', app.type)
	.get('/detail/:id', app.detail)
	.get('/about', app.about)
	.get('/not-found', app.notFound);