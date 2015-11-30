module.exports = {
  development: {
    host: 'http://localhost',
    port: 6080,
    dir: process.cwd() + '/temp'
  },
  production: {
    host: 'http://localhost',
    port: 6081,
    dir: process.cwd() + '/build/_rev'
  }
}
