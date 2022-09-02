import request, { getRequest, postRequest } from '@/utils/request'

// 获取操作日志数据分页列表
export function listOperationlogPage(page) {
  return request({
    url: 'gateway/mpi/api/operationlog/paging',
    method: 'post',
    data: page
  })
}
// 获取操作日志所有数据列表
export function listOperationlog(data = {}) {
  return postRequest('gateway/mpi/api/operationlog/list', data)
}
// 根据病人主索引ID查找该病人所有操作记录
export function listOperationlogByEmpId(id, page) {
  return request({
    url: 'gateway/mpi/api/operationlog/list/empId/' + id,
    method: 'post',
    data: page
  })
}
// 新建操作日志
export function postOperationlog(obj) {
  return request({
    url: 'gateway/mpi/api/operationlog',
    method: 'post',
    data: obj
  })
}
// 根据主键ID获取操作日志数据
export function getOperationlog(id, params) {
  return getRequest('gateway/mpi/api/operationlog/' + id, params)
}
// 根据主键ID删除操作日志一条数据
export function deleteOperationlog(id) {
  return request({
    url: 'gateway/mpi/api/operationlog/' + id,
    method: 'delete'
  })
}
// 根据实体类数据更新操作日志数据
export function putOperationlog(obj) {
  return request({
    url: 'gateway/mpi/api/operationlog',
    method: 'put',
    data: obj
  })
}
