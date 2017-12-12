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

// 七牛key
const qiniuKey = {
	accessKey: '******',
	secretKey: '******'
};


module.exports = { PORT, HOST, databaseConfig, qiniuKey };