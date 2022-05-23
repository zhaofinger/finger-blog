module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'finger-blog',
      script: './server/app.js',
      max_memory_restart: '300M',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'root',
      host: [
        {
          host: '67.218.154.219',
          port: '26275'
        }
      ],
      ref: 'origin/master',
      repo: 'git@github.com:zhaofinger/finger-blog.git',
      path: '/var/www/finger-blog',
      'post-deploy': 'yarn && pm2 reload ecosystem.config.js --env production'
    }
  }
};
