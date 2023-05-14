import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest
} from '@/utils/request'

// 获取国际化语言集数据分页列表
export function listInternationalPage(page) {
  return postRequest('gateway/platform/api/international/paging', page)
}

// 新建国际化语言集
export function postInternational(obj) {
  return postRequest('gateway/platform/api/international', obj)
}

// 根据主键ID获取国际化语言集数据
export function getInternational(id, params) {
  return getRequest('gateway/platform/api/international/' + id, params)
}

// 根据主键ID删除国际化语言集一条数据
export function deleteInternational(id) {
  return deleteRequest('gateway/platform/api/international/' + id)
}

// 根据实体类数据更新国际化语言集数据
export function putInternational(obj) {
  return putRequest('gateway/platform/api/international', obj)
}

// 获取国际化语言集所有数据列表
export function listInternational(data = {}) {
  return postRequest('gateway/platform/api/international/list', data)
}

// 唯一键查找单条数据
export function findByField(data) {
  return getRequest('gateway/platform/api/international/field/' + data.fieldName + '/' + +data.fieldValue)
}

// 根据状态码查找所有语言清单,不传参数默认使用post查询status=0的数据
export function getInternationlsByStatus(status) {
  if (!status) status = 0
  const data = {
    status: status
  }
  return listInternational(data)
}

// 根据国际化语言编码查找国际化语言
export function getInternationlByCode(code) {
  const data = {
    fieldName: 'code',
    fieldValue: code
  }
  return findByField(data)
}

// 查找默认语言
export function findByDefaultFlag() {
  const data = {
    fieldName: 'defaultFlag',
    fieldValue: 1
  }
  return findByField(data)
}
