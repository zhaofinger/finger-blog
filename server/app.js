const path = require('path');
const Koa = require('koa');
const views = require('koa-views');
const nunjucks = require('nunjucks');
const koaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');
const koaLogger = require('koa-logger');
const session = require('koa-session-minimal');
const redisStore = require('koa-redis');

const app = new Koa();

const { PORT, HOST, friendsLink } = require('./../config');
const { IMG_PRE } = require('./../const');

const routers = require('./routers/index');

const env = process.env.NODE_ENV;

// cookie
// 存放sessionId的cookie配置
/* session cookie */
let cookieConfig = {
	maxAge: 86400000,			// cookie有效时长
	expires: '',				// cookie失效时间
	path: '',					// 写cookie所在的路径
	domain: HOST,				// 写cookie所在的域名
	httpOnly: true,				// 是否只用于http请求中获取
	overwrite: true,			// 是否允许重写
	secure: '',
	sameSite: '',
	signed: '',
};
// 配置session中间件
app.use(session({
	key: 'USER_SID',
	store: redisStore(),
	cookie: cookieConfig
}));

app.use(koaLogger());

// 配置ctx.body解析中间件
app.use(bodyParser());

// 配置静态资源加载中间件
app.use(koaStatic(
	path.join(__dirname , '../client/static')
));

// 配置服务端模板渲染引擎中间件
const nunjucksEnv = new nunjucks.Environment(
	new nunjucks.FileSystemLoader(path.join(__dirname, '../client/views'), {
		noCache: env === 'development'
	})
);

nunjucksEnv.addGlobal('IMG_PRE', IMG_PRE);
nunjucksEnv.addGlobal('FRIENDS_LINK', friendsLink);

app.use(views(path.join(__dirname, '../client/views'), {
	extension: 'nj',
	options: {
		nunjucksEnv: nunjucksEnv
	},
	map: {
		nj: 'nunjucks'
	}
}));

// 初始化路由中间件
app.use(routers.routes()).use(routers.allowedMethods());
app.use(async ctx => {
	if (ctx.status === 404) {
		ctx.redirect('/not-found');
	}
});

// 监听启动端口
app.listen(PORT);
console.log(`the server is start at port ${PORT}`);
