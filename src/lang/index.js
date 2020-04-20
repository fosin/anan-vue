import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhCNLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import elementzhTWLocale from 'element-ui/lib/locale/lang/zh-TW'// element-ui lang
import enUKLocale from './en-UK'
import zhCNLocale from './zh-CN'
import zhTWLocale from './zh-HK'

import PlatformEnUKLocale from '../views/platform/lang/en-UK'
import PlatformZhCNLocale from '../views/platform/lang/zh-CN'
import PlatformZhHKLocale from '../views/platform/lang/zh-HK'

import MpiEnUKLocale from '../views/mpi/lang/en-UK'
import MpiZhCNLocale from '../views/mpi/lang/zh-CN'
import MpiZhHKLocale from '../views/mpi/lang/zh-HK'

Vue.use(VueI18n)

const messages = {
  'en-UK': {
    ...enUKLocale,
    ...elementEnLocale,
    ...PlatformEnUKLocale,
    ...MpiEnUKLocale
  },
  'zh-CN': {
    ...zhCNLocale,
    ...elementZhCNLocale,
    ...PlatformZhCNLocale,
    ...MpiZhCNLocale
  },
  'zh-HK': {
    ...zhTWLocale,
    ...elementzhTWLocale,
    ...PlatformZhHKLocale,
    ...MpiZhHKLocale
  }
}

const i18n = new VueI18n({
  locale: Cookies.get('ananLanguage') || 'zh-CN', // set locale
  messages // set locale messages
})

export default i18n
