/**
 * api 请求解析
 */

const router = require('koa-router')();
const api = require('../controllers/api');

module.exports = router
	.post('/article/view-count/:articleId', api.views)
	.post('/article/comment/:articleId', api.comment)
	.post('/article/delete-article/:articleId', api.deleteArticle);