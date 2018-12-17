import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhCNLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import elementzhTWLocale from 'element-ui/lib/locale/lang/zh-TW'// element-ui lang
import enUKLocale from './en-UK'
import zhCNLocale from './zh-CN'
import zhTWLocale from './zh-HK'

Vue.use(VueI18n)

const messages = {
  'en-UK': {
    ...enUKLocale,
    ...elementEnLocale
  },
  'zh-CN': {
    ...zhCNLocale,
    ...elementZhCNLocale
  },
  'zh-HK': {
    ...zhTWLocale,
    ...elementzhTWLocale
  }
}

const i18n = new VueI18n({
  locale: Cookies.get('language') || 'zh-CN', // set locale
  messages // set locale messages
})

export default i18n
