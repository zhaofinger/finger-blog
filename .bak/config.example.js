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

// stmp配置
const mailConfig = {
  username: 'xxx@163.com',
  password: 'xxxxxx'
};

// 七牛key以及空间名，根据实际情况填写
const qiniuKey = {
  accessKey: '******',
  secretKey: '******',
  scope: env === 'production' ? 'photo-prod' : 'photo-dev'
};

// 友链
const friendsLink = [
  {
    link: 'https://blog.kasora.moe/',
    title: 'kasora\'s blog'
  },
  {
    link: 'http://foreversong.cn/',
    title: 'ADog\'s Blog'
  },
  {
    link: 'http://xcatliu.com/',
    title: '流浪小猫'
  }
];

module.exports = { PORT, HOST, databaseConfig, mailConfig, qiniuKey, friendsLink };