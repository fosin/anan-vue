import request, { postRequest } from '@/utils/request'

// 获取地址信息表数据分页列表
export function listAddressPage(page) {
  return request({
    url: 'gateway/mpi/v1/address/paging',
    method: 'post',
    data: page
  })
}
// 获取地址信息表所有数据列表
export function listAddress() {
  return postRequest('gateway/platform/v1/address/list')
}
// 获取地址信息表所有数据列表
export function listAddressByEmpId(id, page) {
  return request({
    url: 'gateway/mpi/v1/address/list/empId/' + id,
    method: 'post',
    data: page
  })
}
// 新建地址信息表
export function postAddress(obj) {
  return request({
    url: 'gateway/mpi/v1/address',
    method: 'post',
    data: obj
  })
}
// 根据主键ID获取地址信息表数据
export function getAddress(id, method) {
  return request({
    url: 'gateway/mpi/v1/address/' + id,
    method: method || 'post'
  })
}
// 根据主键ID删除地址信息表一条数据
export function deleteAddress(id) {
  return request({
    url: 'gateway/mpi/v1/address/' + id,
    method: 'delete'
  })
}
// 根据实体类数据更新地址信息表数据
export function putAddress(obj) {
  return request({
    url: 'gateway/mpi/v1/address',
    method: 'put',
    data: obj
  })
}
