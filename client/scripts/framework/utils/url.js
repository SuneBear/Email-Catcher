let url = {}

url.getQueryString = function(key, search = location.search){
  let obj = {}
  location.search
    .replace(/^\?/g, '')
    .split('&')
    .forEach((item) => {
      obj[item.split('=')[0]] = item.split('=')[1]
    })
  if (key !== 'undefined') {
    obj = obj[key]
  }
  return obj
}

export default url
