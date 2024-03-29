import request, { getRequest, postRequest } from '@/utils/request'

// 获取联系方式数据分页列表
export function listContactinfoPage(page) {
  return request({
    url: 'gateway/mpi/api/contactinfo/paging',
    method: 'post',
    data: page
  })
}
// 获取联系方式所有数据列表
export function listContactinfo(data = {}) {
  return postRequest('gateway/mpi/api/contactinfo/list', data)
}
// 根据病人主索引ID查找该病人所有联系人
export function listContactinfoByEmpId(id, page) {
  return request({
    url: 'gateway/mpi/api/contactinfo/list/empId/' + id,
    method: 'post',
    data: page
  })
}
// 新建联系方式
export function postContactinfo(obj) {
  return request({
    url: 'gateway/mpi/api/contactinfo',
    method: 'post',
    data: obj
  })
}
// 根据主键ID获取联系方式数据
export function getContactinfo(id, params) {
  return getRequest('gateway/mpi/api/contactinfo/' + id, params)
}
// 根据主键ID删除联系方式一条数据
export function deleteContactinfo(id) {
  return request({
    url: 'gateway/mpi/api/contactinfo/' + id,
    method: 'delete'
  })
}
// 根据实体类数据更新联系方式数据
export function putContactinfo(obj) {
  return request({
    url: 'gateway/mpi/api/contactinfo',
    method: 'put',
    data: obj
  })
}
