import {cookie} from './utils/main'

let locale = {
  init: function (locales) {
    let $html    = document.querySelector('html')
    this.lang    = cookie('lang') || $html.getAttribute('lang') || 'en'
    this.locales = locales
    return this
  },

  lang: null,

  locales: null,

  text: function (key) {
    let val    = Array.prototype.slice.call(arguments, 1)
    let locale = this.locales[this.lang] || this.locales.en
    let msg    = locale[key]
    if (!(msg && val.length)) {
      return msg || key
    }
    while (/\%s/.test(msg) && val.length) {
      msg = msg.replace('%s', val.shift())
    }
    return msg
  }
}

export default locale
