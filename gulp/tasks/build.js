var config   = require('../config.json')
var pkg      = require('../../package.json')

var jade     = require('gulp-jade')
var csso     = require('gulp-csso')
var rename   = require('gulp-rename')
var uglify   = require('gulp-uglify')
var RevAll   = require('gulp-rev-all')
var ghPages  = require('gulp-gh-pages')
var sequence = require('gulp-sequence')
var imagemin = require('gulp-imagemin')

module.exports = function(gulp) {
  gulp.task('build-index', function() {
    return gulp.src(config.path.index)
    .pipe(jade({
      locals: {
        env: 'build',
        pkg: pkg
      }
    }))
    .pipe(gulp.dest('build'))
  })

  gulp.task('build-styles', function() {
    return gulp.src('temp/styles/main.css')
    .pipe(csso())
    .pipe(rename('build.css'))
    .pipe(gulp.dest('build/styles'))
  })

  gulp.task('build-scripts', function() {
    return gulp.src('temp/scripts/main.js')
    .pipe(uglify())
    .pipe(rename('build.js'))
    .pipe(gulp.dest('build/scripts'))
  })

  gulp.task('build-images', function() {
    return gulp.src('temp/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'))
  })

  gulp.task('build-audios', function() {
    return gulp.src('temp/audios/**/*')
    .pipe(gulp.dest('build/audios'))
  })

  gulp.task('build-fonts', function() {
    return gulp.src('temp/fonts/**/*')
    .pipe(gulp.dest('build/fonts'))
  })

  gulp.task('revAll', function() {
    var revAll = new RevAll({
      dontRenameFile: [/^\/favicon.ico$/g, '.html'],
      dontUpdateReference: [/\.js$/]
    })
    return gulp.src('build/**')
      .pipe(revAll.revision())
      .pipe(gulp.dest('build/_rev'))
  })

  gulp.task('deploy', function() {
    return gulp.src('dist/_rev/**/*')
      .pipe(ghPages())
  })

  gulp.task('build', sequence(
    'dev',
    ['build-index', 'build-styles', 'build-scripts',
     'build-images', 'build-audios', 'build-fonts'],
    'revAll'
  ))
}
