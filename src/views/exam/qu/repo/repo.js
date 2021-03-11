import { postRequest } from '@/utils/request'

/**
 * 题库详情
 * @param data
 */
export function fetchDetail(data) {
  return postRequest('gateway/exam/api/repo/detail', data)
}

/**
 * 保存题库
 * @param data
 */
export function saveData(data) {
  return postRequest('gateway/exam/api/repo/save', data)
}

/**
 * 题库列表
 * @param data
 */
export function fetchRepoList(data) {
  return postRequest('gateway/exam/api/repo/list', data)
}

/**
 * 题库批量操作
 * @param data
 */
export function batchAction(data) {
  return postRequest('gateway/exam/api/repo/batch-action', data)
}

/**
 * 题库批量操作
 * @param pId
 */
export function fetchRepoChild(pId) {
  return postRequest('gateway/exam/api/repo/child/' + pId)
}
/**
 * 题库树型数据结构
 */
export function fetchRepoTree(userId) {
  return postRequest('gateway/exam/api/repo/tree/' + userId)
}
