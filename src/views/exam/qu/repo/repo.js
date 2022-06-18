import { postRequest } from '@/utils/request'

/**
 * 题库详情
 */
export function fetchDetail(id, refs = '1') {
  return postRequest('gateway/exam/api/repo/' + id, { refs: refs })
}

/**
 * 保存题库
 */
export function createOrUpdate(data) {
  return postRequest('gateway/exam/api/repo/createOrUpdate', data)
}

/**
 * 题库列表
 */
export function fetchRepoList(data = {}) {
  return postRequest('gateway/exam/api/repo/list', data)
}

/**
 * 题库批量操作
 */
export function batchAction(data) {
  return postRequest('gateway/exam/api/repo/batch-action', data)
}
/**
 * 题库批量删除操作
 */
export function deleteRepoById(id) {
  return postRequest('gateway/exam/api/repo/delete/' + id)
}

/**
 * 题库批量操作
 */
export function fetchRepoChild(data) {
  return postRequest('gateway/exam/api/repo/listChild', data)
}
/**
 * 题库树型数据结构
 */
export function fetchRepoTree(userId) {
  return postRequest('gateway/exam/api/repo/tree/' + userId)
}
