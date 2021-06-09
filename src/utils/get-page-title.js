import defaultSettings from '@/settings'
import i18n from '@/lang'

let title = i18n.te('login.title') ? i18n.t('login.title') : defaultSettings.title

export default function getPageTitle(key) {
  if (title === defaultSettings.title) {
    title = i18n.te('login.title') ? i18n.t('login.title') : defaultSettings.title
  }
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${title}`
  }
  return `${title}`
}
