module.exports = [
  { path: 'dist/assets/*.js', limit: '200 KB', gzip: true },
  { path: 'dist/assets/vendor-*.js', limit: '300 KB', gzip: true },
  { path: 'dist/assets/*.css', limit: '50 KB', gzip: true }
]