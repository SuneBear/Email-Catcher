import 'history-events' // Override history

/**
 * https://github.com/simmo/router.js
 */

class Route {

  constructor(pattern, callback) {
    this.pattern     = pattern
    this.callback    = callback

    this.route       = null
    this.params      = []
    this._paramKeys  = []

    this._patternToReg()
  }

  _patternToReg() {
    let paramKeys = []
    this.route = this.pattern.replace(')', ')?')
    this.route = this.route.replace(/:(\w+)\+?/g, function(match, name) {
      let replaceWith
      let paramKey = {
        name: name,
        regex: match,
        isSplat: false
      }
      if (match.substr(-1) === '+') {
        paramKey.isSplat = true
        replaceWith = '(.+)'
      } else {
        replaceWith = '([^\/]+)'
      }
      paramKeys.push(paramKey)
      return replaceWith
    })
    if (this.route.substr(-1) === '/') {
      this.route += '?'
    }
    this.route = '^' + this.route + '$'
    this._paramKeys = paramKeys
  }

  matches(url = location.pathname) {
    let matches
    let paramValues = []
    if (!((matches = url.match(this.route)) && matches.length)) {
      return false
    }
    for (let i = 0, len = matches.length; i < len; i++) {
      let match = matches[i]
      if (!(typeof match === 'undefined' || match.substr(0, 1) === '/')) {
        paramValues.push(match)
      }
    }
    for (let i = 0, len = paramValues.length; i < len; ++i) {
      let match = paramValues[i]
      this.params.push(
       this._paramKeys[i].isSplat ? match.split('/') : match
      )
    }
    return true
  }

}

let router = {
  routes: [],

  _match(url = location.pathname) {
    let matched = false

    for (let route of this.routes) {
      if (route.matches(url)) {
        matched = true
        route.callback.apply(route, route.params)
        if (typeof this.alwayshandler === "function") {
          this.alwayshandler(route.params)
        }
      }
    }


    if (!matched && typeof this.otherwiseHandler === "function") {
      this.otherwiseHandler(url)
    }

    return this
  },

  _bindLink() {
    document.addEventListener('click', (e) => {
      let $target  = e.target
      let host     = $target.host
      let hostCur  = location.host
      let href     = $target.getAttribute('href')
      let hrefFull = $target.href
      let tagName  = $target.tagName
      let isNewTab = $target.getAttribute('target') === '_blank'

      if (tagName === "A" && href) {
        e.preventDefault()
        if (hostCur === host && !isNewTab) {
          this.navigate(href)
        } else {
          if (isNewTab) {
            window.open(hrefFull)
          } else {
            window.location.href = hrefFull
          }
        }
      }

    }, false)
    return this
  },

  route(pattern, handler) {
    this.routes.push(
      new Route(pattern, handler)
    )
    return this
  },

  always(handler) {
    this.alwaysHandler = handler
    return this
  },

  otherwise(handler) {
    this.otherwiseHandler = handler
    return this
  },

  navigate(url, isReplace) {
    history[isReplace ? 'replaceState' : 'pushState']({
     'url': url
    }, null, url)
    return this
  },

  go(step = 1) {
    history.go(step)
    return this
  },

  back(step = -1) {
    history.go(step)
    return this
  },

  _bindPopstate() {
    window.addEventListener('changestate', () => {
      this._match()
    }, false)
    return this
  },

  _initialize() {
    window.dispatchEvent(new Event('changestate'))
    return this
  },

  start() {
    this._bindLink()
    ._bindPopstate()
    ._initialize()
  }
}

export default router
