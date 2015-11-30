let util = {}

util.isFunction = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]'
}

util.isObject = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

util.extend = function(obj) {
  if (!util.isObject(obj)) return obj
  for (let i = 1, length = arguments.length; i < length; i++) {
    let source = arguments[i]
    for (let prop in source) {
      if (Object.prototype.hasOwnProperty.call(source, prop)) {
        obj[prop] = source[prop]
      }
    }
  }
  return obj
}

export default util
