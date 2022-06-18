import { postRequest } from '@/utils/request'

/**
 * 试卷列表
 * @param userId
 * @param examId
 */
export function listPaper(userId, examId) {
  const pageModule = {
    pageNumber: 1,
    pageSize: 10,
    params: {
      userId: userId,
      examId: examId,
      sortRules: [{
        sortName: 'createTime',
        sortOrder: 'DESC'
      }
      ]
    }
  }
  return postRequest('gateway/exam/api/paper/paper/paging', pageModule)
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
