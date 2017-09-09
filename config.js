const path = require('path');
const env = process.env.NODE_ENV;

// server端口
const PORT = env === 'production' ? 1113 : 1024;
const HOST = env === 'production' ? 'zhaofinger.com' : 'localhost';

// 数据库配置
const databaseConfig = env === 'production' ? {
	DATABASE: 'finger_blog',
	USERNAME: 'nodeserver',
	PASSWORD: '',
	PORT: '3306'
} : {
	DATABASE: 'finger_blog',
	USERNAME: 'node',
	PASSWORD: '',
	PORT: '3306'
};

// log配置
const errorLogPath = path.resolve(__dirname, './logs/error/error');				// 错误日志输出完整路径
const responseLogPath = path.resolve(__dirname, './logs/response/response');	// 响应日志输出完整路径
const logConfig = {
	appenders:[
		// 错误日志
		{
			category: 'errorLogger',				// logger名称
			type: 'dateFile',						// 日志类型
			filename: errorLogPath,					// 日志输出位置
			alwaysIncludePattern: true,				// 是否总是有后缀名
			pattern: '-yyyy-MM-dd-hh.log'			// 后缀，每小时创建一个新的日志文件
		},
		// 响应日志
		{
			category: 'resLogger',
			type: 'dateFile',
			filename: responseLogPath,
			alwaysIncludePattern: true,
			pattern: '-yyyy-MM-dd-hh.log'
		}
	],
	levels:										// 设置logger名称对应的的日志等级
	{
		errorLogger: 'ERROR',
		resLogger: 'ALL'
	}
};

module.exports = {PORT, HOST, databaseConfig, logConfig};