/**
 * 集合所有子路由
 */

const router = require('koa-router')();
const admin = require('./admin');
const app = require('./app');
const api = require('./api');

router.use('/admin', admin.routes(), admin.allowedMethods());
router.use('', app.routes(), app.allowedMethods());
router.use('', api.routes(), api.allowedMethods());

module.exports = router;
