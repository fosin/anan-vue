import { downloadFileRequest, postRequest, uploadFormRequest } from '@/utils/request'

/**
 * 创建试卷
 * @param data
 */
export function createPaper(data) {
  return postRequest('gateway/exam/api/paper/paper/create-paper', data)
}

/**
 * 试卷详情
 * @param data
 */
export function paperDetail(paperId) {
  return postRequest('gateway/exam/api/paper/paper/paper-detail/' + paperId)
}

/**
 * 试题详情
 * @param data
 */
export function quDetail(data) {
  return postRequest('gateway/exam/api/paper/paper/qu-detail', data)
}

/**
 * 填充答案
 * @param data
 */
export function fillAnswer(data) {
  return postRequest('gateway/exam/api/paper/paper/fill-answer', data)
}

/**
 * 交卷
 * @param data
 */
export function handExam(paperId) {
  return postRequest('gateway/exam/api/paper/paper/hand-exam/' + paperId)
}

/**
 * 试卷详情
 * @param data
 */
export function paperResult(paperId) {
  return postRequest('gateway/exam/api/paper/paper/paper-result/' + paperId)
}

/**
 * 错题训练
 * @param data
 */
export function training(data) {
  return postRequest('gateway/exam/api/paper/paper/training', data)
}

/**
 * 上传照片
 * @param data
 */
export function uploadPhotoFromCamera(data) {
  // 调用接口上传图片
  const formData = new FormData()
  formData.append('paperId', data.paperId)
  formData.append('name', data.name)
  formData.append('file', base64ToFile(data.dataUrl, data.name))
  return uploadFormRequest('gateway/exam/api/paper/paper/photo/upload', formData)
}

function base64ToFile(urlData, fileName) {
  const arr = urlData.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bytes = atob(arr[1])
  let n = bytes.length
  const ia = new Uint8Array(n)
  while (n--) {
    undefined
    ia[n] = bytes.charCodeAt(n)
  }
  return new File([ia], fileName, { type: mime })
}

/**
 * 查询考试所有拍照信息
 * @param paperId 考试编号
 */
export function listPhotoByPaperId(paperId) {
  return postRequest('gateway/exam/api/paper/paper/photo/list/' + paperId)
}

/**
 * 下载考试拍照图片
 * @param data
 */
export function downloadPhoto(data) {
  return downloadFileRequest('gateway/exam/api/paper/paper/photo/download', data)
}
