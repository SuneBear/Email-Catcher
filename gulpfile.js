var gulp       = require('gulp')
var requireDir = require('require-dir')

var tasks      = requireDir('gulp/tasks')

for (var key in tasks) {
  var register = tasks[key]
  if (typeof register === 'function') {
    register(gulp)
  }
}
