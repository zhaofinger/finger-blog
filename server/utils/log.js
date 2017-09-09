const log4js = require('log4js');
const logConfig = require('../../config').logConfig;

// 加载log配置文件
log4js.configure(logConfig);

const logUtil = {};

const errorLogger = log4js.getLogger('errorLogger');
const resLogger = log4js.getLogger('resLogger');

// 处理错误日志
logUtil.logError = (ctx, error, resTime) => {
	if (ctx && error) {
		errorLogger.error(formatError(ctx, error, resTime));
	}
};

// 处理响应日志
logUtil.logResponse = (ctx, resTime) => {
	if (ctx) {
		resLogger.info(formatRes(ctx, resTime));
	}
};

//格式化错误日志
const formatError = function (ctx, err, resTime) {
	let logText = new String();
	logText += '\n' + '*************** error log start ***************' + '\n';	// 错误信息开始
	logText += formatReqLog(ctx.request, resTime);								// 添加请求日志
	logText += 'error name: ' + err.name + '\n';								// 错误名称
	logText += 'error message: ' + err.message + '\n';							// 错误信息
	logText += 'error stack: ' + err.stack + '\n';								// 错误详情
	logText += '*************** error log end ***************' + '\n';			// 错误信息结束
	return logText;
};
// 格式化响应日志
const formatRes = (ctx, resTime) => {
	let logText = new String();
	logText += '\n' + '*************** response log start ***************' + '\n';	// 响应日志开始
	logText += formatReqLog(ctx.request, resTime);									// 添加请求日志
	logText += 'response status: ' + ctx.status + '\n';								// 响应状态码
	logText += 'response body: ' + '\n' + JSON.stringify(ctx.body) + '\n';			// 响应内容
	logText += '*************** response log end ***************' + '\n';			// 响应日志结束
	return logText;
};

//格式化请求日志
const formatReqLog = (req, resTime) => {
	let logText = new String();
	const method = req.method;
	logText += 'request method: ' + method + '\n';					// 访问方法
	logText += 'request originalUrl:  ' + req.originalUrl + '\n';	// 请求原始地址
	logText += 'request client ip:  ' + req.ip + '\n'; 				// 客户端ip
	if (method === 'GET') {
		logText += 'request query:  ' + JSON.stringify(req.query) + '\n';
	} else {
		logText += 'request body: ' + '\n' + JSON.stringify(req.body) + '\n';
	}
	logText += 'response time: ' + resTime + '\n';					// 服务器响应时间


	return logText;
};

module.exports = logUtil;