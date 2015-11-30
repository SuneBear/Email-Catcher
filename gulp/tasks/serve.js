var config     = require('../config.json')

var opn        = require('opn')
var sequence   = require('gulp-sequence')
var nodemon    = require('gulp-nodemon')
var livereload = require('gulp-livereload')

module.exports = function(gulp) {
  gulp.task('connect', function (done) {
    nodemon({
      script: 'server/app.js',
      ext: 'sb'
    })

    // opn('http://localhost:6080', done)
  })

  gulp.task('connect-production', function (done) {
    nodemon({
      script: 'server/app.js',
      env: {'NODE_ENV': 'production'},
      ext: 'sb'
    })

    opn('http://localhost:6081', done)
  })

  gulp.task('watch', function () {
    livereload.listen()

    gulp.watch(config.path.index, ['index'])
    gulp.watch(config.path.views, ['index'])
    gulp.watch(config.path.styles, ['styles'])
    gulp.watch(config.path.scripts, ['scripts'])
    gulp.watch(config.path.images, ['images'])
    gulp.watch(config.path.audios, ['audios'])
    gulp.watch(config.path.fonts, ['fonts'])
  })

  gulp.task('serve', sequence(['connect', 'watch']))

  gulp.task('serve-production', sequence(['connect-production']))
}
