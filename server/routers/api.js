/**
 * api 请求解析
 */

const router = require('koa-router')();
const api = require('../controllers/api');

module.exports = router
	.post('/api/article/view-count/:articleId', api.views)
	.get('/api/article/film-list', api.getFilmList)
	.post('/api/article/comment/:articleId', api.comment)
	.post('/api/article/delete-article/:articleId', api.deleteArticle)
	.get('/api/**/*', api.generateQiniuToken)
	.get('/api/qiniu/token', api.generateQiniuToken);