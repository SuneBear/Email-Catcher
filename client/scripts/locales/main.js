import {locale} from 'framework'

import localeZH from './zh'
import localeEN from './en'

const locales = locale.init({
  zh: localeZH,
  en: localeEN
})

export default {
  locale: locales.lang,
  l: locales.text.bind(locales)
}
