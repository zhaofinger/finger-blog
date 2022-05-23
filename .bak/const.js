const env = process.env.NODE_ENV;
const IMG_TYPE = {
  PHOTOGRAPHY: 1,
  ARTICLE_CONTENT: 2,
  ARTICLE_COVER: 3,
  FILM: 4
};
const IMG_PRE = env === 'production' ? 'http://image.finger.asimr.top/' : 'http://owu5r8hjs.bkt.clouddn.com/';

module.exports = { IMG_TYPE, IMG_PRE };