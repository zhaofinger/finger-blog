const dbUtils = require('../utils/db-utils');

const user = {
  /**
   * 数据库创建用户
   * @param  {object} model 用户数据模型
   * @return {object}       mysql执行结果
   */
  async create(model) {
    let result = await dbUtils.insertData('user', model);
    return result;
  },
  /**
   * 根据用户名或邮箱查找用户
   * @param  {object} username 用户名或邮箱
   * @return {object|null}     查找结果
   */
  async signIn(username) {
    let _sql = `
      SELECT * FROM user
      WHERE email="${username}" OR username="${username}"
      LIMIT 1`;
    let result = await dbUtils.query(_sql);
    if (Array.isArray(result) && result.length > 0) {
      result = result[0];
    } else {
      result = null;
    }
    return result;
  },
  /**
   * 获取用户信息
   * @param {*} id
   */
  async getUserInfo(id) {
    let result = (await dbUtils.findDataById('user', id))[0];
    return result;
  },
  /**
   * 更新用户信息
   * @param {object} model
   * @param {string} id
   */
  async updateUser(model, id) {
    let result = await dbUtils.updateData('user', model, id);
    return result;
  }
};


module.exports = user;
