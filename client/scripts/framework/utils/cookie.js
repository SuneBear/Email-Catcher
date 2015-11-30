/**
 * https://github.com/filamentgroup/cookie
 */

function cookie(name, value, days) {
  // Get: if value is undefined, get the cookie value
  if (value === undefined) {
    let cookiestring = "; " + document.cookie
    let cookies = cookiestring.split("; " + name + "=")
    if (cookies.length === 2) {
      return decodeURIComponent(
        cookies.pop()
          .split(";").shift()
      )
    }
    return null
  }
  else {
    // Delete: if value is a false boolean, we'll treat that as a delete
    if (value === false) {
      days = -1
    } else {
      // Escape value
      value = encodeURIComponent(value)
    }
    // Set
    let expires
    if (days) {
      let date = new Date()
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      expires = '; expires=' + date.toGMTString()
    }
    else {
      expires = ''
    }
    document.cookie = name + '=' + value + expires + '; path=/'
    return value
  }
}

export default cookie
