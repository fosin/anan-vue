import { postRequest } from '@/utils/request'

/**
 * 试卷列表
 * @param userId
 * @param examId
 */
export function listPaper(userId, examId) {
  return postRequest('gateway/exam/api/paper/paper/paging', {
    current: 1,
    size: 99,
    params: { userId: userId, examId: examId }
  })
}

/**
 * 提交阅卷结果
 * @param paperData 阅卷后的试卷信息
 */
export function reviewPaper(paperData) {
  return postRequest('gateway/exam/api/paper/paper/review-paper', paperData)
}

export function trycount(paperData) {
  return postRequest('gateway/exam/api/paper/paper/trycount', paperData)
}

/**
 * 考试通过率统计
 * @param params
 */
export function rateCount(params) {
  return postRequest('gateway/exam/api/paper/paper/rateCount', params)
}
