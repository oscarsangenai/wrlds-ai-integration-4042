module.exports = [
  {
    name: 'Route chunks',
    path: 'dist/assets/*.js',
    limit: '200 KB',
    gzip: true,
    ignore: ['**/vendor-*.js']
  },
  {
    name: 'Vendor chunk',
    path: 'dist/assets/vendor-*.js',
    limit: '300 KB',
    gzip: true
  },
  {
    name: 'CSS bundle',
    path: 'dist/assets/*.css',
    limit: '50 KB',
    gzip: true
  }
];
