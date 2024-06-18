module.exports = {
  apps: [
    {
      name: 'amap-hook-dev',
      script: 'nest start --watch',
      watch: true,
      ignore_watch: ['logs', 'node_modules', 'dist'],
      env: {
        NODE_ENV: 'dev',
      },
    },
    {
      name: 'amap-hook-test',
      script: 'node --trace-deprecation dist/main',
      watch: true,
      ignore_watch: ['logs', 'node_modules', 'dist'],
      env: {
        NODE_ENV: 'test',
      },
    },
    // TODO:
    {
      name: 'amap-hook',
      script: 'node --trace-deprecation dist/main',
      watch: true,
      ignore_watch: ['logs', 'node_modules', 'dist'],
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
