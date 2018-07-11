import { validatenull } from '@/utils/validate'
/**
 * 如果type参数有效则存储sessionStorage，否则默认存储localStorage
 */
export const setWebStore = (params) => {
  const {
    name,
    content,
    type,
    datetime
  } = params
  const obj = {
    dataType: typeof (content),
    content: content,
    type: type || 'session',
    datetime: datetime || new Date().getTime()
  }
  if (obj.type) window.sessionStorage.setItem(name, JSON.stringify(obj))
  else window.localStorage.setItem(name, JSON.stringify(obj))
}
/**
 * 优先从localStorage获取，其次从sessionStorage获取
 */
export const getWebStore = (params) => {
  const {
    name,
    type
  } = params
  let content
  let obj
  if (type === 'session') {
    obj = window.sessionStorage.getItem(name)
  } else {
    obj = window.localStorage.getItem(name)
    if (validatenull(obj)) obj = window.sessionStorage.getItem(name)
  }
  if (validatenull(obj)) return
  obj = JSON.parse(obj)
  if (obj.dataType === 'string') {
    content = obj.content
  } else if (obj.dataType === 'number') {
    content = Number(obj.content)
  } else if (obj.dataType === 'boolean') {
    content = obj.content
    // content = eval(obj.content)
  } else if (obj.dataType === 'object') {
    content = obj.content
  }
  return content
}
/**
 * 删除localStorage、sessionStorage
 */
export const removeWebStore = params => {
  const {
    name
  } = params
  window.localStorage.removeItem(name)
  window.sessionStorage.removeItem(name)
}
