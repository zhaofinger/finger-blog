const qiniu = require('qiniu');
const { accessKey, secretKey, scope } = require('../../config').qiniuKey;

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const options = {
  scope: scope,
  expires: 7200
};

const generateToken = () => {
  const putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
};

module.exports = generateToken;
