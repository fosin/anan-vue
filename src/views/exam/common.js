import { postRequest } from '@/utils/request'

export function fetchList(url, query) {
  return postRequest(url, query)
}

export function fetchDetail(url, id) {
  return postRequest(url, { 'id': id })
}

export function saveData(url, data) {
  return postRequest(url, data)
}

export function deleteData(url, ids) {
  return postRequest(url, { 'ids': ids })
}

export function changeState(url, ids, state) {
  return postRequest(url + '/' + state, ids)
}
