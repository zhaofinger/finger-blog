/**
 * 集合所有子路由
 */

const router = require('koa-router')();
const admin = require('./admin');
const app = require('./app');

router.use('/admin', admin.routes(), admin.allowedMethods());
router.use('', app.routes(), app.allowedMethods());

module.exports = router;
