import { getRequest, postRequest } from '@/utils/request'

export function pagingTree(data) {
  return postRequest('gateway/exam/api/sys/depart/paging', data)
}

export function fetchTree(data) {
  return postRequest('gateway/exam/api/sys/depart/tree', data)
}

export function fetchDetail(id, refs = '1') {
  return getRequest('gateway/exam/api/sys/depart/' + id, { refs: refs })
}

export function deleteData(ids) {
  const data = { ids: ids }
  return postRequest('gateway/exam/api/sys/depart/delete', data)
}

export function createOrUpdate(data) {
  return postRequest('gateway/exam/api/sys/depart/createOrUpdate', data)
}

export function sortData(id, sort) {
  const data = { id: id, sort: sort }
  return postRequest('gateway/exam/api/sys/depart/sort', data)
}
