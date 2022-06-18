import request, { deleteRequest, getRequest, postRequest, putRequest } from '@/utils/request'

// 获取国际化语言集数据分页列表
export function listInternationalPage(page) {
  return postRequest('gateway/platform/v1/international/paging', page)
}

// 获取国际化语言集所有数据列表
export function listInternational(data = {}) {
  return postRequest('gateway/platform/v1/international/list', data)
}

// 新建国际化语言集
export function postInternational(obj) {
  return postRequest('gateway/platform/v1/international', obj)
}

// 根据主键ID获取国际化语言集数据
export function getInternational(id, method) {
  if (method) {
    return request({ url: 'gateway/platform/v1/international/' + id, method: method })
  }
  return postRequest('gateway/platform/v1/international/' + id)
}

// 根据主键ID删除国际化语言集一条数据
export function deleteInternational(id) {
  return deleteRequest('gateway/platform/v1/international/' + id)
}

// 根据实体类数据更新国际化语言集数据
export function putInternational(obj) {
  return putRequest('gateway/platform/v1/international', obj)
}

// 根据状态码查找所有语言清单,不传参数默认使用post查询status=0的数据
export function getInternationlsByStatus(status) {
  if (!status) status = 0
  return getRequest('gateway/platform/v1/international/status/' + status)
}

// 根据国际化语言编码查找国际化语言
export function getInternationlByCode(code) {
  return postRequest('gateway/platform/v1/international/code/' + code)
}

// 查找默认语言
export function findByDefaultFlag() {
  return postRequest('gateway/platform/v1/international/default')
}
