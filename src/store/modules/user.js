import { getAccessToken, refreshAccessToken, logout, getUserInfo } from '@/api/login'
import { getWebStore, setWebStore, removeWebStore } from '@/utils/webStorage'

const user = {
  state: {
    userInfo: getWebStore({
      name: 'userInfo'
    }) || {},
    roles: getWebStore({
      name: 'roles'
    }) || [],
    permissions: getWebStore({
      name: 'permissions'
    }) || {},
    token: getWebStore({
      name: 'token'
    }) || {},
    current_organiz: getWebStore({
      name: 'current_organiz'
    }) || {},
    current_role: getWebStore({
      name: 'current_role'
    }) || 0
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setWebStore({
        name: 'token',
        content: state.token
      })
    },
    SET_USER: (state, userInfo) => {
      state.userInfo = userInfo
      setWebStore({
        name: 'userInfo',
        content: state.userInfo
      })
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      setWebStore({
        name: 'roles',
        content: state.roles
      })
    },
    SET_PERMISSIONS: (state, permissions) => {
      const list = {}
      for (let i = 0; i < permissions.length; i++) {
        list[permissions[i].authority] = true
        // let authority[permissions[i].authority] = true
        // list.push({
        //   authority: permissions[i].authority
        // })
        // list[i] = permissions[i].authority
      }
      state.permissions = list
      setWebStore({
        name: 'permissions',
        content: state.permissions
      })
    },
    SET_CURRENT_ORGANIZ: (state, current_organiz) => {
      state.current_organiz = current_organiz
      setWebStore({
        name: 'current_organiz',
        content: state.current_organiz
      })
    },
    SET_CURRENT_ROLE: (state, current_role) => {
      state.current_role = current_role
      setWebStore({
        name: 'current_role',
        content: state.current_role
      })
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit, dispatch }, loginForm) {
      return new Promise((resolve, reject) => {
        getAccessToken(loginForm).then(response => {
          commit('SET_TOKEN', response.data)
          // 根据服务器返回的失效时间定时刷新access_token
          setTimeout(function() {
            debugger
            dispatch('RefreshAccessToken')
          }, (response.data.expires_in || 7200 - 60) * 1000)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 刷新toeken
    RefreshAccessToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        const refresh_token = state.token.refresh_token
        if (refresh_token) {
          state.token.access_token = ''
          refreshAccessToken(refresh_token).then(response => {
            commit('SET_TOKEN', response.data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token.access_token).then(response => {
          if (!response.data || !response.data.data) {
            reject('error')
          }
          const data = response.data.data
          if (!data.enabled || !data.accountNonExpired || !data.accountNonLocked || !data.credentialsNonExpired) { // 验证返回的user是否有效用户
            reject('getInfo: user is disabled!')
          }
          if (data.user) { // 验证返回的user
            commit('SET_USER', data.user)
          } else {
            reject('getInfo: invalid user object !')
          }

          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          if (data.authorities && data.authorities.length > 0) { // 验证返回的authorities是否是有效数组
            commit('SET_PERMISSIONS', data.authorities)
          } else {
            commit('SET_PERMISSIONS', [])
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_ACCESS_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token.access_token).then(() => {
          clearLoginData(commit)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        clearLoginData(commit)
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setWebStore(role)
        getUserInfo(role).then(response => {
          const data = response.data.data
          commit('SET_ROLES', data.roles)
          resolve()
        })
      })
    }
  }
}

function clearLoginData(commit) {
  commit('SET_TOKEN', {})
  commit('SET_ROLES', [])
  commit('SET_PERMISSIONS', {})
  commit('SET_USER', {})
  commit('SET_CURRENT_ROLE', 0)
  commit('SET_CURRENT_ORGANIZ', {})
  removeWebStore('token')
  removeWebStore('roles')
  removeWebStore('permissions')
  removeWebStore('userInfo')
  removeWebStore('current_role')
  removeWebStore('current_organiz')
}
export default user
