import Cookies from 'js-cookie'
import { getLanguage } from '@/lang'
import { getInternationlCharsets } from '@/views/platform/international/charset'
import i18n from '@/lang' // Internationalization

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('ananSidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    ananLanguage: getLanguage(),
    loadInternationalFlag: {},
    size: Cookies.get('ananSize') || 'medium'
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('ananSidebarStatus', 1)
      } else {
        Cookies.set('ananSidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('ananSidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, code) => {
      if (state.ananLanguage !== code || !state.loadInternationalFlag[code]) {
        state.ananLanguage = code
        state.loadInternationalFlag[code] = true
        i18n.locale = code
        Cookies.set('ananLanguage', code)
      }
    },
    SET_SIZE: (state, ananSize) => {
      state.ananSize = ananSize
      Cookies.set('ananSize', ananSize)
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage({ commit, state }, ananLanguage) {
      return new Promise((resolve, reject) => {
        const code = ananLanguage.code
        const intFlag = state.loadInternationalFlag[code]
        if (intFlag) {
          commit('SET_LANGUAGE', code)
          resolve()
        } else {
          getInternationlCharsets(ananLanguage.id).then(response => {
            const charsetsData = response.data
            for (let i = 0; i < charsetsData.length; i++) {
              i18n.mergeLocaleMessage(code, JSON.parse(charsetsData[i].charset))
            }
            commit('SET_LANGUAGE', code)
            resolve()
          }).catch(reason => {
            reject(reason)
          })
        }
      })
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size)
    }
  }
}

export default app
