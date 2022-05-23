module.exports = {
  env: {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true
  },
  plugins: ['html'],
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8
  },
  rules: {
    'indent': [2, 'space'],
    'linebreak-style': [2, 'unix'],
    'no-console': 0,
    'quotes': [2, 'single'],
    'semi': [2, 'always']
  }
};