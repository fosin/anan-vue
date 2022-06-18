import { exportExcelRequest, postRequest, uploadFileRequest } from '@/utils/request'

/**
 * 试题详情
 * @param data
 */
export function fetchDetail(id, refs = '1') {
  return postRequest('gateway/exam/api/qu/qu/' + id, { refs: refs })
}

/**
 * 保存试题
 * @param data
 */
export function createOrUpdate(data) {
  return postRequest('gateway/exam/api/qu/qu/createOrUpdate', data)
}

/**
 * 导出
 * @param data
 */
export function exportExcel(data) {
  return exportExcelRequest('gateway/exam/api/qu/qu/export', data)
}

/**
 * 导入模板
 * @param data
 */
export function importTemplate() {
  return exportExcelRequest('gateway/exam/api/qu/qu/import/template')
}

/**
 * 导出
 * @param data
 */
export function importExcel(file) {
  return uploadFileRequest('gateway/exam/api/qu/qu/import', file)
}

