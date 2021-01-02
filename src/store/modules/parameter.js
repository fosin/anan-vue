import { postRequest } from '@/utils/request'

const parameter = {
  state: {
    parameterData: {}
  },
  mutations: {
    SET_PARAMETER_DATA: (state, data) => {
      state.parameterData = data
    }
  },
  actions: {
    // 获取字典数据
    loadParameterValue({ commit, state }, paras) {
      return new Promise((resolve, reject) => {
        const parameterData = state.parameterData
        if (!paras.type) {
          reject('获取参数值失败,没有或传入的参数类型type无效')
          return
        }
        if (!paras.name) {
          reject('获取参数值失败,没有或传入的参数name无效')
          return
        }
        let pValue = parameterData[paras.name]
        if (pValue) {
          resolve(pValue)
          return
        }
        postRequest('gateway/platform/v1/parameter/value', paras).then(response => {
          if (!response.data) {
            reject('error')
          }
          pValue = response.data
          state.parameterData[paras.name] = pValue
          commit('SET_PARAMETER_DATA', state.parameterData)
          resolve(pValue)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default parameter

import Vue from 'vue'
import vuex from '@/store'

Vue.prototype.loadOrganizParameterValue = function(name, defaultValue, description) {
  return Vue.prototype.loadAllParameterValue(1, name, defaultValue, description)
}
Vue.prototype.loadUserParameterValue = function(name, defaultValue, description) {
  return new Promise((resolve, reject) => {
    Vue.prototype.loadAllParameterValue(2, name, defaultValue, description).then(res => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}
Vue.prototype.loadAllParameterValue = function(type, name, defaultValue, description) {
  return new Promise((resolve, reject) => {
    const p = {
      type: type,
      name: name,
      defaultValue: defaultValue,
      description: description
    }
    vuex.dispatch('loadParameterValue', p).then(res => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}
