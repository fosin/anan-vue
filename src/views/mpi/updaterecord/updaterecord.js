import request from '@/utils/request'

// 获取人员信息更新记录数据分页列表
export function listUpdaterecordPage(page) {
  return request({
    url: 'mpi/v1/updaterecord/pageList',
    method: 'post',
    data: page
  })
}
// 获取人员信息更新记录所有数据列表
export function listUpdaterecord() {
  return request({
    url: 'mpi/v1/updaterecord/list',
    method: 'post'
  })
}
// 根据病人主索引ID查找该病人所有更新记录
export function listUpdaterecordByEmpId(id, page) {
  return request({
    url: 'mpi/v1/updaterecord/list/empId/' + id,
    method: 'post',
    data: page
  })
}
// 新建人员信息更新记录
export function postUpdaterecord(obj) {
  return request({
    url: 'mpi/v1/updaterecord',
    method: 'post',
    data: obj
  })
}
// 根据主键ID获取人员信息更新记录数据
export function getUpdaterecord(id, method) {
  return request({
    url: 'mpi/v1/updaterecord/' + id,
    method: method || 'post'
  })
}
// 根据主键ID删除人员信息更新记录一条数据
export function deleteUpdaterecord(id) {
  return request({
    url: 'mpi/v1/updaterecord/' + id,
    method: 'delete'
  })
}
// 根据实体类数据更新人员信息更新记录数据
export function putUpdaterecord(obj) {
  return request({
    url: 'mpi/v1/updaterecord',
    method: 'put',
    data: obj
  })
}
