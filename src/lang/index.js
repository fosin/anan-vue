import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhCNLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import elementzhTWLocale from 'element-ui/lib/locale/lang/zh-TW'// element-ui lang
import elementJaLocale from 'element-ui/lib/locale/lang/ja'// element-ui lang
import elementKoLocale from 'element-ui/lib/locale/lang/ko'

Vue.use(VueI18n)

const messages = {
  en: {
    ...elementEnLocale
  },
  'zh-CN': {
    ...elementZhCNLocale
  },
  'zh-TW': {
    ...elementzhTWLocale
  },
  ja: {
    ...elementJaLocale
  },
  ko: {
    ...elementKoLocale
  }
}

export function getLanguage() {
  const chooseLanguage = Cookies.get('ananLanguage')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage)
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'zh-CN'
}

const i18n = new VueI18n({
  locale: getLanguage(),
  messages // set locale messages
})

export default i18n
