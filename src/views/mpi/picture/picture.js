import request, { getRequest, postRequest } from '@/utils/request'

// 获取半身照数据分页列表
export function listPicturePage(page) {
  return request({
    url: 'gateway/mpi/api/picture/paging',
    method: 'post',
    data: page
  })
}
// 获取半身照所有数据列表
export function listPicture(data = {}) {
  return postRequest('gateway/mpi/api/picture/list', data)
}
// 新建半身照
export function postPicture(obj) {
  return request({
    url: 'gateway/mpi/api/picture',
    method: 'post',
    data: obj
  })
}
// 根据主键ID获取半身照数据
export function getPicture(id, params) {
  return getRequest('gateway/mpi/api/picture/' + id, params)
}
// 根据主键ID删除半身照一条数据
export function deletePicture(id) {
  return request({
    url: 'gateway/mpi/api/picture/' + id,
    method: 'delete'
  })
}
// 根据实体类数据更新半身照数据
export function putPicture(obj) {
  return request({
    url: 'gateway/mpi/api/picture',
    method: 'put',
    data: obj
  })
}
