const bcrypt = require('bcryptjs');
const user = require('../models/user');
const article = require('../models/article');
const calPageIndex = require('../utils/cal-page-index');
const IMG_PRE = require('../../const').IMG_PRE;

/**
 * 判断用户是否登录
 * @param {object} ctx 上下文对象
 */
const isLogin = function(ctx) {
  // 是否登录重定向到登录
  if (!(ctx.session && ctx.session.isLogin)) {
    return ctx.redirect('./login');
  }
};

module.exports = {
  // 登录
  async login(ctx) {
    // 自动登录
    if (ctx.session && ctx.session.isLogin) {
      ctx.redirect('./list');
    }
    const title = '北极羊驼管理后台';
    if (ctx.method === 'GET') {
      await ctx.render('admin/login', {
        title
      });
    // 登录处理
    } else if (ctx.method === 'POST') {
      const formData = ctx.request.body;
      const userInfo = await user.signIn(formData.username);
      if (!userInfo) {
        ctx.body = '没有这个用户';
        return;
      }
      // 验证用户密码
      const result = bcrypt.compareSync(formData.password, userInfo.password);
      if (result) {
        const session = ctx.session;
        session.isLogin = true;
        session.username = userInfo.username;
        session.nickname = userInfo.nickname;
        session.userId = userInfo.id;
        ctx.redirect('./list');
      } else {
        ctx.body = '账号密码错误';
      }
    }
  },
  // 创建用户
  async create(ctx) {
    let username = ctx.request.query.username || 'admin';
    let pwd = ctx.request.query.pwd || '123456';
    const salt = bcrypt.genSaltSync(10);
    const userModal = {
      id: null,
      role: 0,
      username: username,
      email: 'zhbqsj@126.com',
      password: bcrypt.hashSync(pwd, salt),
      nickname: '北极羊驼',
      created_at: (new Date()).getTime(),
      updated_at: (new Date()).getTime()
    };
    const result = await user.create(userModal);
    ctx.body = result;
  },
  // 后台首页
  async index(ctx) {
    isLogin(ctx);

    const title = '北极羊驼管理后台';
    const userInfo = ctx.session;
    await ctx.render('admin/index', {
      title, userInfo
    });
  },
  // 文章列表
  async list(ctx) {
    isLogin(ctx);
    const userInfo = ctx.session;
    // 获取当前页码
    let nowPageIndex = ctx.request.query.page || 1;
    const num = 10;
    const title = '北极羊驼管理后台-文章列表';
    // 文章列表
    const articleList = await article.getArticleList({start: (nowPageIndex - 1) * num, end: num}, null, false);
    // 文章总页数
    const totalCount = (await article.getArticleCount())[0].total_count;
    // 显示分页
    const pageArr = calPageIndex(nowPageIndex, Math.ceil(totalCount / num));
    // 现在页数
    await ctx.render('admin/list', {
      title, userInfo, articleList, pageArr, nowPageIndex
    });
  },
  // 文章列表
  async user(ctx) {
    isLogin(ctx);
    if (ctx.method === 'GET') {
      const userInfo = await user.getUserInfo(ctx.session.userId);
      // 获取当前页码
      const title = '北极羊驼管理后台-用户';
      // 现在页数
      await ctx.render('admin/user', {
        title, userInfo
      });
    } else if (ctx.method === 'POST') {
      let formData = ctx.request.body;
      const userInfo = await user.getUserInfo(ctx.session.userId);
      // 验证用户密码
      const result = bcrypt.compareSync(formData.old_pwd, userInfo.password);
      if (result) {
        const salt = bcrypt.genSaltSync(10);
        const userModal = {
          id: userInfo.id,
          role: 0,
          username: formData.username,
          email: formData.email,
          password: bcrypt.hashSync(formData.new_pwd || formData.old_pwd, salt),
          nickname: formData.nickname,
          updated_at: (new Date()).getTime()
        };
        let result = await user.updateUser(userModal, userInfo.id);
        if (result) {
          if (formData.new_pwd) {
            ctx.session = null;
            ctx.redirect('./login');
          } else {
            ctx.redirect('./user');
          }
        }
      } else {
        ctx.body = '账号密码错误';
      }
    }
  },
  // 编辑页面
  async edit(ctx) {
    isLogin(ctx);
    if (ctx.method === 'GET') {
      let articleModel = null;
      let title = '发表文章';

      const userInfo = ctx.session;

      if (ctx.request.query.id) {
        articleModel = await article.getArticleDetail(ctx.request.query.id);
        if (articleModel) {
          title = '编辑文章';
        }
      }
      let articleType = await article.getArticleTypes();
      await ctx.render('admin/edit', {
        title, userInfo, articleType, articleModel, IMG_PRE
      });
    } else if (ctx.method === 'POST') {
      let formData = ctx.request.body;
      if (formData.newType) {
        try {
          // 文章type model
          let result = await article.createType({
            name: formData.newType,
            created_at: (new Date()).getTime(),
            updated_at: (new Date()).getTime()
          });
          formData.type = result.insertId;
        } catch (error) {
          throw(error);
        }
      }
      // 文章model
      const articleModel = {
        id: formData.id,
        title: formData.title,
        type: formData.type,
        cover: formData.cover,
        desc: formData.desc,
        label: formData.label,
        content_md: formData.is_photo ? formData.file : formData['markdown_md'],
        content_render: formData.is_photo ? formData.file : formData['markdown_render'],
        is_publish: formData.status,
        is_photo: formData.is_photo || 0,
        is_film: formData.is_film || 0,
        external_link: formData.external_link,
        created_at: formData.created_at || (new Date()).getTime(),
        updated_at: (new Date()).getTime()
      };
      if (formData.id) {
        // 更新
        await article.updateArticle(articleModel, formData.id);
      } else {
        // 新建
        delete articleModel.id;
        await article.createArticle(articleModel);
      }
      ctx.redirect('./list');
    }
  },
  // 照片
  async photo(ctx) {
    let photoModel = null;
    let title = '新照片';

    const userInfo = ctx.session;

    if (ctx.request.query.id) {
      photoModel = await article.getArticleDetail(ctx.request.query.id);
      if (photoModel) {
        title = '编辑照片';
      }
    }

    await ctx.render('admin/photo', {
      title, userInfo, photoModel
    });
  },
  // 电影
  async film(ctx) {
    let filmModel = null;
    let title = '新电影';

    const userInfo = ctx.session;

    if (ctx.request.query.id) {
      filmModel = await article.getArticleDetail(ctx.request.query.id);
      if (filmModel) {
        title = '编辑电影';
      }
    }

    await ctx.render('admin/film', {
      title, userInfo, filmModel
    });
  }
};