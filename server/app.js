var fs         = require('co-fs')

var app        = require('koa')()
var router     = require('koa-router')()
var client     = require('koa-static')
var livereload = require('koa-livereload')

var env        = process.env.NODE_ENV || 'development'
var config     = require('./config')[env]

router.get('*', function *() {
  this.body = yield fs.readFile(`${config.dir}/index.html`, {encoding: 'utf8'})
})

if(env === 'development') {
  app.use(livereload())
}
app.use(client(config.dir))
app.use(router.routes())

app.listen(config.port, function() {
  console.log('\n', 'listening on port', config.port, 'in', env)
})
