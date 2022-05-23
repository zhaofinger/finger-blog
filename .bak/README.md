# finger-blog

![预览图](./preview.png)

finger-blog 是一个基于 koa2 mysql的网络博客应用.

## Installation

本应用依赖于 node.js(>= 7.6.0) 以及 mysql 数据库.

1. 克隆仓库: `git clone git@github.com:zhaofinger/finger-blog.git`.
2. 进入仓库根目录运行 `yarn` 安装依赖.
3. 打开根目录下的 `config.example.js` 复制一份 `config.js` 根据自己的数据库配置以及其他修改配置文件.
4. 本地开发模式: 运行 `yarn run dev` , 然后打开浏览器输入 `http://localhost:1024`.
5. 部署服务器: 依次运行 `yarn run deploy_setup` 以及 `yarn run deploy`, 具体操作可查看[使用pm2+nginx部署koa2(https)](https://www.zhaofinger.com/detail/5).

## Scripts

* `dev`: 本地开发
* `deploy_setup`: deploy setup
* `deploy`: 部署线上
* `lint`: eslint
