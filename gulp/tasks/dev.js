var config       = require('../config.json')
var pkg          = require('../../package.json')

var argv         = require('yargs').argv
var jade         = require('gulp-jade')
var rimraf       = require('gulp-rimraf')
var stylus       = require('gulp-stylus')
var rename       = require('gulp-rename')
var gutil        = require('gulp-util')
var plumber      = require('gulp-plumber')
var sequence     = require('gulp-sequence')
var sourcemaps   = require('gulp-sourcemaps')
var browserify   = require('gulp-browserify')
var livereload   = require('gulp-livereload')
var autoprefixer = require('gulp-autoprefixer')

var production   = (process.env.NODE_ENV === 'production' || argv.production)

module.exports = function(gulp) {
  gulp.task('clean', function() {
    return gulp.src([
      'temp',
      'build'
    ], {read: false})
    .pipe(rimraf({
      force: true
    }))
  })

  gulp.task('index', function() {
    return gulp.src(config.path.index)
    .pipe(jade({
      pretty: true,
      locals: {
        pkg: pkg
      }
    }))
    .pipe(gulp.dest('temp'))
    .pipe(livereload())
  })

  gulp.task('styles', function() {
    return gulp.src(config.path.styleMain)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(stylus({
      'include css': true,
      'paths': ['./node_modules']
    }))
    .on('error', function(err){
      gutil.log(err)
      this.emit('end')
    })
    .pipe(autoprefixer('last 2 versions', { map: false }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('temp/styles'))
    .pipe(livereload())
  })

  gulp.task('scripts', function() {
    return gulp.src(config.path.scriptMain)
    .pipe(plumber())
    .pipe(browserify({
      debug: !production,
      transform: ['babelify']
    }))
    .on('error', function(err){
      var stack = unescape(err.stack)
      delete err.stack
      if (err.stream != null) {
        delete err.stream
      }
      if (err.codeFrame != null) {
        delete err.codeFrame
      }
      gutil.log(err)
      gutil.log(stack)
      this.emit('end')
    })
    .pipe(rename('main.js'))
    .pipe(gulp.dest('temp/scripts'))
    .pipe(livereload())
  })

  gulp.task('images', function() {
    return gulp.src(config.path.images)
      .pipe(gulp.dest('temp/images'))
      .pipe(livereload())
  })

  gulp.task('audios', function() {
    return gulp.src(config.path.audios)
      .pipe(gulp.dest('temp/audios'))
      .pipe(livereload())
  })

  gulp.task('fonts', function() {
    return gulp.src(config.path.fonts)
      .pipe(gulp.dest('temp/fonts'))
      .pipe(livereload())
  })

  gulp.task('dev', sequence(
    'clean',
    ['index', 'styles', 'scripts', 'images', 'audios', 'fonts']
  ))

  gulp.task('default', sequence('dev'))
}
