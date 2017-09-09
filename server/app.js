const path = require('path');
const Koa = require('koa');
// const convert = require('koa-convert');
const views = require('koa-views');
const nunjucks = require('nunjucks');
const koaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');
const koaLogger = require('koa-logger');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const app = new Koa();

const {databaseConfig, PORT, HOST} = require('./../config');
const routers = require('./routers/index');
const logUtil = require('./utils/log');

const env = process.env.NODE_ENV;

// session存储配置
const sessionMysqlConfig= {
	user: databaseConfig.USERNAME,
	password: databaseConfig.PASSWORD,
	database: databaseConfig.DATABASE,
	host: 'localhost',
};

// cookie
// 存放sessionId的cookie配置
let cookie = {
	maxAge: '',			// cookie有效时长
	expires: '',		// cookie失效时间
	path: '',			// 写cookie所在的路径
	domain: HOST,		// 写cookie所在的域名
	httpOnly: true,		// 是否只用于http请求中获取
	overwrite: true,	// 是否允许重写
	secure: '',
	sameSite: '',
	signed: '',
};

// 配置session中间件
app.use(session({
	key: 'USER_SID',
	store: new MysqlStore(sessionMysqlConfig),
	cookie: cookie
}));

// 测试 配置控制台日志中间件
// 正式 运行日志中间件
app.use(env !== 'production' ? koaLogger() : async (ctx, next) => {
	// 响应开始时间
	const start = new Date();
	// 响应间隔时间
	let ms;
	try {
		// 开始进入到下一个中间件
		await next();
		ms = new Date() - start;
		logUtil.logResponse(ctx, ms);		// 记录响应日志
	} catch (error) {
		ms = new Date() - start;
		logUtil.logError(ctx, error, ms);	// 记录异常日志
	}
});

// 配置ctx.body解析中间件
app.use(bodyParser());

// 配置静态资源加载中间件
app.use(koaStatic(
	path.join(__dirname , '../client/static')
));

// 配置服务端模板渲染引擎中间件
const nunjucksEnv = new nunjucks.Environment(
	new nunjucks.FileSystemLoader(path.join(__dirname, '../client/views'), {
		noCache: true
	})
);
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

// 监听启动端口
app.listen(PORT);
console.log(`the server is start at port ${PORT}`);
