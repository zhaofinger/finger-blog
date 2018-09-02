const nodemailer = require('nodemailer');
const { mailConfig } = require('../../config');

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  service: '163',
  port: 465,
  secureConnection: true,
  auth: {
    user: mailConfig.username,
    pass: mailConfig.password,
  }
});

/**
 * 发送邮件
 * @param {array/string} receiver receiver
 * @param {string}} subject subject
 * @param {string} content html
 */
module.exports = function(receiver, subject, content) {
  let mailOptions = {
    from: mailConfig.username,
    to: receiver,
    subject,
    html: content
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
};