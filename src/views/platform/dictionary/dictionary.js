import request from '@/utils/request'

// 获取数据分页列表
export function listDictionaryPage(page) {
  return request({
    url: 'gateway/platform/v1/dictionary/pageList',
    method: 'post',
    data: page
  })
}
// 获取所有数据列表
export function listDictionary() {
  return request({
    url: 'gateway/platform/v1/dictionary/list',
    method: 'post'
  })
}

export function postDictionary(obj) {
  return request({
    url: 'gateway/platform/v1/dictionary/',
    method: 'post',
    data: obj
  })
}

export function getDictionary(id, method) {
  return request({
    url: 'gateway/platform/v1/dictionary/' + id,
    method: method || 'post'
  })
}

export function deleteDictionary(id) {
  return request({
    url: 'gateway/platform/v1/dictionary/' + id,
    method: 'delete'
  })
}

export function putDictionary(obj) {
  return request({
    url: 'gateway/platform/v1/dictionary',
    method: 'put',
    data: obj
  })
}

// 以下是字典明细的后台方法
// 获取数据分页列表
export function listDictionaryDetailPage(page, code) {
  return request({
    url: 'gateway/platform/v1/dictionarydetail/pageList/' + code,
    method: 'post',
    data: page
  })
}
// 获取所有数据列表
export function listDictionaryDetail() {
  return request({
    url: 'gateway/platform/v1/dictionarydetail/list',
    method: 'post'
  })
}

export function postDictionaryDetail(obj) {
  return request({
    url: 'gateway/platform/v1/dictionarydetail/',
    method: 'post',
    data: obj
  })
}

export function fetchDictionaryDetailsByCode(code, method) {
  return request({
    url: 'gateway/platform/v1/dictionarydetail/byCode/' + code,
    method: method || 'post'
  })
}

export function getDictionaryDetail(id, method) {
  return request({
    url: 'gateway/platform/v1/dictionarydetail/' + id,
    method: method || 'post'
  })
}

export function deleteDictionaryDetail(id) {
  return request({
    url: 'gateway/platform/v1/dictionarydetail/' + id,
    method: 'delete'
  })
}

export function putDictionaryDetail(obj) {
  return request({
    url: 'gateway/platform/v1/dictionarydetail',
    method: 'put',
    data: obj
  })
}
