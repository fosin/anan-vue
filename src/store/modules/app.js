import Cookies from 'js-cookie'
import { getLanguage } from '@/lang'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('ananSidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    ananLanguage: getLanguage(),
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
    SET_LANGUAGE: (state, ananLanguage) => {
      state.ananLanguage = ananLanguage
      Cookies.set('ananLanguage', ananLanguage)
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
    setLanguage({ commit }, ananLanguage) {
      commit('SET_LANGUAGE', ananLanguage)
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size)
    }
  }
}

export default app
