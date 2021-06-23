import { postRequest } from '@/utils/request'
import { Notification } from 'element-ui'

const dictionary = {
  state: {
    dictionaryData: {}
  },
  mutations: {
    SET_DIACTIONARY_DATA: (state, data) => {
      state.dictionaryData = data
    }
  },
  actions: {
    // 获取字典数据
    getDictionaryById({ commit, state, dispatch }, dicId) {
      return new Promise((resolve, reject) => {
        const dics = state.dictionaryData
        if (dics[dicId]) {
          resolve(dics[dicId])
          return
        }
        postRequest('gateway/platform/v1/dictionary/' + dicId).then(response => {
          if (!response.data) {
            reject('error')
          }
          const data = response.data
          postRequest('gateway/platform/v1/dictionarydetail/byCode/' + dicId).then(response => {
            if (!response.data) {
              reject('error')
            }
            data['details'] = response.data
            state.dictionaryData[dicId] = data
            commit('SET_DIACTIONARY_DATA', state.dictionaryData)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default dictionary

import Vue from 'vue'
import vuex from '@/store'
import { getDicValue } from '@/utils/dic'
Vue.prototype.loadDictionaryById = function(dicId) {
  return new Promise((resolve, reject) => {
    vuex.dispatch('getDictionaryById', dicId).then(res => {
      resolve(res)
    }).catch((error) => {
      Notification.error({
        title: '加载字典失败，字典ID：' + dicId,
        message: error.message,
        type: 'error',
        duration: 5000
      })
      reject(error)
    })
  })
}
Vue.prototype.getAnanDicValue = function(dicDetails, value) {
  return getDicValue(dicDetails, 'name', value, 'value')
}
Vue.prototype.getAnanDicDescription = function(dicDetails, dicName) {
  return getDicValue(dicDetails, 'name', dicName, 'description')
}

