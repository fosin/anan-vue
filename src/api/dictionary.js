import request from '@/utils/request'

// 获取数据分页列表
export function listDictionaryPage(page) {
  return request({
    url: '/platform/dictionary/pageList',
    method: 'post',
    data: page
  })
}
// 获取所有数据列表
export function listDictionary() {
  return request({
    url: '/platform/dictionary/list',
    method: 'post'
  })
}

export function postDictionary(obj) {
  return request({
    url: '/platform/dictionary/',
    method: 'post',
    data: obj
  })
}

export function getDictionary(id) {
  return request({
    url: '/platform/dictionary/' + id,
    method: 'get'
  })
}

export function deleteDictionary(id) {
  return request({
    url: '/platform/dictionary/' + id,
    method: 'delete'
  })
}

export function putDictionary(obj) {
  return request({
    url: '/platform/dictionary',
    method: 'put',
    data: obj
  })
}

// 以下是字典明细的后台方法
// 获取数据分页列表
export function listDictionaryDetailPage(page, code) {
  return request({
    url: '/platform/dictionaryDetail/pageList/' + code,
    method: 'post',
    data: page
  })
}
// 获取所有数据列表
export function listDictionaryDetail() {
  return request({
    url: '/platform/dictionaryDetail/list',
    method: 'post'
  })
}

export function postDictionaryDetail(obj) {
  return request({
    url: '/platform/dictionaryDetail/',
    method: 'post',
    data: obj
  })
}

export function listDictionaryDetailByCode(code, method) {
  return request({
    url: '/platform/dictionaryDetail/byCode/' + code,
    method: method || 'post'
  })
}

export function getDictionaryDetail(id) {
  return request({
    url: '/platform/dictionaryDetail/' + id,
    method: 'get'
  })
}

export function deleteDictionaryDetail(id) {
  return request({
    url: '/platform/dictionaryDetail/' + id,
    method: 'delete'
  })
}

export function putDictionaryDetail(obj) {
  return request({
    url: '/platform/dictionaryDetail',
    method: 'put',
    data: obj
  })
}
